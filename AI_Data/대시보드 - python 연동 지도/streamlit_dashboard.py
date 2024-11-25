import streamlit as st
import pandas as pd
import folium
from folium.plugins import MarkerCluster, HeatMap
from streamlit_folium import st_folium
import numpy as np

# 데이터 로드
coastal_trash_data_path = "data/trash_data.csv"   ## 데이터 경로 지정
coastal_trash_data = pd.read_csv(coastal_trash_data_path, encoding="utf-8")

# 이상치를 완화한 상하한 설정
min_count = 45  # 개수 하한
max_count = 3827  # 개수 상한
min_weight = 0.5  # 무게 하한
max_weight = 137.08  # 무게 상한

# 데이터 정규화 및 로그 스케일 적용
max_value = 150  # 최대 가중치 값 설정
coastal_trash_data['normalized_weight_count'] = coastal_trash_data.apply(
    lambda row: min(row['무게(kg)'] + row['개수'], max_value), axis=1
)
coastal_trash_data['log_weight_count'] = coastal_trash_data['normalized_weight_count'].apply(lambda x: np.log1p(x))

# Streamlit 설정
st.title("해안 쓰레기 데이터 시각화")
st.sidebar.header("필터 옵션")

# 필터 기준 선택 (이상치 완화 범위 적용)
selected_min_count = st.sidebar.slider("최소 개수", min_value=min_count, max_value=max_count, value=500)
selected_min_weight = st.sidebar.slider("최소 무게(kg)", min_value=min_weight, max_value=max_weight, value=10.0)

# 필터링된 데이터
filtered_data = coastal_trash_data[
    (coastal_trash_data['개수'] >= selected_min_count) & 
    (coastal_trash_data['무게(kg)'] >= selected_min_weight)
]

# 히트맵 데이터 준비
heat_data = [
    [row['위도'], row['경도'], row['log_weight_count']]
    for _, row in filtered_data.iterrows()
]

# 지도 초기화
m = folium.Map(location=[36.0, 128.0], zoom_start=6)
marker_cluster = MarkerCluster().add_to(m)

# MarkerCluster 및 Marker 추가
for _, row in filtered_data.iterrows():
    location = [row['위도'], row['경도']]
    popup_info = f"""
    <b>지역:</b> {row['지역']}<br>
    <b>개수:</b> {row['개수']}개<br>
    <b>무게:</b> {row['무게(kg)']}kg<br>
    <b>위도:</b> {row['위도']}<br>
    <b>경도:</b> {row['경도']}
    """
    folium.Marker(
        location=location,
        popup=folium.Popup(popup_info, max_width=300),
        icon=folium.Icon(color='blue', icon='info-sign')
    ).add_to(marker_cluster)

# 히트맵 추가 (필터링된 데이터 기준)
HeatMap(
    heat_data,
    radius=30,      # 반경을 크게 설정
    blur=20,        # 블러링도 함께 조정
    max_zoom=10,    # 줌 레벨 고정
    min_opacity=0.4, # 최소 불투명도 증가
    gradient={0.4: 'blue', 0.65: 'lime', 1: 'red'}  # 색상 그라데이션 조정
).add_to(m)

# Streamlit을 통해 Folium 지도 표시
st_data = st_folium(m, width=725)

# 필터링된 데이터 정보
st.sidebar.subheader("필터링된 데이터 정보")
st.sidebar.write(f"총 {len(filtered_data)}개의 지점이 표시됩니다.")

# 필터링된 데이터 테이블 표시
st.sidebar.subheader("지점 상세 정보")
st.sidebar.dataframe(filtered_data[['지역', '개수', '무게(kg)', '위도', '경도']])
