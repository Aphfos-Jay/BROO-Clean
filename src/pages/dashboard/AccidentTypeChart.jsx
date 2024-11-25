import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AccidentTypeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response2022 = await fetch('/accident_2022.json');
        const response2023 = await fetch('/accident_2023.json');

        if (!response2022.ok || !response2023.ok) {
          throw new Error('Failed to fetch data');
        }

        const accident2022 = await response2022.json();
        const accident2023 = await response2023.json();

        const combinedData = [...accident2022, ...accident2023];

        const typeCounts = combinedData.reduce((acc, cur) => {
          if (!cur || !cur['사고종류']) return acc; // undefined 또는 누락된 데이터 필터링
          acc[cur['사고종류']] = (acc[cur['사고종류']] || 0) + 1;
          return acc;
        }, {});

        const formattedData = Object.entries(typeCounts)
          .filter(([type]) => type) // type이 유효한 경우만 포함
          .map(([type, count]) => ({
            type,
            count,
          }))
          .sort((a, b) => b.count - a.count); // count를 기준으로 내림차순 정렬

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data || data.length === 0) {
    return <div>No data available</div>; // 데이터가 없을 경우 처리
  }

  return (
    <div>
      <h2>Accident Types Distribution</h2>
      <BarChart
        width={600}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 40,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" angle={-45} textAnchor="end" interval={0} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default AccidentTypeChart;
