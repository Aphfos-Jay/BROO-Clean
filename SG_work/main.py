from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import cv2
from ultralytics import YOLO
import asyncio
import json
import logging

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

# YOLO 모델 초기화
model = YOLO('yolov8n.pt')

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            video_url = json.loads(data).get("url")
            
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
                    
                    # YOLO 설정 개선
                    results = model(frame, 
                        conf=0.55,  # 신뢰도 임계값 낮춤
                        iou=0.45,  # IOU 임계값 조정                       
                    )
                    
                    detections = []
                    for result in results:
                        boxes = result.boxes
                        for box in boxes:
                            x1, y1, x2, y2 = map(int, box.xyxy[0])
                            conf = float(box.conf[0])
                            cls_id = int(box.cls[0])
                            cls = result.names[cls_id]
                            
                            detections.append({
                                "x1": x1,
                                "y1": y1,
                                "x2": x2,
                                "y2": y2,
                                "class": cls,
                                "confidence": round(conf, 2)
                            })

                    await websocket.send_json({"detections": detections})
                    await asyncio.sleep(0.03)  # 프레임 처리 간격 줄임

            finally:
                cap.release()

    except Exception as e:
        logger.error(f"Error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)