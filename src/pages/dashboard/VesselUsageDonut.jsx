import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const VesselUsageDonut = () => {
  const [chartData, setChartData] = useState({
    series: [], // 초기값 설정
    options: {
      chart: { type: 'donut' },
      labels: [], // 초기값 설정
    },
  });
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response2022 = await fetch('/accident_2022.json');
        const response2023 = await fetch('/accident_2023.json');

        if (!response2022.ok || !response2023.ok) {
          throw new Error('Failed to fetch JSON files');
        }

        const accident2022 = await response2022.json();
        const accident2023 = await response2023.json();

        const combinedData = [...accident2022, ...accident2023];

        console.log('Combined Data:', combinedData); // 확인용 로그

        // 선박용도별 사고 건수 집계
        const usageCounts = combinedData.reduce((acc, cur) => {
          if (!cur || !cur['선박용도(통계)']) return acc; // 누락된 데이터 필터링
          acc[cur['선박용도(통계)']] = (acc[cur['선박용도(통계)']] || 0) + 1;
          return acc;
        }, {});

        console.log('Usage Counts:', usageCounts); // 확인용 로그

        setChartData({
          series: Object.values(usageCounts),
          options: {
            chart: { type: 'donut' },
            labels: Object.keys(usageCounts),
          },
        });
        setLoading(false); // 로딩 완료
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // 로딩 실패
      }
    };

    fetchData();
  }, []);

  // 로딩 상태 처리
  if (loading) {
    return <div>Loading...</div>;
  }

  // 데이터가 없을 경우 처리
  if (!chartData.series || chartData.series.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h2>Vessel Usage Statistics</h2>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        width="600"
      />
    </div>
  );
};

export default VesselUsageDonut;
