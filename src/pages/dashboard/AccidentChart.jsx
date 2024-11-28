import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import MainCard from 'components/MainCard';
// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

export default function InteractiveStackedBarChart() {
  const [accidents, setAccidents] = useState([]);
  const [year, setYear] = useState('2023'); // 기본값: 2023
  const [hiddenDatasets, setHiddenDatasets] = useState({});
  const [chartData, setChartData] = useState({});

  // 데이터 가져오기
  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/accidents?year=${year}`);
        const data = await response.json();
        setAccidents(data);
      } catch (error) {
        console.error('Error fetching accident data:', error);
      }
    };

    fetchAccidents();
  }, [year]);

  // Chart 데이터 준비
  useEffect(() => {
    if (accidents.length > 0) {
      const accidentTypes = [...new Set(accidents.map((item) => item.accidentType))];
      const seaAreas = [...new Set(accidents.map((item) => item.seaArea))];

      const datasets = seaAreas.map((seaArea, index) => ({
        label: seaArea,
        data: accidentTypes.map((type) => accidents.find((item) => item.accidentType === type && item.seaArea === seaArea)?.count || 0),
        backgroundColor: getCustomColor(index),
        hidden: hiddenDatasets[seaArea] || false // 초기 숨김 상태
      }));

      setChartData({
        labels: accidentTypes,
        datasets: datasets
      });
    }
  }, [accidents, hiddenDatasets]);

  // 연도 변경 핸들러
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  // 범례 클릭 핸들러
  const handleLegendClick = (event, legendItem, chart) => {
    const datasetIndex = legendItem.datasetIndex;
    const datasetLabel = chart.data.datasets[datasetIndex].label;
    setHiddenDatasets((prev) => ({
      ...prev,
      [datasetLabel]: !prev[datasetLabel]
    }));
  };

  // Chart.js 옵션
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        onClick: handleLegendClick, // 범례 클릭 핸들러
        labels: {
          usePointStyle: true,
          generateLabels: (chart) => {
            return chart.data.datasets.map((dataset, index) => ({
              text: dataset.label,
              datasetIndex: index,
              fillStyle: dataset.backgroundColor,
              hidden: dataset.hidden,
              font: { textDecoration: dataset.hidden ? 'line-through' : 'none' } // 취소선 추가
            }));
          }
        }
      },
      title: {
        display: true,
        text: `Accidents by Type and Sea Area (${year})`
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce((sum, item) => sum + item.raw, 0);
            return `Total: ${total}`;
          }
        }
      }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };

  // 랜덤 색상 생성
  const getCustomColor = (index) => {
    const colors = ['#3296ED', '#77B9F2', '#9D53F2', '#C398F5', '#26ABA4', '#4ED4CD', '#E2CE7D', '#E69F00'];
    return colors[index % colors.length];
  };

  // 스택 합계 추가 (annotation plugin 활용)
  useEffect(() => {
    if (chartData.labels) {
      const totals = chartData.labels.map((_, idx) =>
        chartData.datasets.reduce((sum, dataset) => {
          if (!hiddenDatasets[dataset.label]) {
            return sum + dataset.data[idx];
          }
          return sum;
        }, 0)
      );

      options.plugins.annotation = {
        annotations: totals.map((total, idx) => ({
          type: 'label',
          xValue: idx,
          yValue: total,
          content: `${total}`,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: '#fff',
          font: { weight: 'bold' }
        }))
      };
    }
  }, [chartData, hiddenDatasets]);

  return (
    <MainCard>
      <FormControl fullWidth>
        <InputLabel>Accident Year</InputLabel>
        <Select value={year} onChange={handleYearChange}>
          <MenuItem value="2022">2022</MenuItem>
          <MenuItem value="2023">2023</MenuItem>
        </Select>
      </FormControl>
      {chartData.labels ? <Bar data={chartData} options={options} /> : <p>Loading chart...</p>}
    </MainCard>
  );
}
