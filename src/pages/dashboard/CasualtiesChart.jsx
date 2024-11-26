import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

export default function CasualtiesChart() {
  const theme = useTheme();

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        height: 340,
        type: 'line',
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      grid: { strokeDashArray: 4 },
      xaxis: {
        categories: [], // 월 이름
        title: { text: 'Month' },
        labels: { format: 'MMM' }
      },
      yaxis: {
        title: { text: 'Count' }
      },
      tooltip: { x: { format: 'MMM' } },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      colors: [theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main, theme.palette.info.main]
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/accidents/casualties');
        const data = await response.json();

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // 데이터 매핑
        const deathCounts = months.map((_, i) => data.find((d) => d.month === i + 1)?.deathCount || 0);
        const missingCounts = months.map((_, i) => data.find((d) => d.month === i + 1)?.missingCount || 0);
        const deathMissingCounts = months.map((_, i) => data.find((d) => d.month === i + 1)?.deathMissingCount || 0);
        const injuredCounts = months.map((_, i) => data.find((d) => d.month === i + 1)?.injuredCount || 0);

        setChartData((prevState) => ({
          ...prevState,
          series: [
            { name: 'Death Count', data: deathCounts },
            { name: 'Missing Count', data: missingCounts },
            { name: 'Death+Missing Count', data: deathMissingCounts },
            { name: 'Injured Count', data: injuredCounts }
          ],
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: months
            }
          }
        }));
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchData();
  }, [theme.palette]);

  return <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={340} />;
}
