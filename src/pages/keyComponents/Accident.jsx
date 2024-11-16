import MainCard from 'components/MainCard';

import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const marineAccidentData = [
  { region: 'Incheon', year: 2023, incidents: 50 },
  { region: 'Busan', year: 2023, incidents: 70 },
  { region: 'Jeju', year: 2023, incidents: 30 },
  { region: 'Incheon', year: 2024, incidents: 40 },
  { region: 'Busan', year: 2024, incidents: 60 },
  { region: 'Jeju', year: 2024, incidents: 20 }
];

export default function Accident() {
  const [selectedRegion, setSelectedRegion] = useState('Incheon');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const data = marineAccidentData.filter((item) => item.region === selectedRegion);
    setFilteredData(data);
  }, [selectedRegion]);

  return (
    <MainCard>
      <h1>Marine Accident Dashboard</h1>

      <select onChange={(e) => setSelectedRegion(e.target.value)} value={selectedRegion}>
        <option value="Incheon">Incheon</option>
        <option value="Busan">Busan</option>
        <option value="Jeju">Jeju</option>
      </select>

      <table border="1" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Year</th>
            <th>Incidents</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.year}</td>
              <td>{item.incidents}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 차트 (Plotly.js) */}
      <Plot
        data={[
          {
            x: filteredData.map((item) => item.year),
            y: filteredData.map((item) => item.incidents),
            type: 'bar',
            marker: { color: '#434343' }
          }
        ]}
        layout={{ title: `Accidents in ${selectedRegion}` }}
      />
    </MainCard>
  );
}
