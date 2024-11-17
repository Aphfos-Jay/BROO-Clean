import streamlit as st
import pandas as pd
import plotly.express as px
import folium
from streamlit_folium import st_folium
import numpy as np
import branca.colormap as cm # LinearColormap을 위해 필요

# Load tidal data
file_path = r"C:\Users\jiyon\Documents\hello\Piuda_project\jan_data.csv"
tidal_data = pd.read_csv(file_path)

# Sidebar: 위도와 경도 입력
st.sidebar.header("Initial Pollutant Position")
latitude = st.sidebar.number_input("Latitude", value=35.0, step=0.1)
longitude = st.sidebar.number_input("Longitude", value=127.0, step=0.1)

# 시간대 선택 필드 추가
selected_time = st.sidebar.selectbox("Select Time", tidal_data['date'].unique())

# 사이드바 안내 메시지
st.sidebar.write("마커를 지도에서 이동하더라도, 변경된 좌표는 이 입력 필드에 수동으로 입력하여 반영해야 합니다.")

# 선택된 시간대의 데이터 필터링
filtered_data = tidal_data[tidal_data['date'] == selected_time]

# dx와 dy 계산을 통해 유향과 유속 벡터를 설정
filtered_data['dx'] = filtered_data['current_speed'] * np.cos(np.radians(filtered_data['current_direct']))
filtered_data['dy'] = filtered_data['current_speed'] * np.sin(np.radians(filtered_data['current_direct']))




# Plotly 시각화
fig = px.scatter_mapbox(
    filtered_data, 
    lat="lat", 
    lon="lon", 
    color="current_speed",
    color_continuous_scale="Viridis", 
    size="current_speed",
    mapbox_style="carto-positron", 
    zoom=5,
    title="Current Position and Predicted Path"
)
st.plotly_chart(fig)

# Folium 지도 시각화
m = folium.Map(location=[35, 126], zoom_start=6)

# 색상 범위 및 컬러맵 설정
speed_min, speed_max = filtered_data['current_speed'].quantile(0.1), filtered_data['current_speed'].quantile(0.9)
colormap = cm.LinearColormap(colors=['blue', 'red'], vmin=speed_min, vmax=speed_max)
colormap.caption = 'Current Speed (m/s)'




# Folium 지도 생성
m = folium.Map(location=[latitude, longitude], zoom_start=6)

# 컬러맵 설정
speed_min, speed_max = filtered_data['current_speed'].quantile(0.1), filtered_data['current_speed'].quantile(0.9)
colormap = cm.LinearColormap(colors=['blue', 'red'], vmin=speed_min, vmax=speed_max)
colormap.caption = 'Current Speed (m/s)'

# 마커 추가
marker = folium.Marker(
    location=[latitude, longitude],
    popup="Selected Position",
    draggable=True
)
marker.add_to(m)





# 화살표로 유향 및 유속 표현
for i, row in filtered_data.iterrows():
    # 시작 및 종료 위치
    start = [row['lat'], row['lon']]
    end = [row['lat'] + row['dy'] * 0.01, row['lon'] + row['dx'] * 0.01]

    # 유속에 따라 색상 결정
    color = colormap(row['current_speed'])

    # 화살표 추가
    folium.PolyLine(
        locations=[start, end],
        color=color,
        weight=2,
        opacity=0.6
    ).add_to(m)


    # 시작 지점을 나타내는 작은 원 마커
    folium.CircleMarker(
        location=start,
        radius=1,
        color=color,
        fill=True,
        fill_color=color,
        fill_opacity=0.7
    ).add_to(m)

# 색상 범례 추가
m.add_child(colormap)

# Folium 지도를 Streamlit에 표시
st_folium(m, width=700, height=500)

