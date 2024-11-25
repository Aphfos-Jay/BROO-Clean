from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import pandas as pd
import subprocess




# FastAPI 인스턴스 생성
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Streamlit 실행 (main.py와 같은 디렉토리 내에 streamlit_dashboard.py 존재)
    process = subprocess.Popen(["streamlit", "run", "streamlit_dashboard.py", "--server.port=8501"])        
    try:
        yield
    finally:
        process.terminate()  # FastAPI 종료 시 Streamlit 종료

app = FastAPI(lifespan=lifespan)

# 데이터 경로 설정
data_path = "data/trash_data.csv"   ##경로 지정

# 데이터 로드 (UTF-8 BOM 처리 포함)
try:
    data = pd.read_csv(data_path, encoding="utf-8-sig")
except UnicodeDecodeError as e:
    raise RuntimeError(f"Failed to read the CSV file due to encoding issue: {e}")

@app.get("/")
async def root():
    return {"message": "FastAPI is running"}

@app.get("/api/data")
async def get_data(min_count: int = 0, min_weight: float = 0.0):
    """
    필터링된 데이터를 JSON 형식으로 반환
    """
    filtered_data = data[
        (data["개수"] >= min_count) & 
        (data["무게(kg)"] >= min_weight)
    ]
    return JSONResponse(content=filtered_data.to_dict(orient="records"))

