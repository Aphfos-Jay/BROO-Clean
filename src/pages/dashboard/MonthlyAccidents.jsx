import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const MonthlyAccidents = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%'
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [], // 월별 데이터
        title: {
          text: 'Month'
        }
      },
      yaxis: {
        title: {
          text: 'Accident Count'
        }
      },
      legend: {
        position: 'top'
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/accidents/monthly-count');
        const data = await response.json();

        const months = Array.from(new Set(data.map((d) => d.month))).map((month) =>
          new Date(0, month - 1).toLocaleString('default', { month: 'short' })
        );
        const year2022 = data.filter((d) => d.accidentYear === 2022).map((d) => d.count);
        const year2023 = data.filter((d) => d.accidentYear === 2023).map((d) => d.count);

        setChartData((prevState) => ({
          ...prevState,
          series: [
            { name: '2022', data: year2022 },
            { name: '2023', data: year2023 }
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
  }, []);

  return <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />;
};

export default MonthlyAccidents;
