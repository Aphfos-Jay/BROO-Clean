import React from 'react';
import { NavermapsProvider, NaverMap, Marker } from 'react-naver-maps';

const ServiceRequestMap = ({ location }) => {
  const naverClientId = import.meta.env.REACT_APP_NAVER_MAPS_CLIENT_ID;

  if (!location?.x || !location?.y) {
    return <p>유효한 좌표가 없습니다.</p>;
  }

  return (
    <NavermapsProvider ncpClientId={naverClientId}>
      <NaverMap
        id="react-naver-map" // DOM의 ID
        style={{
          width: '100%', // 지도의 너비
          height: '400px' // 지도의 높이
        }}
        defaultCenter={{ lat: location.y, lng: location.x }} // 지도의 중심 좌표
        defaultZoom={13} // 지도의 기본 확대 레벨
      >
        {/* 마커 표시 */}
        <Marker position={{ lat: location.y, lng: location.x }} title={`좌표: (${location.x}, ${location.y})`} />
      </NaverMap>
    </NavermapsProvider>
  );
};

export default ServiceRequestMap;
