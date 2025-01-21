from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from streamCounting import StreamCounging
import asyncio

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

url_1 = 'rtsp://210.99.70.120:1935/live/cctv002.stream'
url_2 = 'rtsp://210.99.70.120:1935/live/cctv015.stream'  # 6,15,31
url_3 = 'rtsp://192.168.0.108'
model = './yolov8n.pt'
target_class = [2, 5, 7]

# StreamCountin 인스턴스 생성
stream_manager = StreamCounging()

# 스트림 추가
stream_manager.add_stream('stream1', url_1, model, target_class)
stream_manager.add_stream("stream2", url_2, model, target_class)

@app.on_event('startup')
async def startup_event():
    asyncio.create_task(stream_manager.process_stream('stream1'))
    asyncio.create_task(stream_manager.process_stream('stream2'))

@app.websocket('/stream/{stream_id}')
async def websocket_endpoint(websocket: WebSocket, stream_id: str):

    # if stream_id not in ['stream1', 'stream2']:
    #     await websocket.close(code=403)  # 잘못된 stream_id 요청 거부
    #     return

    await websocket.accept()
    print(f"Connected to {stream_id}")

    if stream_id not in stream_manager.streams:
        await websocket.close()
        return
    
    try:
        while True:
            # 스트림 큐에서 프레임 가져오기
            frame = await stream_manager.queues[stream_id].get()
            # 웹소켓을 통해 클라이언트로 프레임 전송
            await websocket.send_bytes(frame)

            # 현재 카운트 값을 텍스트로 전송
            count = await stream_manager.text_queues[stream_id].get()
            await websocket.send_text(count)

            await asyncio.sleep(0.003)

    except WebSocketDisconnect:
        print(f"WebSocket disconnected for stream {stream_id}")
    except Exception as e:
        print(f"Error in WebSocket for {stream_id}: {e}")

@app.get('/counting/{stream_id}')
async def get_counting(stream_id: str):

    if stream_id not in stream_manager.streams:
        return {"Error": "stream not found"}
    
    count = stream_manager.streams[stream_id]['in_count']
    return {"stream_id": stream_id, "count": count}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='localhost', port=8000)

# uvicorn app:app --host 0.0.0.0 --port 8000