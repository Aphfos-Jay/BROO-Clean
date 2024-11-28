import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function ShipUsageDoughnutChart() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState('2023'); // 기본 연도
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchAccidentData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/accidentsShip?year=${year}`);
        const accidents = await response.json();

        // shipUseStatistics별 개수 계산
        const usageCounts = accidents.reduce((acc, curr) => {
          const usage = curr.shipUseStatistics || 'Unknown';
          acc[usage] = (acc[usage] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(usageCounts);
        const values = Object.values(usageCounts);
        const total = values.reduce((sum, val) => sum + val, 0);
        const percentages = values.map((val) => ((val / total) * 100).toFixed(2)); // 퍼센트 계산

        // Chart.js 데이터 설정
        setChartData({
          labels,
          datasets: [
            {
              data: percentages,
              backgroundColor: generateColors(labels.length),
              hoverBackgroundColor: generateColors(labels.length, 0.8) // hover 효과 색상
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching accident data:', error);
      }
    };

    fetchAccidentData();
  }, [year]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  // 랜덤 색상 생성기
  const generateColors = (count, opacity = 1) => {
    const baseColors = ['#3296ED', '#77B9F2', '#9D53F2', '#C398F5', '#26ABA4', '#4ED4CD', '#E69F00', '#E2CE7D'];
    const colors = [];
    for (let i = 0; i < count; i++) {
      const baseColor = baseColors[i % baseColors.length];
      const [r, g, b] = baseColor.match(/\w\w/g).map((hex) => parseInt(hex, 16));
      colors.push(`rgba(${r}, ${g}, ${b}, ${opacity})`);
    }
    return colors;
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      },
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: `Ship Usage Statistics (${year})`
      },
      datalabels: {
        color: '#000',
        formatter: (value) => `${value}%`,
        font: {
          weight: 'bold',
          size: 12
        }
      }
    }
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>Year</InputLabel>
        <Select value={year} onChange={handleYearChange}>
          <MenuItem value="2022">2022</MenuItem>
          <MenuItem value="2023">2023</MenuItem>
        </Select>
      </FormControl>
      {chartData.labels ? <Doughnut data={chartData} options={options} /> : <p>Loading chart...</p>}
    </div>
  );
}
