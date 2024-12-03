from flask import Flask, request, jsonify
from ultralytics import YOLO
import cv2
import numpy as np

app = Flask(__name__)

# YOLOv8 모델 로드
model = YOLO('best21.pt')

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    img_array = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    
    # YOLOv8으로 객체 탐지 수행
    results = model(img)
    detections = []
    for result in results:
        for box in result.boxes:
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

    return jsonify(detections)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8054)