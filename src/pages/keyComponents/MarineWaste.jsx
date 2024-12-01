// project import
import MainCard from 'components/MainCard';
import { Tabs, Tab, Box, TextField, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';

// ==============================|| SAMPLE PAGE ||============================== //

const statusOptions = [
  { value: 0, label: '현재' },
  { value: 10, label: '현재 기준 10분뒤' },
  { value: 20, label: '현재 기준 20분뒤' },
  { value: 30, label: '현재 기준 30분뒤' }
];

export default function Home() {
  const [currentTab, setCurrentTab] = useState(0);
  const [htmlContent, setHtmlContent] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [selectBox, setSelectBox] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    // 위치 정보 가져오기
    fetchHtml();
  }, []);

  const fetchHtml = () => {
    setSelectBox(false);
    fetch('http://localhost:8052/trashForecast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        min: minutes
      }),
      cache: 'no-cache'
    })
      .then((response) => response.json())
      .then((data) => {
        setHtmlContent(data.html);
        setSelectBox(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <MainCard>
      {/* Tabs Header */}
      <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" aria-label="Tabs example">
        <Tab label="해양오염분포 " />
        <Tab label="해양오염분포 트래킹" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ padding: 2 }}>
        {currentTab === 0 && (
          <Box>
            <iframe
              src="http://localhost:8501/" // Streamlit 서버 URL
              style={{
                width: '100%',
                height: '1000px',
                border: 'none',
                marginTop: '20px'
              }}
              title="Marine Pollution Map"
            ></iframe>
          </Box>
        )}

        {currentTab === 1 && (
          <Box>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </Box>
        )}
      </Box>
    </MainCard>
  );
}
