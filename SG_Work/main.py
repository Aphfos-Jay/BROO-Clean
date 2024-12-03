from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import cv2
from ultralytics import YOLO
import asyncio
import json
import logging
import uvicorn
import requests

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영환경에서는 구체적인 도메인을 지정하세요
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            video_url = json.loads(data).get("url")
            print('메인서버 websocket URL 받았음')
            
            if not video_url:
                continue

            cap = cv2.VideoCapture(video_url)
            if not cap.isOpened():
                continue

            try:
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break

                    # 이미지 전처리 추가
                    frame = cv2.resize(frame, (640, 480))
                    
                    # 부 서버로 HTTP 요청 전송
                    _, buffer = cv2.imencode('.jpg', frame)
                    response = requests.post(
                        "http://localhost:8054/predict",  # 부 서버 URL
                        files={"file": buffer.tobytes()}
                    )

                    # 부 서버로부터 YOLO 결과 수신
                    detections = response.json()

                    # 클라이언트로 결과 전송
                    await websocket.send_json({"detections": detections})
                    await asyncio.sleep(0.03)  # 프레임 처리 간격 줄임

            finally:
                cap.release()

    except Exception as e:
        logger.error(f"Error: {e}")
    finally:
        await websocket.close()


if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8053)