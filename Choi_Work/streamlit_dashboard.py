import streamlit as st
import pandas as pd
import folium
from folium.plugins import MarkerCluster, HeatMap
from streamlit_folium import st_folium
import numpy as np
import requests

# API URL 설정
API_URL = "http://localhost:5000/api/trash"

# Streamlit 설정
st.sidebar.header("필터 옵션")

# API 호출 및 데이터 로드
try:
    response = requests.get(API_URL)
    response.raise_for_status()  # 요청 실패 시 예외 발생
    trash_data = pd.DataFrame(response.json())  # JSON 데이터를 DataFrame으로 변환
except requests.RequestException as e:
    st.error(f"API에서 데이터를 가져오는 중 오류가 발생했습니다: {e}")
    st.stop()

# 데이터 컬럼 확인 및 처리
required_columns = ["location", "trashCnt", "weight", "latitude", "longtitude"]
if not all(column in trash_data.columns for column in required_columns):
    st.error("API에서 반환된 데이터에 필요한 컬럼이 누락되었습니다.")
    st.stop()

# 이상치를 완화한 상하한 설정
min_count = 45  # 개수 하한
max_count = 3827  # 개수 상한
min_weight = 0.5  # 무게 하한
max_weight = 137.08  # 무게 상한

# 데이터 정규화 및 로그 스케일 적용
max_value = 150  # 최대 가중치 값 설정
trash_data['normalized_weight_count'] = trash_data.apply(
    lambda row: min(row['weight'] + row['trashCnt'], max_value), axis=1
)
trash_data['log_weight_count'] = trash_data['normalized_weight_count'].apply(lambda x: np.log1p(x))

# 필터 기준 선택 (이상치 완화 범위 적용)
selected_min_count = st.sidebar.slider("최소 개수", min_value=min_count, max_value=max_count, value=500)
selected_min_weight = st.sidebar.slider("최소 무게", min_value=min_weight, max_value=max_weight, value=10.0)

# 필터링된 데이터
filtered_data = trash_data[
    (trash_data['trashCnt'] >= selected_min_count) & 
    (trash_data['weight'] >= selected_min_weight)
]

# 히트맵 데이터 준비
heat_data = [
    [row['latitude'], row['longtitude'], row['log_weight_count']]
    for _, row in filtered_data.iterrows()
]

# 지도 초기화
m = folium.Map(location=[36.0, 128.0], zoom_start=8)
marker_cluster = MarkerCluster().add_to(m)

# MarkerCluster 및 Marker 추가
for _, row in filtered_data.iterrows():
    location = [row['latitude'], row['longtitude']]
    popup_info = f"""
    <b>지역:</b> {row['location']}<br>
    <b>개수:</b> {row['trashCnt']}개<br>
    <b>무게:</b> {row['weight']}kg<br>
    <b>위도:</b> {row['latitude']}<br>
    <b>경도:</b> {row['longtitude']}
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
st.sidebar.dataframe(filtered_data[['location', 'trashCnt', 'weight', 'latitude', 'longtitude']])
