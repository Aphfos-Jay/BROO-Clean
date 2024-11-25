import requests
import pandas as pd
from datetime import datetime, timedelta

# API URL 및 설정
BASE_URL = "http://www.khoa.go.kr/api/oceangrid/tidalCurrentArea/search.do"
API_KEY = "MojTaKFtv8/KvaELTHMHfQ=="  # 자신의 인증키로 변경

def fetch_data(date, hour, minute):
    """
    API 요청 후 데이터를 가져옵니다.
    """
    params = {
        "ServiceKey": API_KEY,
        "Date": date,   # 요청 날짜 (YYYYMMDD)
        "Hour": hour,   # 요청 시간 (00~23)
        "Minute": minute,   # 요청 분 (00~59)
        "MaxX": "132",  # 최대 경도
        "MinX": "124",  # 최소 경도
        "MaxY": "40",   # 최대 위도
        "MinY": "34",   # 최소 위도
        "ResultType": "json"
    }
    
    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        if "result" in data and "data" in data["result"]:
            # 반환 데이터에 날짜와 시간을 추가
            for entry in data["result"]["data"]:
                entry["date"] = date  # 날짜 추가
                entry["time"] = f"{hour}:{minute}"  # 시간 추가
            return data["result"]["data"]
        else:
            print(f"No valid data for date {date}, time {hour}:{minute}")
            return []
    except Exception as e:
        print(f"Error fetching data for {date}, {hour}:{minute}: {e}")
        return []

def save_to_excel(data, filename):
    """
    데이터를 엑셀 파일로 저장합니다.
    """
    if data:
        df = pd.DataFrame(data)
        df.to_excel(filename, index=False)
        print(f"Data saved to {filename}")
    else:
        print("No data to save.")

def main():
    start_date = "20241120"  # 시작 날짜 (YYYYMMDD)
    end_date = "20241121"    # 종료 날짜 (YYYYMMDD)
    filename = "tidal_current_data.xlsx"  # 저장할 엑셀 파일 이름

    # 날짜 범위를 생성
    start = datetime.strptime(start_date, "%Y%m%d")
    end = datetime.strptime(end_date, "%Y%m%d")
    delta = timedelta(days=1)

    all_data = []  # 모든 데이터를 저장할 리스트

    # 날짜와 시간을 순회하며 데이터 수집
    while start <= end:
        date_str = start.strftime("%Y%m%d")
        for hour in range(24):  # 00시부터 23시까지
            for minute in range(0, 60, 10):  # 10분 간격으로 요청
                time_data = fetch_data(date_str, f"{hour:02}", f"{minute:02}")
                all_data.extend(time_data)
        start += delta

    # 데이터를 엑셀로 저장
    save_to_excel(all_data, filename)

if __name__ == "__main__":
    main()
