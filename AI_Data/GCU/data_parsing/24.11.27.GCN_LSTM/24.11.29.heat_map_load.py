from flask import Flask, render_template_string, request
import pandas as pd
import folium
from folium.plugins import HeatMap

# Flask 앱 초기화
app = Flask(__name__)

# 데이터 로드
file_path = 'up_trash_positions.xlsx'
try:
    sheets = pd.ExcelFile(file_path).sheet_names
    data = {sheet: pd.read_excel(file_path, sheet_name=sheet) for sheet in sheets}
except FileNotFoundError:
    print(f"파일 {file_path}이(가) 존재하지 않습니다.")
    exit(1)

# 지도 중심 설정
center = [35.5, 127.5]

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
    <h1>Interactive Trash Map Viewer</h1>
    <form method="get">
        <label for="sheet">Select a Map:</label>
        <select name="sheet" id="sheet">
            {% for sheet in sheets %}
            <option value="{{ sheet }}" {% if sheet == selected %}selected{% endif %}>{{ sheet }}</option>
            {% endfor %}
        </select>
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

# 지도 생성 함수
def create_map(sheet_name):
    # 시트 데이터 가져오기
    filtered_data = data[sheet_name].copy()
    # Folium 지도 생성
    m = folium.Map(location=center, zoom_start=7)
    HeatMap(data=filtered_data[['latitude', 'longitude']], radius=20).add_to(m)
    return m._repr_html_()  # Folium 지도를 HTML로 반환

# 라우트 설정
@app.route("/", methods=["GET"])
def index():
    # 선택된 시트 이름 가져오기 (기본값: "Current")
    sheet_name = request.args.get("sheet", "Current")
    # 시트가 유효한지 확인
    if sheet_name not in data:
        sheet_name = "Current"
    # 지도 생성
    map_html = create_map(sheet_name)
    # HTML 템플릿 렌더링
    return render_template_string(HTML_TEMPLATE, sheets=sheets, selected=sheet_name, map_html=map_html)

# Flask 앱 실행
if __name__ == "__main__":
    app.run(debug=True)
    