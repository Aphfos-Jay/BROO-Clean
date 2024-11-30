from flask import Flask, render_template_string, request
# from flask_cors import CORS
import pandas as pd
import folium
import numpy as np
from folium.plugins import HeatMap

# Flask 앱 초기화
app = Flask(__name__)
# CORS(app)

# 데이터 로드
file_path = 'multi_step_forecast_results.xlsx'
try:
    sheets = pd.ExcelFile(file_path).sheet_names
    data = {sheet: pd.read_excel(file_path, sheet_name=sheet) for sheet in sheets}
except FileNotFoundError:
    print(f"파일 {file_path}이(가) 존재하지 않습니다.")
    exit(1)

# 지도 중심 설정
center = [36.5, 127.5]

# HTML 템플릿
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Map</title>
</head>
<body>
    <h1>Interactive Forecast Map</h1>
    <form method="get">
        <label for="sheet">Select a Map:</label>
        <select name="sheet" id="sheet">
            {% for sheet in sheets %}
            <option value="{{ sheet }}" {% if sheet == selected %}selected{% endif %}>{{ sheet }}</option>
            {% endfor %}
        </select>
        <label for="lat">Latitude:</label>
        <input type="text" id="lat" name="lat" value="{{ lat }}" placeholder="Enter Latitude">
        <label for="lon">Longitude:</label>
        <input type="text" id="lon" name="lon" value="{{ lon }}" placeholder="Enter Longitude">
        <button type="submit">Show Map</button>
    </form>
    <div style="margin-top: 20px;">
        {% if map_html %}
        {{ map_html|safe }}
        {% endif %}
    </div>
</body>
</html>
"""

# 평균 벡터 계산 함수
def get_average_vector(lat, lon, data):
    data['distance'] = np.sqrt((data['latitude'] - lat) ** 2 + (data['longitude'] - lon) ** 2)
    nearest_data = data.nsmallest(4, 'distance')

    total_dx, total_dy = 0, 0
    for _, row in nearest_data.iterrows():
        dx = row['predicted_speed'] * np.cos(np.radians(row['predicted_dir']))
        dy = row['predicted_speed'] * np.sin(np.radians(row['predicted_dir']))
        total_dx += dx
        total_dy += dy
    
    # avg_dx_10, avg_dy_10 = get_average_vector(lat, lon, data['current'])
    # avg_dx_20, avg_dy_20 = get_average_vector(lat, lon, data['10min_forecast'])
    # avg_dx_30, avg_dy_30 = get_average_vector(lat, lon, data['20min_forecast'])

    avg_dx = total_dx / len(nearest_data)
    avg_dy = total_dy / len(nearest_data)
    return avg_dx, avg_dy

# 지도 생성 함수
def create_map(sheet_name, lat=None, lon=None):
    sheet_data = data[sheet_name]

    m = folium.Map(location=center, zoom_start=6)

    if lat is not None and lon is not None:
        avg_dx, avg_dy = get_average_vector(lat, lon, sheet_data)
        # 예상 위치
        for minutes in [10, 20, 30]:
            new_lat = lat + (avg_dy * minutes * 20 / 111000)
            new_lon = lon + (avg_dx * minutes * 20 / (111000 * np.cos(np.radians(lat))))
            folium.Marker(location=[new_lat, new_lon],
                          popup=f"Forecast for {minutes} minutes",
                          icon=folium.Icon(color='blue' if minutes == 10 else 'green' if minutes == 20 else 'red')).add_to(m)

    for _, row in sheet_data.iterrows():
        start = [row['latitude'], row['longitude']]
        dx = row['predicted_speed'] * np.cos(np.radians(row['predicted_dir']))
        dy = row['predicted_speed'] * np.sin(np.radians(row['predicted_dir']))
        end = [row['latitude'] + dy * 0.01, row['longitude'] + dx * 0.01]
        folium.PolyLine(locations=[start, end], color="blue", weight=1, opacity=0.6).add_to(m)

    return m._repr_html_()

# 라우트 설정
@app.route("/", methods=["GET"])
def index():
    sheet_name = request.args.get("sheet", "current")
    try:
        lat = float(request.args.get("lat", 0))
        lon = float(request.args.get("lon", 0))
    except ValueError:
        lat, lon = None, None

    if sheet_name not in data:
        sheet_name = "current"

    map_html = create_map(sheet_name, lat, lon)
    return render_template_string(HTML_TEMPLATE, sheets=sheets, selected=sheet_name, map_html=map_html, lat=lat, lon=lon)

# 앱 실행
if __name__ == "__main__":
    app.run(debug=True)
