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
CORS(app, resources={r"/oceanMonitoring": {"origins": "*"}, r"/trashForecast": {"origins": "*"}})

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

def calculate_new_position(lat, lon, dx, dy, minutes):
    new_lat = lat + (dy * minutes * 20 / 111000)  # 위도는 약 111km 당 1도
    new_lon = lon + (dx * minutes * 20 / (111000 * np.cos(np.radians(lat))))  # 경도는 위도에 따라 달라짐
    return new_lat, new_lon
    
# sheet_data란 변수에 Json 데이터로 가져오는 거
def get_sheet_data(minutes):
    params = {'minutes': minutes}
    # 필요한 API 파라미터 정의
    response = requests.get(FORECAST_API_URL, params=params)
    
    # 응답 상태 확인
    if response.status_code == 200:
        # JSON 데이터를 Pandas DataFrame으로 변환
        return response.json()
    else:
        raise ValueError(f"API 호출 실패: {response.status_code} - {response.text}")

# 지도 생성 함수
def create_map_forecast(lat, lon, data):
    
    # 지도 생성
    m = folium.Map(centerForcast, zoom_start=11)

    # 속도에 따른 색상 맵
    colormap = cm.LinearColormap(colors=['blue','green','orange','red'], vmin=1, vmax=62) # 데이터베이스 내에서 값 직접 확인
    colormap.caption = 'Current Speed (m/s)'

    if lat is not None and lon is not None:
        # 평균 벡터 계산

        avg_dx10, avg_dy10 = get_average_vector(lat, lon, data['10'])
        avg_dx20, avg_dy20 = get_average_vector(lat, lon, data['20'])
        avg_dx30, avg_dy30 = get_average_vector(lat, lon, data['30'])

        new10 = calculate_new_position(lat, lon, avg_dx10, avg_dy10, 10)
        new20 = calculate_new_position(lat, lon, avg_dx20, avg_dy20, 20)
        new30 = calculate_new_position(lat, lon, avg_dx30, avg_dy30, 30)   

        # 현재 위치 마커 추가
        folium.Marker(
            location=[lat, lon],
            popup="Current location",
            icon=folium.Icon(color='blue')
        ).add_to(m)


        folium.Marker(location=new10, popup="After 10 Minutes", icon=folium.Icon(color='green')).add_to(m)
        folium.Marker(location=new20, popup="After 20 Minutes", icon=folium.Icon(color='orange')).add_to(m)
        folium.Marker(location=new30, popup="After 30 Minutes", icon=folium.Icon(color='red')).add_to(m)

    # 평균 predicted_speed 계산 
    recordLength = len(data['0'])  # 각 key에 동일한 레코드 수가 있다고 가정
    average_speeds_per_record = []

    # 각 레코드 순서별로 평균 predicted_speed 계산
    for i in range(recordLength):
        speeds = []
        for key in ['0', '10', '20', '30']:
            # key에서 i번째 레코드의 predicted_speed 가져오기
            if i < len(data[key]):  # 레코드 수가 맞는지 확인
                speeds.append(data[key][i]['predicted_speed'])
        if speeds:  # speed 값이 있다면 평균 계산
            average_speeds_per_record.append(sum(speeds) / len(speeds))
        
    # 결과 출력
    for i, avg_speed in enumerate(average_speeds_per_record):
        start = [data['0'][i]['latitude'], data['0'][i]['longtitude']]

         # dx, dy 계산 (평균 속도 사용)W
        avg_direction = sum(
            [data[key][i]['predicted_dir'] for key in ['0', '10', '20', '30']] if i < len(data[key]) else []
        ) / 4  
        # 방향 평균
        dx = avg_speed * np.cos(np.radians(avg_direction))
        dy = avg_speed * np.sin(np.radians(avg_direction))

        end = [start[0] + dy * 0.01, start[1] + dx * 0.01]

        midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]

        folium.Marker(
                location=midpoint,
                icon=folium.DivIcon(
                    html=f"""
                    <div style="
                        transform: rotate({avg_direction}deg); 
                        font-size: 16px; 
                        color: {colormap(avg_speed)};">
                        ➤
                    </div>
                    """
                )
            ).add_to(m)

            # Folium PolyLine 추가
        folium.PolyLine(
            locations=[start, end],
            color=colormap(avg_speed),
            weight=2,
            opacity=0.6,
        ).add_to(m)

        # folium.plugins.PolyLineTextPath( '▶', offset=20, repeat=True).add_to(m)

        # Folium CircleMarker 추가
        folium.CircleMarker(
            location=start,
            radius=1,
            color=colormap(avg_speed),
            fill=True,
            fill_color=colormap(avg_speed),
            fill_opacity=0.7
        ).add_to(m)


    return m._repr_html_()

