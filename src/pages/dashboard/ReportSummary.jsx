import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

const calculateSummary = (reports) => {
  const statusMap = {
    0: { count: 0, color: 'primary', label: '접수됨' },
    1: { count: 0, color: 'warning', label: '진행중' },
    2: { count: 0, color: 'success', label: '완료됨' },
    3: { count: 0, color: 'error', label: '보류됨' }
  };

  reports.forEach((report) => {
    if (statusMap[report.status]) {
      statusMap[report.status].count += 1;
    }
  });

  return Object.keys(statusMap).map((status) => ({
    status,
    count: statusMap[status].count,
    color: statusMap[status].color,
    label: statusMap[status].label
  }));
};

const ReportSummary = () => {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reports');
        const data = await response.json();
        const summary = calculateSummary(data);
        setSummaryData(summary);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <Grid container spacing={2}>
      {summaryData.map((data, index) => (
        <Grid item md={6} lg={3} key={index}>
          <AnalyticEcommerce color={data.color} title={data.label} count={`${data.count}건`} extra="compared to last month" />
        </Grid>
      ))}
    </Grid>
  );
};

export default ReportSummary;
