Dashboard.jsx 파일 위치 - src\pages\dashboard\Dashboard.jsx
나머지 파일들
 - python 환경 구현에 필요한 파일이므로 어디에 있어도 상관없습니다! 
 - (단, 3.1 과정에서 폴더 지정해줘야합니다)



구현 순서입니다


1. 가상환경 설정
   - Anaconda Prompt 또는 Terminal에서:

     conda create -n 가상환경명 python=3.11
     conda activate 가상환경명
     

2. 필요한 패키지 설치
>> pip install fastapi uvicorn pandas numpy streamlit streamlit-folium folium python-dotenv


3.1 - 가상환경에서 폴더 경로 지정(가상환경 터미널에서 실행) (이 txt 파일이 위치하는 폴더로 설정)
예)>> cd "C:\Users\jiyon\Desktop\지용 개발 자료\3. 대시보드 탭 - python 연동 지도"


3.2 -  FastAPI 서버 실행 ( 가상환경 터미널에서 실행)
>>  uvicorn main:app --reload --port 8050


4. Broo-clean 실행


5. 브라우저에서 확인
- FastAPI: 8000
- Streamlit: 8501
- React 프론트엔드: http://localhost:3000

