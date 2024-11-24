import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CCTVVideo from './CCTVVideo.js'; // HLS.js를 활용한 CCTV 영상 컴포넌트

const API_URL = 'https://openapi.its.go.kr:9443/cctvInfo';
const API_KEY = 'c5db1584f5d6486d84ea34c476fdcf26';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationMarker({ setCoordinates, fetchCCTVData }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates({ 
        lat: parseFloat(lat.toFixed(5)), 
        lng: parseFloat(lng.toFixed(5)) 
      });
      fetchCCTVData(lat, lng);
    },
  });
  return null;
}

const MapView = () => {
  const location = useLocation();
  const initialLocation = location.state?.location || { lat: 37.5665, lng: 126.9780 };
  const [coordinates, setCoordinates] = useState(initialLocation);
  //const [coordinates, setCoordinates] = useState({ lat: 37.5665, lng: 126.9780 }); // 초기값: 서울
  const [cctvData, setCctvData] = useState([]);
  const [selectedCCTV, setSelectedCCTV] = useState(null);
  const [detections, setDetections] = useState([]); // 탐지된 객체들
  const socketRef = useRef(null);
  
  const fetchCCTVData = async (lat, lng) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          apiKey: API_KEY,
          type: 'its',
          cctvType: 1,
          minX: parseFloat((lng - 0.05).toFixed(5)),
          maxX: parseFloat((lng + 0.05).toFixed(5)),
          minY: parseFloat((lat - 0.05).toFixed(5)),
          maxY: parseFloat((lat + 0.05).toFixed(5)),
          getType: 'json',
        },
      });
      setCctvData(response.data.response?.data || []);
    } catch (err) {
      console.error('CCTV 데이터를 가져오는데 실패했습니다.');
    }
  };

  const startDetection = (url) => {
    if (socketRef.current) socketRef.current.close(); // 기존 연결 닫기

    socketRef.current = new WebSocket('ws://localhost:8000/ws');
    socketRef.current.onopen = () => {
      console.log('WebSocket 연결 성공!');
      socketRef.current.send(JSON.stringify({ url })); // 선택된 CCTV URL 전송
    };
    socketRef.current.onmessage = (event) => {
      try {
          const data = JSON.parse(event.data); // 서버에서 온 메시지를 JSON 파싱
          console.log("Received message:", data); // 전체 데이터를 출력해 확인
  
          if (data.detections) {
              setDetections(data.detections); // 탐지된 객체들을 상태에 저장
          }
      } catch (error) {
          console.error("Error parsing JSON:", error, "Raw data:", event.data);
      }
  };
  
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close(); // 컴포넌트 언마운트 시 WebSocket 닫기
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{location.state?.area} 지도</h1>

      {/* 지도 영역 */}
      <div style={styles.mapContainer}>
        
       
        <MapContainer
          center={[initialLocation.lat, initialLocation.lng]}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker setCoordinates={setCoordinates} fetchCCTVData={fetchCCTVData} />
          {/* CCTV 마커 표시 */}
          {cctvData.map((cctv, index) => (
            <Marker
              key={index}
              position={[cctv.coordy, cctv.coordx]}
              eventHandlers={{
                click: () => {
                  setSelectedCCTV(cctv);
                  startDetection(cctv.cctvurl);
                },
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* 선택된 CCTV 정보 */}
      {selectedCCTV && (
        <div className="cctv-video" style={{ position: 'relative', display: 'inline-block' }}>
          <h2>선택된 CCTV</h2>
          <p>
            <strong>설명:</strong> {selectedCCTV.cctvname}
          </p>
          <p>
            <strong>주소:</strong> {selectedCCTV.cctvaddress}
          </p>
          <CCTVVideo url={selectedCCTV.cctvurl} />

          {/* 객체 탐지 결과 오버레이 */}
          {detections.map((det, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                border: '2px solid red',
                left: det.x1,
                top: det.y1,
                width: det.x2 - det.x1,
                height: det.y2 - det.y1,
                color: 'red',
                pointerEvents: 'none',
              }}
            >
              {det.class}
            </div>
          ))}
        </div>
      )}

      {/* 선택된 좌표 정보 */}
      <div style={styles.coordinatesBox}>
        <p>
          <strong>위도:</strong> {coordinates.lat}
        </p>
        <p>
          <strong>경도:</strong> {coordinates.lng}
        </p>
      </div>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Arial', sans-serif",
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  mapContainer: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    width: '50%', // 지도 너비를 50%로 설정
    height: '500px', // 지도 높이 설정
    marginBottom: '20px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  coordinatesBox: {
    marginTop: '20px',
    padding: '10px 20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
};

export default MapView;