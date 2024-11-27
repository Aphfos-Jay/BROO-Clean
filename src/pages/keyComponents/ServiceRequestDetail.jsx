import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainCard from 'components/MainCard';
import ServiceRequestMap from 'components/ServiceRequestMap';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const ServiceRequestDetail = () => {
  const { caseNo } = useParams();
  const nav = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(0);
  const [comment, setComment] = useState('');

  // const BASE_URL = 'http://192.168.75.187:5000/api';
  const BASE_URL = 'http://192.168.93.202:5000/api'; // 스마트폰 핫스팟

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/report/${caseNo}`)
      .then((response) => {
        setCaseData(response.data);
        setStatus(response.data.status);
        setLoading(false);
      })
      .catch((error) => {
        console.error('데이터를 가져오는 중 오류:', error);
        setLoading(false);
      });
  }, [caseNo]);

  const handleStatusChange = (event) => setStatus(event.target.value);
  const handleCommentChange = (event) => setComment(event.target.value);

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/api/update/${caseNo}`, { status, comment })
      .then(() => {
        alert('상태가 성공적으로 업데이트되었습니다.');
        nav(-1);
      })
      .catch((error) => {
        console.error('상태 업데이트 중 오류:', error);
        alert('상태 업데이트에 실패했습니다.');
      });
  };

  if (loading) return <Typography>로딩 중...</Typography>;

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

  const { caseNumber, subject, mobile, email, createdDate, description, location, image } = caseData;

  // +9시간 조정된 날짜
  const adjustedDate = new Date(new Date(createdDate).getTime() + 9 * 60 * 60 * 1000).toLocaleString();
  const adjustImage = 'http://localhost:5000' + image;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        신고 상세 정보
      </Typography>
      <MainCard>
        <Stack spacing={3}>
          {/* 신고 정보 카드 */}
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                신고 정보
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body1">
                    <strong>접수 일자:</strong> {adjustedDate}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1">
                    <strong>주제:</strong> {subject}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1">
                    <strong>좌표:</strong> {`(${location?.x}, ${location?.y})`}
                  </Typography>
                  <Typography variant="h6" color="secondary" gutterBottom>
                    위치 정보 (지도)
                  </Typography>
                  <ServiceRequestMap location={{ x: location?.x, y: location?.y }} />
                </Box>
                <Box>
                  <Typography variant="body1">
                    <strong>설명:</strong> {description}
                  </Typography>
                </Box>
                <Box>
                  <strong>첨부 이미지</strong>
                  <Typography variant="body1">
                    <img src={adjustImage} width="800px" />
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* 신고자 정보 카드 */}
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary" gutterBottom>
                신고자 정보
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body1">
                    <strong>연락처:</strong> {mobile}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1">
                    <strong>이메일:</strong> {email}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* 상태 변경 및 코멘트 입력 */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            상태 변경 및 코멘트
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="status-label">상태 변경</InputLabel>
            <Select labelId="status-label" value={status} onChange={handleStatusChange} label="상태 변경">
              <MenuItem value={0}>접수됨</MenuItem>
              <MenuItem value={1}>진행중</MenuItem>
              <MenuItem value={2}>완료</MenuItem>
              <MenuItem value={3}>보류됨</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="담당자 코멘트"
            multiline
            rows={4}
            value={caseData.comment}
            onChange={handleCommentChange}
            variant="outlined"
            fullWidth
            sx={{ marginTop: 2 }}
          />

          <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: 3 }}>
            상태 저장
          </Button>
        </Stack>
      </MainCard>
    </Box>
  );
};

export default ServiceRequestDetail;
