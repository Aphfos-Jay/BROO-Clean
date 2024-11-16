const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MySQL 연결 설정
const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // 본인의 MySQL 사용자 이름
  password: 'brcladmin1!', // 본인의 MySQL 비밀번호
  database: 'brcl_report',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 데이터베이스 연결 테스트
db.getConnection((err, connection) => {
  if (err) {
    console.error('DB 연결 실패:', err);
    return;
  }
  console.log('MySQL DB 연결 성공');
  connection.release();
});

// 신고 데이터 가져오기 API
app.get('/api/reports', async (req, res) => {
  try {
    const [results] = await db
      .promise()
      .query('SELECT caseNumber, subject, status, mobile, email, createdDate, location, comment FROM reports');
    res.json(results);
  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).send('서버 에러');
  }
});

// 신고 데이터 디테일 한건만 가져오기
app.get('/api/report/:caseNo', async (req, res) => {
  const { caseNo } = req.params;
  try {
    const [result] = await db
      .promise()
      .query(
        'SELECT caseNumber, subject, status, mobile, email, createdDate, description, location, comment FROM reports WHERE caseNumber = ?',
        [caseNo]
      );

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).send('데이터를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).send('서버 에러');
  }
});

// 신고 데이터 업데이트 API
app.put('/api/update/:caseNo', async (req, res) => {
  const { caseNo } = req.params;
  const { status, comment } = req.body;

  try {
    const [result] = await db.promise().query('UPDATE reports SET status = ?, comment = ? WHERE caseNumber = ?', [status, comment, caseNo]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: '상태가 성공적으로 업데이트되었습니다.' });
    } else {
      res.status(404).json({ error: '해당 신고를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('상태 업데이트 중 오류:', error);
    res.status(500).json({ error: '상태 업데이트에 실패했습니다.' });
  }
});

// 모바일에서 작성한 신고 데이터 저장 API
app.post('/api/mobileCreate', async (req, res) => {
  const { subject, description, latitude, longitude } = req.body;
  const image = req.files?.image;

  try {
    const query = 'INSERT INTO reports (subject, description, latitude, longitude, image) VALUES (?, ?, ?, ?, ?)';
    const values = [subject, description, latitude, longitude, image ? image.path : null];
    await db.promise().query(query, values);
    res.status(201).json({ message: '신고 접수 성공' });
  } catch (error) {
    console.error('신고 저장 오류:', error);
    res.status(500).json({ error: '신고 저장 실패' });
  }
});

// 서버 시작
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`백엔드 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
