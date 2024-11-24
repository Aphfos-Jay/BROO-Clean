import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageMapper from 'react-img-mapper';
import mapImage from '../assets/1.jpg'; // 지도 이미지

const KoreaMap = () => {
  const navigate = useNavigate();

  // 상태 관리 추가
  const [zoom, setZoom] = useState(1); // 확대 비율
  const [transformOrigin, setTransformOrigin] = useState('center center'); // 확대 기준점

  const MAP = {
    name: 'korea-map',
    areas: [
      { name: '서해', shape: 'poly', coords: [0, 0, 265, 0, 0, 650, 0, 100] },
      { name: '남해', shape: 'poly', coords: [100, 500, 250, 5, 480, 500] },
      { name: '동해', shape: 'poly', coords: [250, 0, 500, 0, 500, 500] },
    ],
  };

  // 클릭 시 지도 화면으로 이동
  const handleAreaClick = (area) => {
    const locations = {
      서해: { lat: 36.5, lng: 126.3 },
      남해: { lat: 34.8, lng: 128.0 },
      동해: { lat: 37.524, lng: 129.114 },
    };
    const selectedLocation = locations[area.name];
    navigate('/map', { state: { location: selectedLocation, area: area.name } });
  };

  // 마우스 오버 시 확대
  const handleMouseEnter = (area) => {
    const coords = area.coords;
    let centerX, centerY, zoomLevel;

    // 각 영역별 확대 설정
    switch (area.name) {
      case '서해':
        centerX = 100;
        centerY = 200;
        zoomLevel = 2.2;
        break;
      case '남해':
        centerX = 250;
        centerY = 450;
        zoomLevel = 2.5;
        break;
      case '동해':
        centerX = 400;
        centerY = 100;
        zoomLevel = 2.2;
        break;
      default:
        centerX = 250;
        centerY = 250;
        zoomLevel = 1;
    }

    setZoom(zoomLevel);

    // 확대 기준점을 설정
    const originX = (centerX / 500) * 100;
    const originY = (centerY / 500) * 100;
    setTransformOrigin(`${originX}% ${originY}%`);
  };

  // 마우스 벗어날 시 확대 초기화
  const handleMouseLeave = () => {
    setZoom(1);
    setTransformOrigin('center center');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>한국 지도: 바다 선택</h1>

      {/* 지도 이미지 */}
      <div style={styles.mapContainer}>
        <div
          style={{
            ...styles.imageWrapper,
            transform: `scale(${zoom})`,
            transformOrigin: transformOrigin,
          }}
        >
          <ImageMapper
            src={mapImage}
            map={MAP}
            width={500}
            onMouseEnter={handleMouseEnter} // 마우스 진입 시 이벤트
            onMouseLeave={handleMouseLeave} // 마우스 벗어날 시 이벤트
            onClick={handleAreaClick} // 클릭 이벤트
          />
        </div>
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
    position: 'relative',
    width: '500px',
    height: 'auto',
    overflow: 'hidden',
    border: '2px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  imageWrapper: {
    transition: 'transform 0.3s ease-in-out', // 부드러운 줌 효과
  },
};

export default KoreaMap;