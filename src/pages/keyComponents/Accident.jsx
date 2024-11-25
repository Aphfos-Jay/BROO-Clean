import React, { useState } from 'react';
import MainCard from '../../components/MainCard';

export default function Accident() {
  const [selectedYear, setSelectedYear] = useState('2022');

  // 연도별 HTML 파일 경로 매핑
  const fileMap = {
    '2022': '/accident_visualization_2022.html', //public 폴더 기준 경로
    '2023': '/accident_visualization_2023.html', //public 폴더 기준 경로
  };

  return (
    <MainCard>
      <h1>Marine Accident Dashboard</h1>

      {/* 연도 선택 드롭다운 */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="year-select" style={{ marginRight: '10px' }}>
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ padding: '5px', fontSize: '16px' }}
        >
          <option value="2022">2022</option>
          <option value="2023">2023</option>
        </select>
      </div>

      {/* iframe으로 선택된 연도의 지도 HTML 파일 출력 */}
      <iframe
        src={fileMap[selectedYear]}
        style={{ width: '100%', height: '850px', border: 'none' }}
        title={`Marine Accident Visualization ${selectedYear}`}
      ></iframe>
    </MainCard>
  );
}
