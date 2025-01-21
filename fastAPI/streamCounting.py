from yolox.tracker.byte_tracker import BYTETracker
from ultralytics.utils import LOGGER
from collections import defaultdict
from argparse import Namespace
from ultralytics import YOLO
import numpy as np
import asyncio
import torch
import cv2

LOGGER.disabled = True  # Yolo 로그 생략

class StreamCounging:
    # 스트림 상태 관리 변수
    def __init__(self):
        self.streams = {}  # 스트림 ID와 관련 정보를 저장
        self.queues = defaultdict(asyncio.Queue)  # 스트림별 프레임큐
        self.text_queues = defaultdict(asyncio.Queue)  # 스트림별 텍스트큐
    
    # 스트림 추가 함수
    def add_stream(self, stream_id, url, model_path, target_class):
        if stream_id in self.streams:
            print(f"Stream {stream_id} already exists.")
            return
        self.streams[stream_id] = {
            "url": url,
            "model": YOLO(model_path),
            "tracker": BYTETracker(Namespace(
                track_thresh = 0.5,
                high_thresh = 0.6,
                match_thresh = 0.8,
                track_buffer = 30,
                mot20 = False,
            )),
            "target_class": target_class,
            "object_tracks": {},
            "in_count": 0,
        }
        print(f"Stream {stream_id} added.")

    # 스트림 제거 함수
    def remove_stream(self, stream_id):
        if stream_id in self.streams:
            del self.streams[stream_id]
            print(f"Stream {stream_id} removed.")

    # 스트림 처리 함수
    async def process_stream(self, stream_id):
        print(f"{stream_id} 스트림 시작!!!")

        if stream_id not in self.streams:
            print(f"Stream {stream_id} not found.")
            return
        
        stream = self.streams[stream_id]
        cap = cv2.VideoCapture(stream["url"])

        if not cap.isOpened():
            print(f"Failed to open stream {stream_id}")
            return
        
        frame_count = 0  # 프레임 카운트
        skip_frames = 5  # 프레임 건너뛰기 설정 (필요에 따라 조정 가능)

        try:
            while True:
                await asyncio.sleep(0.003)  # 루프주기(30 FPS 기준)

                ret, frame = cap.read()
                if not ret:
                    print(f"Stream {stream_id} reconnecting...")
                    cap.release()
                    cap = cv2.VideoCapture(stream['url'])
                    continue

                frame_count += 1
                if frame_count % skip_frames != 0:
                    continue
                # if frame_count % 5000 == 0:
                #     print("스트림 초기화")
                #     cap.release()
                #     cap = cv2.VideoCapture(stream['url'])

                # 객체 탐지 및 추적 로직
                frame = self.detect_and_track(frame, stream)

                # 프레임을 큐에 저장
                if self.queues[stream_id].full():
                    await self.queus[stream_id].get()
                _, buffer = cv2.imencode('.jpg', frame)
                await self.queues[stream_id].put(buffer.tobytes())

                # 텍스트를 큐에 저장
                if self.text_queues[stream_id].full():
                    await self.text_queues[stream_id].get()
                await self.text_queues[stream_id].put(str(stream['in_count']))

        finally:
            cap.release()

    # 객체 탐지
    def detect_and_track(self, frame, stream):
        results = stream['model'](frame)
        detections = []
        
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                if confidence > 0.5 and class_id in stream['target_class']:
                    detections.append([x1, y1, x2, y2, confidence])
                    # frame = self.blur_face(frame, x1, y1, x2, y2)  # 얼굴 블러 처리

        # ByteTrack으로 객체 추적
        img_info = (frame.shape[0], frame.shape[1])  # 이미지 정보
        detection_array = np.array(detections, dtype=float) if detections else np.empty((0, 5), dtype=float)  # 탐지 결과를 NumPy 배열로 변환
        detection_tensor = torch.tensor(detection_array, dtype=torch.float32)  # NumPy 배열을 PyTorch 텐서로 변환
        online_targets = stream['tracker'].update(detection_tensor, img_info, frame.shape)  # ByteTrack으로 객체 추적

        # 카운트 업데이트 및 프레임에 그리기
        stream['in_count'] = self.update_count_and_draw(online_targets, stream, frame)

        return frame
    
    # 얼굴부위 블러 처리
    def blur_face(self, frame, x1, y1, x2, y2):
        # 얼굴 영역만 블러 처리 추가 (원형 블러)
        face_x1 = max(0, int(x1))
        face_x2 = min(frame.shape[1], int(x2))
        face_y1 = max(0, int(y1))
        face_y2 = min(frame.shape[0], int(y2))

        # 얼굴의 상단 40% 영역만 블러 처리
        top_height = int((y2 - y1) * 0.3)
        face_y2 = face_y1 + top_height

        if face_x2 > face_x1 and face_y2 > face_y1:
            face_region = frame[face_y1:face_y2, face_x1:face_x2]

            # 원형 마스크 생성
            mask = np.zeros_like(face_region, dtype=np.uint8)
            center = ((face_x2 - face_x1) // 2, top_height // 2)  # 상단 중심
            radius = min((face_x2 - face_x1) // 2, (face_y2 - face_y1) // 2)
            cv2.circle(mask, center, radius, (255, 255, 255), -1)

            # 블러 처리
            blurred_face = cv2.GaussianBlur(face_region, (31, 31), 15)

            # 원형 마스크 적용
            masked_blur = cv2.bitwise_and(blurred_face, mask)
            inverse_mask = cv2.bitwise_not(mask)
            original_face = cv2.bitwise_and(face_region, inverse_mask)

            # 블러와 원본 결합
            face_region = cv2.add(masked_blur, original_face)
            frame[face_y1:face_y2, face_x1:face_x2] = face_region

        return frame

    # 객체 카운트 업데이트 및 프레임에 그리기
    def update_count_and_draw(self, online_targets, stream, frame):
        
        # mid_x = frame.shape[1] // 2 - 28  # 프레임 가로 중앙
        # mid_y = frame.shape[0] // 2  # 프레임 세로 중앙
        # start_y = 0  # 세로선 시작점 (화면 중간 기준 위쪽)
        # end_y = 370    # 세로선 끝점

        mid_x = frame.shape[1] // 2  # 프레임 가로 중앙
        mid_y = frame.shape[0] // 2  # 프레임 세로 중앙
        object_tracks = stream['object_tracks']
        in_count = stream['in_count']

        for target in online_targets:
            track_id = target.track_id  # 객체 ID
            x1, y1, w, h = target.tlwh  # 객체의 좌표 및 크기
            x1, y1, x2, y2 = int(x1), int(y1), int(x1 + w), int(y1 + h)  # 박스 좌표 변환
            center_x = int(x1 + (x2 - x1) // 2)  # 객체 중심 X 좌표
            center_y = int(y1 + (y2 - y1) // 2)  # 객체 중심 Y 좌표
            

            # 객체가 중간선을 넘어갔는지 확인
            if track_id in object_tracks:
                prev_x, prev_y = object_tracks[track_id]  # 이전 프레임의 중심 좌표
                if prev_y < mid_y <= center_y:  # 위 -> 아래로 이동
                    in_count += 1  # 카운트 증가
                elif prev_y > mid_y >= center_y:  # 아래 -> 위로 이동
                    in_count -= 1  # 카운트 감소
            
            # 현재 객체 위치 저장
            object_tracks[track_id] = (center_x, center_y)

            # # 사람 발 기준
            # foot_x = int(x1 + (x2 - x1) / 2)  # x좌표 (바운딩 박스 중앙)
            # foot_y = int(y2 - 5)  # y좌표 y1=최상단 y2=최하단
            # if start_y <= foot_y <= end_y:  # 기준점이 세로선 범위 내에 있는 경우
            #     if track_id in object_tracks:
            #         prev_x, prev_y = object_tracks[track_id]  # 이전 프레임의 중심 좌표
            #         if prev_x < mid_x and foot_x >= mid_x:
            #             in_count += 1  # 카운트 증가
            #         elif prev_x > mid_x and foot_x <= mid_x:
            #             in_count -= 1  # 카운트 감소
            # object_tracks[track_id] = (foot_x, foot_y)

            # 디텍션 박스 그리기
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"ID: {track_id}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            cv2.circle(frame, (center_x, center_y), 5, (0, 0, 255), -1)

        # 영상 중간 부분에 기준선 그리기
        cv2.line(frame, (0, mid_y), (frame.shape[1], mid_y), (255, 0, 0), 1)
        # cv2.line(frame, (mid_x, start_y), (mid_x, end_y), (255, 0, 0), 2)
        # 현재 카운팅 값을 화면에 표시
        # cv2.putText(frame, f"Count: {in_count}", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        return in_count