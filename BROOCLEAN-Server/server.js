const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // 본인의 MySQL 사용자 이름
  password: 'brcladmin1!', // 본인의 MySQL 비밀번호
  database: 'brcl_report'
});

// 데이터베이스 연결 테스트
db.connect((err) => {
  if (err) {
    console.error('DB 연결 실패:', err);
    return;
  }
  console.log('MySQL DB 연결 성공');
});

// 신고 데이터 가져오기 API
app.get('/api/reports', (req, res) => {
  const query = 'SELECT caseNumber, subject, status, mobile, email, createdDate FROM reports';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('서버 에러');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/report/:caseNo', (req, res) => {
  const { caseNo } = req.params;
  const query = 'SELECT caseNumber, subject, status, mobile, email, createdDate, description, location FROM reports WHERE caseNumber = ?';

  db.query(query, [caseNo], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('서버 오류');
    } else if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).send('데이터를 찾을 수 없습니다.');
    }
  });
});

// 서버 시작
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`백엔드 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
