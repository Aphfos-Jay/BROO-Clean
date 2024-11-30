import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';

const headCells = [
  { id: 'location', align: 'left', label: 'Location' },
  { id: 'trashCnt', align: 'right', label: 'Trash Count' },
  { id: 'weight', align: 'right', label: 'Weight' },
  { id: 'latitude', align: 'right', label: 'Latitude' },
  { id: 'longitude', align: 'right', label: 'Longitude' },
  { id: 'monitoring', align: 'center', label: 'Monitorng' }
];

function TrashTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| TRASH TABLE ||============================== //

export default function TrashTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const nav = useNavigate();
  // 검색 및 필터링 로직 함수로 분리
  const filterData = () => {
    let filteredData = [...data];

    // 검색어 필터
    if (searchTerm.trim() !== '') {
      filteredData = filteredData.filter(
        (row) =>
          row.location.toString().includes(searchTerm.toLowerCase()) ||
          row.trashCnt.toString().includes(searchTerm.toLowerCase()) ||
          row.weight.toString().includes(searchTerm.toLowerCase())
      );
    }

    return filteredData;
  };

  // 검색어 또는 필터가 변경될 때마다 데이터를 갱신
  useEffect(() => {
    const updatedRows = filterData();
    setFilteredRows(updatedRows);
  }, [searchTerm]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/trash');
        const resData = await response.json();
        setData(resData);
        setFilteredRows(resData);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류:', error);
      }
    };

    fetchReports();
  }, []);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMonitoringClick = (latitude, longitude) => {
    nav('/monitoring', { state: { lat: latitude, lng: longitude } });
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredRows.length - page * rowsPerPage);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Box sx={{ padding: 2, display: 'flex', gap: 2 }}>
          <TextField label="검색" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth />
        </Box>
        <Table aria-labelledby="tableTitle">
          <TrashTableHead />
          <TableBody>
            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <Link color="secondary">{row.location}</Link>
                </TableCell>
                <TableCell align="right">{row.trashCnt} 개</TableCell>
                <TableCell align="right">{row.weight} Kg</TableCell>
                <TableCell align="right">{row.latitude}</TableCell>
                <TableCell align="right">{row.longtitude}</TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => {
                      handleMonitoringClick(row.latitude, row.longtitude);
                    }}
                  >
                    모니터링
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
