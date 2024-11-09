import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainCard from 'components/MainCard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const ServiceRequestDetail = () => {
  const { caseNo } = useParams();
  console.log('caseNo --> ', caseNo);
  const nav = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 데이터 가져오기
    axios
      .get(`http://localhost:5000/api/report/${caseNo}`)
      .then((response) => {
        setCaseData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('데이터를 가져오는 중 오류:', error);
        setLoading(false);
      });
  }, [caseNo]);

  if (loading) {
    return <Typography>로딩 중...</Typography>;
  }

  if (!caseData) {
    return (
      <MainCard>
        <Typography variant="h4" color="error">
          데이터를 찾을 수 없습니다.
        </Typography>
        <Button variant="contained" onClick={() => nav(-1)}>
          돌아가기
        </Button>
      </MainCard>
    );
  }

  const { caseNumber, subject, status, mobile, email, createdDate, description, location } = caseData;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        신고 상세 정보
      </Typography>
      <Stack spacing={2}>
        <Typography>
          <strong>No:</strong> {caseNumber}
        </Typography>
        <Typography>
          <strong>No:</strong> {createdDate}
        </Typography>
        <Typography>
          <strong>주제:</strong> {subject}
        </Typography>
        <Typography>
          <strong>설명:</strong> {description}
        </Typography>
        <Typography>
          <strong>진행 상태:</strong> {status === 0 ? '진행중' : report.status === 1 ? '완료' : report.status === 2 ? '보류됨' : '접수됨'}
        </Typography>
        <Typography>
          <strong>신고자 연락처:</strong> {mobile}
        </Typography>
        <Typography>
          <strong>신고자 이메일:</strong> {email}
        </Typography>
      </Stack>
    </Box>
  );
};

export default ServiceRequestDetail;
