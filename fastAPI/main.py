from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from yolox.tracker.byte_tracker import BYTETracker
from ultralytics.utils import LOGGER
from ultralytics import YOLO
from argparse import Namespace
import numpy as np
import threading
from asyncio import Queue
import asyncio
import uvicorn  # FastAPI 서버 실행을 위한 라이브러리
import torch
import cv2

LOGGER.disabled = True  # Yolo 로그 생략

# FastAPI 애플리케이션 생성
app = FastAPI()
lock = threading.Lock()  # 스레드 안정성 보장
frame_queue = Queue(maxsize=30)  # 최대 30개의 프레임만 저장

# YOLO 및 ByteTrack 초기화
model = YOLO('./yolov8n.pt')

# 전역 변수 초기화
image_buffer = None  # 최신 이미지를 저장하는 전역 변수
count_num = 0
url = 'rtsp://210.99.70.120:1935/live/cctv002.stream'

# RTSP 스트림 재연결 함수
async def reconnect(text, cap, url):
    print(f'{text}. RTSP 스트림 재연결 중')
    cap.release()
    cap = cv2.VideoCapture(url)
    await asyncio.sleep(1)  # 1초 대기
    return cap

# RTSP 유지 및 카운팅 업데이트 
async def update_count(model, url):
    print("RTSP 스트림 연결 시작")

    global image_buffer, count_num
    TARGET_CLASS = [2, 5, 7]  # 탐지할 객체 클래스 ID
    frame_count = 0
    skip_frames = 5
    object_tracks = {}  # 객체의 이전 위치를 저장하는 딕셔너리
    tracker_args = Namespace(track_thresh=0.5, hight_thresh=0.6, match_thresh=0.8, track_buffer=30, mot20=False)  # ByteTrack 설정
    tracker = BYTETracker(tracker_args)  # ByteTrack 인스턴스 생성
    cap = cv2.VideoCapture(url)  # RTSP 스트림 열기

    if not cap.isOpened():
        print("RTSP 스트림 열기 실패")
        return

    try:
        while True:
            await asyncio.sleep(0.03)  # 비동기 대기

            if not cap.isOpened():
                cap = await reconnect("연결 실패", cap, url)
                continue

            ret, frame = cap.read()  # 프레임 읽기
            if not ret:
                cap = await reconnect("frame 읽기실패", cap, url)
                continue
            
            frame_count += 1
            if frame_count % skip_frames !=0:
                continue
            # if frame_count % 5000 == 0:
            #     print("스트림 초기화")
            #     cap.release()
            #     cap = cv2.VideoCapture(url)

            frame_height, frame_width = frame.shape[:2]
            mid_y = frame_height // 2

            # 객체 탐지
            results = model(frame)  # YOLO로 객체 탐지
            detections = []  # 객체 탐지 결과를 저장할 리스트
            
            for result in results:
                for box in result.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()  # 객체의 좌표 추출
                    confidence = float(box.conf[0])  # 객체의 신뢰도 추출
                    class_id = int(box.cls[0])  # 객체의 클래스 ID 추출
                    if confidence > 0.5 and class_id in TARGET_CLASS:  # 신뢰도가 0.5 이상인 객체만 탐지
                        detections.append([x1, y1, x2, y2, confidence])  # 탐지 결과 저장

            # ByteTrack으로 객체 추적
            img_info = (frame.shape[0], frame.shape[1])  # 이미지 정보
            detection_array = np.array(detections, dtype=float) if detections else np.empty((0, 5), dtype=float)  # 탐지 결과를 NumPy 배열로 변환
            detection_tensor = torch.tensor(detection_array, dtype=torch.float32)  # NumPy 배열을 PyTorch 텐서로 변환
            online_targets = tracker.update(detection_tensor, img_info, frame.shape)  # ByteTrack으로 객체 추적

            # 객체 ID를 기준으로 카운트 업데이트
            for target in online_targets:
                track_id = target.track_id  # 객체 ID
                x1, y1, w, h = target.tlwh  # 객체의 좌표 및 크기
                x1, y1, x2, y2 = int(x1), int(y1), int(x1 + w), int(y1 + h)  # 박스 좌표 변환
                center_x = int(x1 + (x2 - x1) // 2)  # 객체의 중심 x 좌표
                center_y = int(y1 + (y2 - y1) // 2)  # 객체의 중심 Y 좌표
                mid_y = frame.shape[0] // 2  # 프레임 중앙선

                # 객체가 중간선을 넘어갔는지 확인
                if track_id in object_tracks:
                    prev_x, prev_y = object_tracks[track_id]  # 이전 프레임의 중심 Y 좌표    
                    if prev_y < mid_y <= center_y:  # 위 -> 아래로 이동
                        count_num += 1  # 카운트 증가
                    elif prev_y > mid_y >= center_y:  # 아래 -> 위로 이동
                        count_num -= 1  # 카운트 감소
                
                # 현재 객체 위치 저장
                object_tracks[track_id] = (center_x, center_y)

                # 디텍팅 박스 그리기
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"ID: {track_id}", (x1, y1 - 10), cv2. FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
                cv2.circle(frame, (center_x, center_y), 5, (0,0,255), -1)

            # 영상 중간 부분에 가로선 그리기
            cv2.line(frame, (0, mid_y), (frame_width, mid_y), (255,0,0), 1)
            # 현재 카운팅 값을 화면에 표시
            cv2.putText(frame, f"Count: {count_num}", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            
            # 프레임을 JPEG로 인코딩
            _, buffer = cv2.imencode('.jpg', frame)

            # # 웹소켓을 통해 클라이언트로 프레임 전송
            # await websocket.send_bytes(buffer.tobytes())
            # await websocket.send_text(f"count_num: {count_num}")  # 카운트 정보 전송
            
            # 최신 이미지를 전역 변수에 저장
            with lock:
                # image_buffer = buffer.tobytes()
                
                # asyncio.Queue 사용
                if frame_queue.full():
                    await frame_queue.get()  # 가장 오래된 프레임 제거
                await frame_queue.put(buffer.tobytes())
            
            await asyncio.sleep(0.03)  # 루프 주기 조절. 0.03초 (30FPS)

    except WebSocketDisconnect:
        print("WebSocket 연결 종료")
    except Exception as e:
        print(f"RTSP 스트림 연결 오류: {e}")
    finally:
        cap.release()  # RTSP 스트림 닫기
        # await websocket.close()  # 웹소켓 연결 종료

# root 경로 접속 시,
@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}

# favicon.ico 요청 시,
@app.get("/favicon.ico")
async def favicon():
    return {"message": "No favicon available"}

# count_num 반환 API
@app.get("/counting")
async def get_count():
    return {
        "count_num": count_num
    }

async def stream_useQueue(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            frame = await frame_queue.get()
            await websocket.send_bytes(frame)
            await websocket.send_text(str(count_num))

            # # image_buffer 사용
            # with lock:
            #     if image_buffer:
            #         await websocket.send_bytes(image_buffer)
            #     await websocket.send_text((f"{count_num}"))
            # await asyncio.sleep(0.03)  # 30 FPS

    except WebSocketDisconnect:
        print("WebSocket connection closed")

# 웹소켓 API
@app.websocket("/stream")
async def websocket_endpoint(websocket: WebSocket):
    await stream_useQueue(websocket)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용 (필요에 따라 제한 가능)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FastAPI startup 이벤트에 update_count 함수 등록
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(update_count(model, url, frame_queue, "count_num"))

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutdown initiated")

if __name__ == '__main__':
    uvicorn.run(app, host='localhost', port=8000)  # FastAPI 서버 실행

# CLI실행명령어: uvicorn main:app --host 0.0.0.0 --port 8000