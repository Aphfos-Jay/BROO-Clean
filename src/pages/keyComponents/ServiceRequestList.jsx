import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dot from 'components/@extended/Dot';
import axios from 'axios';

// 상태 표시 색상 및 텍스트
function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'primary';
      title = '접수됨';
      break;
    case 1:
      color = 'warning';
      title = '진행중';
      break;
    case 2:
      color = 'success';
      title = '완료';

      break;
    default:
      color = 'error';
      title = '보류됨';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

const statusOptions = [
  { value: 'all', label: '전체' },
  { value: 0, label: '접수됨' },
  { value: 1, label: '진행중' },
  { value: 2, label: '완료' },
  { value: 3, label: '보류됨' }
];

export default function ServiceRequest() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredRows, setFilteredRows] = useState([]);
  const [reports, setReports] = useState([]);

  // 검색 및 필터링 로직 함수로 분리
  const filterData = () => {
    let filteredData = [...reports];

    // 검색어 필터
    if (searchTerm.trim() !== '') {
      filteredData = filteredData.filter(
        (row) =>
          row.caseNumber.toString().includes(searchTerm) ||
          row.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.mobile.includes(searchTerm) ||
          row.Email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터 적용
    if (statusFilter !== 'all') {
      filteredData = filteredData.filter((row) => row.status === parseInt(statusFilter));
    }

    return filteredData;
  };

  // 검색어 또는 필터가 변경될 때마다 데이터를 갱신
  useEffect(() => {
    const updatedRows = filterData();
    setFilteredRows(updatedRows);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports');
        setReports(response.data);
        setFilteredRows(response.data);
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };
    fetchReports();
  }, []);

  const handleRowClick = (caseNumber) => {
    navigate(`/srDetails/${caseNumber}`);
  };

  return (
    <MainCard>
      {/* 검색 및 필터 UI */}
      <Box sx={{ padding: 2, display: 'flex', gap: 2 }}>
        <TextField label="검색" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth />
        <TextField label="상태 필터" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ width: 200 }}>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* 테이블 */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>주제</TableCell>
              <TableCell>위치</TableCell>
              <TableCell>진행 상태</TableCell>
              <TableCell align="right">전화번호</TableCell>
              <TableCell align="right">이메일</TableCell>
              <TableCell align="right">접수날짜</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <TableRow key={row.caseNumber} hover onClick={() => handleRowClick(row.caseNumber)} sx={{ cursor: 'pointer' }}>
                  <TableCell>{row.caseNumber}</TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>{JSON.stringify(row.location)}</TableCell>
                  <TableCell>
                    <OrderStatus status={row.status} />
                  </TableCell>
                  <TableCell align="right">{row.mobile}</TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.createdDate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
