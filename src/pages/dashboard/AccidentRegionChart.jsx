import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AccidentRegionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(false); // 에러 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response2022, response2023] = await Promise.all([
          fetch('/accident_2022.json'),
          fetch('/accident_2023.json'),
        ]);

        if (!response2022.ok || !response2023.ok) {
          throw new Error(`Failed to fetch files: ${!response2022.ok ? '2022' : '2023'}`);
        }

        const [accident2022, accident2023] = await Promise.all([
          response2022.json(),
          response2023.json(),
        ]);

        const regionCounts = [...accident2022, ...accident2023].reduce((acc, { 해역 }) => {
          acc[해역] = (acc[해역] || 0) + 1;
          return acc;
        }, {});

        const formattedData = Object.entries(regionCounts)
          .map(([region, count]) => ({ region, count }))
          .sort((a, b) => b.count - a.count); // 큰 순서대로 정렬

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 로딩 상태 표시
  }

  if (error) {
    return <div>Failed to load data. Please try again later.</div>; // 에러 메시지
  }

  if (data.length === 0) {
    return <div>No data available</div>; // 데이터 없음 표시
  }

  return (
    <div>
      <h2>Region-wise Accident Counts</h2>
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
        <XAxis 
          dataKey="region" 
          angle={-45} 
          textAnchor="end" 
          interval={0} 
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#40a9ff" /> {/* 색상 지정 */}
      </BarChart>
    </div>
  );
};

export default AccidentRegionChart;
