from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# YOLOv8 모델 로드
@app.route('/oceanMonitoring', methods=['POST'])
def monitoring_anal():
    # 클라이언트에서 보낸 데이터를 받음
    latitude = request.json.get('latitude')
    longtitude = request.json.get('longtitude')

    # 데이터 처리 (예제: 위치 데이터를 기반으로 HTML 생성)
    processed_html = f"""
    <div>
        <p>Latitude: {latitude}</p>
        <p>longtitude: {longtitude}</p>
    </di
    """

    # 처리 결과를 반환
    return jsonify({'html': processed_html})

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=8052)



