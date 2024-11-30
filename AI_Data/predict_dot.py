from flask import Flask, render_template_string, request,jsonify
# from flask_cors import CORS
import pandas as pd
import folium
import numpy as np
import requests
from folium.plugins import HeatMap
from flask_cors import CORS
import branca.colormap as cm

# Flask 앱 초기화
app = Flask(__name__)
CORS(app)

# 데이터 로드
FORECAST_API_URL = "http://localhost:5000/api/forecasts";
TRASH_API_URL = 'http://localhost:5000/api/trashForecasts';

# 지도 중심 설정
centerForcast = []
centerTrash = [34.046787, 127.288294]

# HTML 템플릿
HTML_TEMPLATE_FORCAST = """
<!DOCType html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Map</title>
</head>
<body>
    <div style="margin-top: 20px;">
        {% if map_html %}
        {{ map_html|safe }}
        {% endif %}
    </div>
</body>
</html>
"""


HTML_TEMPLATE_TRASH = """
<!DOCType html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Map</title>
</head>
<body>
    <div style="margin-top: 20px;">
        {% if map_html %}
        {{ map_html|safe }}
        {% endif %}
    </div>
</body>
</html>
"""


HTML_TEMPLATE_NULL = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Missing Input</title>

        </head>
        <body>
            <div class="container">
                <h1>위도와 경도 값을 입력해주세요.</h1>
                
            </div>
        </body>
        </html>
        """
# 평균 벡터 계산 함수
def get_average_vector(lat, lon, paramData):

    data = pd.DataFrame(paramData);

    data['distance'] = np.sqrt((data['latitude'] - lat) ** 2 + (data['longtitude'] - lon) ** 2)
    nearest_data = data.nsmallest(4, 'distance')

    total_dx, total_dy = 0, 0
    for _, row in nearest_data.iterrows():
        dx = row['predicted_speed'] * np.cos(np.radians(row['predicted_dir']))
        dy = row['predicted_speed'] * np.sin(np.radians(row['predicted_dir']))
        total_dx += dx
        total_dy += dy
    

    avg_dx = total_dx / len(nearest_data)
    avg_dy = total_dy / len(nearest_data)
    return avg_dx, avg_dy

# 지도 생성 함수
def create_map_forecast(lat=None, lon=None, minutes=0):
    params = {'minutes': minutes}
    sheet_data = requests.get(FORECAST_API_URL, params=params).json()

    # 지도 생성
    m = folium.Map(location=centerForcast, zoom_start=11)

    # 속도에 따른 색상 맵
    colormap = cm.LinearColormap(colors=['blue', 'red'], vmin=1, vmax=107)
    colormap.caption = 'Current Speed (m/s)'

    if lat is not None and lon is not None:
        # 평균 벡터 계산
        avg_dx, avg_dy = get_average_vector(lat, lon, sheet_data)

        # 현재 위치 마커 추가
        folium.Marker(
            location=[lat, lon],
            popup="Current location",
            icon=folium.Icon(color='black')
        ).add_to(m)

        # 예상 위치 계산 및 마커 추가
        for forecast_minutes in [10, 20, 30]:
            new_lat = lat + (avg_dy * forecast_minutes * 20 / 111000)
            new_lon = lon + (avg_dx * forecast_minutes * 20 / (111000 * np.cos(np.radians(lat))))
            folium.Marker(
                location=[new_lat, new_lon],
                popup=f"Forecast for {forecast_minutes} minutes",
                icon=folium.Icon(
                    color='blue' if forecast_minutes == 10 else 'green' if forecast_minutes == 20 else 'red'
                )
            ).add_to(m)

    # 폴리라인 및 원 추가
    for row in sheet_data:
        start = [row['latitude'], row['longtitude']]
        dx = row['predicted_speed'] * np.cos(np.radians(row['predicted_dir']))
        dy = row['predicted_speed'] * np.sin(np.radians(row['predicted_dir']))
        end = [row['latitude'] + dy * 0.01, row['longtitude'] + dx * 0.01]

        folium.PolyLine(
            locations=[start, end],
            color="blue",
            weight=2,
            opacity=0.6
        ).add_to(m)

        folium.CircleMarker(
            location=start,
            radius=1,
            color=colormap(row['predicted_speed']),
            fill=True,
            fill_color=colormap(row['predicted_speed']),
            fill_opacity=0.7
        ).add_to(m)

    # 지도 반환
    return m._repr_html_()
# 쓰레기 데이터 하는거 
def create_map_trash(minutes):
    
    params = {'minutes': minutes}

    filtered_data = pd.DataFrame(requests.get(TRASH_API_URL, params=params).json());
    # Folium 지도 생성
    m = folium.Map(location=centerTrash, zoom_start=14)
    HeatMap(data=filtered_data[['latitude', 'longtitude']], radius=20).add_to(m)
    return m._repr_html_()  # Folium 지도를 HTML로 반환

# 라우트 설정
@app.route('/oceanMonitoring', methods=['POST'])
def OceanMonitoring():
     # 클라이언트에서 보낸 데이터를 받음
    global centerForcast
    try:
        latitude = request.json.get('latitude')
        longtitude = request.json.get('longtitude')
        minutes = request.json.get('min')
      
     
    except ValueError:
        latitude, longtitude = None, None
    
    if latitude is None or longtitude is None:
        returnHTML = render_template_string(HTML_TEMPLATE_NULL)
        flag = 0;
    else:

        centerForcast = [latitude, longtitude]
        map_html = create_map_forecast( latitude, longtitude,minutes)
        returnHTML =  render_template_string(HTML_TEMPLATE_FORCAST, map_html=map_html, lat=latitude, lon=longtitude)
        flag =1;
    response = {'html':returnHTML, 'flag':flag}
    return jsonify(response)


@app.route("/trashForecast", methods=["POST"])
def trashForecast():
    global centerTrash

    minutes = request.json.get('min')

    map_html = create_map_trash(minutes)
    # HTML 템플릿 렌더링
    returnHTML =  render_template_string(HTML_TEMPLATE_TRASH, map_html=map_html)
    response = {'html':returnHTML}
    return jsonify(response)


# 앱 실행
if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=8052)
