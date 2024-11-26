from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import httpx  # HTTP 요청을 위한 라이브러리
from contextlib import asynccontextmanager
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

# Node.js API URL
NODE_API_URL = "http://localhost:5000/api/trash"

@app.get("/api/trash")
async def get_data(min_count: int = 0, min_weight: float = 0.0):
    """
    Node.js API로부터 데이터를 가져와 필터링 후 반환
    """
    try:
        # Node.js 서버에 요청
        async with httpx.AsyncClient() as client:
            response = await client.get(
                NODE_API_URL, 
                params={"min_count": min_count, "min_weight": min_weight}
            )
        
        # 응답 확인 및 처리
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch data from Node.js API")
        
        # Node.js API 응답 반환
        return JSONResponse(content=response.json())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")
