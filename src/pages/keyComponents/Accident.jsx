import React from 'react';
import MainCard from '../../components/MainCard'; // 정확한 경로로 수정

export default function Accident() {
  return (
    <MainCard>
      <h1>Marine Accident Dashboard</h1>

      {/* iframe으로 지도 HTML 파일 출력 */}
      <iframe
        src="/accident_visualization.html" // public 폴더 기준 경로
        style={{ width: '100%', height: '700px', border: 'none', marginTop: '20px' }}
        title="Marine Accident Visualization"
      ></iframe>
    </MainCard>
  );
}