# 라우트 설정
@app.route('/oceanMonitoring', methods=['POST'])
def OceanMonitoring():
     # 클라이언트에서 보낸 데이터를 받음
    global centerForcast
    try:
        latitude = request.json.get('latitude')
        longtitude = request.json.get('longtitude')
      
    except ValueError:
        latitude, longtitude = None, None
    
    if latitude is None or longtitude is None:
        returnHTML = render_template_string(HTML_TEMPLATE_NULL)
        flag = 0;
    else:

        centerForcast = [latitude, longtitude]

        data = {
            '0': get_sheet_data(0),
            '10': get_sheet_data(10),
            '20': get_sheet_data(20),
            '30': get_sheet_data(30)
        }

        map_html = create_map_forecast( latitude, longtitude, data)

        returnHTML =  render_template_string(HTML_TEMPLATE_FORCAST, map_html=map_html, lat=latitude, lon=longtitude)
        flag =1;
    response = {'html':returnHTML, 'flag':flag}
    return jsonify(response)

#####################해양오염분포 추적###################################
# 쓰레기 데이터 하는거 
def create_map_trash():
    # 데이터 로드
    data = pd.DataFrame(requests.get(TRASH_API_URL).json())

    # 지도 생성: 첫 번째 A 위치를 중심으로 설정
    center_lat = data.loc[data['minutes'] == 0, 'latitude'].iloc[0]
    center_lon = data.loc[data['minutes'] == 0, 'longtitude'].iloc[0]
    m2 = folium.Map(location=[center_lat, center_lon], zoom_start=12)

    # 데이터 분리: minutes별로 그룹화
    grouped_data = {minutes: data[data['minutes'] == minutes] for minutes in [0, 10, 20, 30]}

    # PolyLine 및 화살표 추가
    num_records = len(grouped_data[0])  # 각 그룹의 데이터 개수 (예: 60개)
    for i in range(num_records):
        path = []  # 경로 초기화
        
        for minutes in [0, 10, 20, 30]:
            point = grouped_data[minutes].iloc[i][['latitude', 'longtitude']].values.tolist()
            path.append(point)

        ipath= folium.PolyLine(
            locations=path,
            color="black",
            weight=2,
            opacity=0.8
        ).add_to(m2)

        # 화살표 추가 (각 구간마다)

        folium.plugins.PolyLineTextPath(ipath, '▶', offset=20, repeat=True).add_to(m2)           
        
    
    # 시작점(A)와 끝점(D) 마커 추가
    for i in range(num_records):
        # A 위치
        folium.Marker(
            location=grouped_data[0].iloc[i][['latitude', 'longtitude']].values.tolist(),
            popup=f"Start: A (Record {i+1})",
            icon=folium.Icon(color="blue", icon="info-sign")
        ).add_to(m2)

        # D 위치
        folium.Marker(
            location=grouped_data[30].iloc[i][['latitude', 'longtitude']].values.tolist(),
            popup=f"End: D (Record {i+1})",
            icon=folium.Icon(color="red", icon="info-sign")
        ).add_to(m2)
    
    return m2._repr_html_()


@app.route("/trashForecast", methods=["POST"])
def trashForecast():
    global centerTrash

    map_html = create_map_trash()
    # HTML 템플릿 렌더링
    returnHTML =  render_template_string(HTML_TEMPLATE_TRASH, map_html=map_html)
    response = {'html':returnHTML}
    return jsonify(response)


# 앱 실행
if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=8052)

