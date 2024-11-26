import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const ServiceRequestMap = ({ location }) => {
  const mapRef = useRef(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!location?.x || !location?.y) {
      console.error('유효한 좌표가 없습니다.');
      return;
    }

    // 지도 초기화
    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(location.x, location.y),
      zoom: 20
    });

    // 마커 추가
    new naver.maps.Marker({
      position: new naver.maps.LatLng(location.x, location.y),
      map,
      title: '신고 위치'
    });

    // Reverse Geocoding API 호출
    const fetchAddress = async () => {
      const x = location.x;
      const y = location.y;

      try {
        const response = await axios.get(`http://localhost:5000/api/reverse-geocode?x=${x}&y=${y}`);
        const data = response.data;
        const region = data.results[0].region;

        if (region) {
          const addr = region.area1.name + ' ' + region.area2.name + ' ' + region.area3.name;
          setAddress(addr);
        } else {
          console.error('Reverse Geocoding 결과 없음');
        }
      } catch (error) {
        console.error('Reverse Geocoding 요청 실패:', error);
      }
    };

    fetchAddress();
  }, [location]);

  return (
    <div>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '400px',
          marginBottom: '16px'
        }}
      ></div>
      <div>
        <strong>주소:</strong> {address || '주소를 가져오는 중...'}
      </div>
    </div>
  );
};

export default ServiceRequestMap;
