import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import CCTVVideo from './CCTVVideo.jsx';
import MainCard from 'components/MainCard.jsx';

import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const API_URL = 'https://openapi.its.go.kr:9443/cctvInfo';
const API_KEY = 'c5db1584f5d6486d84ea34c476fdcf26';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

function LocationMarker({ setCoordinates, fetchCCTVData }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat: lat.toFixed(5), lng: lng.toFixed(5) });
      fetchCCTVData(lat, lng);
    }
  });
  return null;
}

const adjustSize = (detections, videoWidth, videoHeight, originalWidth, originalHeight) => {
  const widthRatio = videoWidth / originalWidth;
  const heightRatio = videoHeight / originalHeight;

  return detections.map((det) => {
    const adjustedX1 = Math.max(0, Math.min(det.x1 * widthRatio, videoWidth));
    const adjustedY1 = Math.max(0, Math.min(det.y1 * heightRatio, videoHeight));
    const adjustedX2 = Math.max(0, Math.min(det.x2 * widthRatio, videoWidth));
    const adjustedY2 = Math.max(0, Math.min(det.y2 * heightRatio, videoHeight));

    return {
      ...det,
      x1: adjustedX1,
      y1: adjustedY1,
      x2: adjustedX2,
      y2: adjustedY2
    };
  });
};

export default function Tracking() {
  const location = useLocation();
  const initialLocation = location.state?.location || { lat: 38.132069, lng: 128.569722 };
  const [coordinates, setCoordinates] = useState(initialLocation);
  const [cctvData, setCctvData] = useState([]);
  const [selectedCCTV, setSelectedCCTV] = useState(null);
  const [detections, setDetections] = useState([]);
  const socketRef = useRef(null);

  const fetchCCTVData = async (lat, lng) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          apiKey: API_KEY,
          type: 'its',
          cctvType: 1,
          minX: (lng - 0.05).toFixed(5),
          maxX: (lng + 0.05).toFixed(5),
          minY: (lat - 0.05).toFixed(5),
          maxY: (lat + 0.05).toFixed(5),
          getType: 'json'
        }
      });
      setCctvData(response.data.response?.data || []);
    } catch (error) {
      console.error('CCTV 데이터를 가져오는데 실패했습니다.', error);
    }
  };

  const startDetection = (url) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    socketRef.current = new WebSocket('ws://localhost:8053/ws');
    socketRef.current.onopen = () => {
      socketRef.current.send(JSON.stringify({ url }));
    };
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.detections) {
        const videoElement = videoRef.current;
        if (videoElement) {
          const videoWidth = videoElement.offsetWidth;
          const videoHeight = videoElement.offsetHeight;
          const adjustedDetections = adjustSize(
            data.detections,
            videoWidth,
            videoHeight,
            640, // 원본 프레임 가로 크기
            480 // 원본 프레임 세로 크기
          );
          setDetections(adjustedDetections);
        }
      }
    };
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <MainCard>
      <div style={styles.container}>
        <h1 style={styles.heading}>{location.state?.area} 지도</h1>

        {/* 지도 영역 */}
        <div style={styles.mapContainer}>
          <MapContainer center={[initialLocation.lat, initialLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
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
                  }
                }}
              />
            ))}
          </MapContainer>
        </div>

        {/* 선택된 CCTV 정보 */}
        {selectedCCTV && (
          <div style={styles.cctvContainer}>
            <h2>선택된 CCTV</h2>
            <p>
              <strong>설명:</strong> {selectedCCTV.cctvname}
            </p>
            <p>
              <strong>위치:</strong> {selectedCCTV.coordy}, {selectedCCTV.coordx}
            </p>
            <p>
              <strong>Trash Count:</strong> {detections.filter((det) => det.class === 'trash').length}
            </p>
            <CCTVVideo url={selectedCCTV.cctvurl} />

            {/* 객체 탐지 결과 표시 */}
            <div style={styles.detectionOverlay}>
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
                    pointerEvents: 'none'
                  }}
                >
                  {`${det.class} (${Math.round(det.confidence * 100)}%)`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainCard>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#4A4A4A'
  },
  mapContainer: {
    width: '100%',
    height: '500px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  cctvContainer: {
    position: 'relative',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  detectionOverlay: {
    position: 'relative',
    marginTop: '20px'
  }
};
