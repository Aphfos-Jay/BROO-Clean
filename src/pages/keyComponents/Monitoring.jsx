import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Monitoring() {
  const location = useLocation();
  const [latitude, setLatitude] = useState(location.state?.lat);
  const [longtitude, setlongtitude] = useState(location.state?.lng);
  const [htmlContent, setHtmlContent] = useState('');
  const [selectBox, setSelectBox] = useState(false);

  useEffect(() => {
    // 위치 정보 가져오기
    fetchHtml(latitude, longtitude);
  }, []);

  const fetchHtml = (lat, lng) => {
    setSelectBox(false);
    // 서버에 데이터 전송
    fetch('http://localhost:8052/oceanMonitoring', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: Number(lat),
        longtitude: Number(lng)
      }),
      cache: 'no-cache'
    })
      .then((response) => response.json())
      .then((data) => {
        setHtmlContent(data.html);

        if (data.flag == 1) {
          setSelectBox(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <MainCard>
      <Box sx={{ padding: 2, display: 'flex', gap: 2 }}>
        <Typography variant="h4">위도</Typography>
        <TextField variant="outlined" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        <Typography variant="h4">경도</Typography>
        <TextField variant="outlined" value={longtitude} onChange={(e) => setlongtitude(e.target.value)} />
        <Button variant="outlined" onClick={() => fetchHtml(latitude, longtitude)}>
          분석하기
        </Button>
      </Box>

      <Box>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Box>
    </MainCard>
  );
}
