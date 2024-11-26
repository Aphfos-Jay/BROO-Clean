from flask import Flask, request, jsonify
from ultralytics import YOLO
import cv2
import numpy as np

app = Flask(__name__)

# YOLOv8 모델 로드
model = YOLO('yolov8s.pt')

@app.route('/predict', methods=['POST'])
def predict():
    # 비디오 또는 이미지 데이터를 받아서 처리
    file = request.files['file']
    img_array = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    
    # YOLOv8으로 객체 탐지 수행
    results = model(img)  # 모델 추론
    detections = results.pandas().xywh  # 결과에서 객체 정보 추출

    # 탐지된 객체 정보를 JSON으로 반환
    return jsonify(detections.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)