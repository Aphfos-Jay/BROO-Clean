const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const multer = require('multer');

// 파일 업로드 경로 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL 연결 설정
const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // 본인의 MySQL 사용자 이름
  password: 'brcladmin1!', // 본인의 MySQL 비밀번호
  database: 'brcl_report',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: 'date'
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
      .query('SELECT caseNumber, subject, status, mobile, email, createdDate, location, comment FROM reports ORDER BY caseNumber DESC ');
    res.json(results);
  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).send('서버 에러');
  }
});

app.get('/api/myReports', async (req, res) => {
  const { mobile, email } = req.query;

  // 입력된 mobile과 email을 확인합니다.
  if (!mobile || !email) {
    return res.status(400).json({ error: '휴대폰 번호와 이메일은 필수입니다.' });
  }

  try {
    const [results] = await db
      .promise()
      .query(
        'SELECT caseNumber, subject, status, mobile, email, createdDate, location, comment FROM reports WHERE mobile = ? AND email = ?',
        [mobile, email]
      );

    // 결과가 없을 경우 처리
    if (results.length === 0) {
      return res.status(404).json({ message: '일치하는 신고 내역이 없습니다.' });
    }

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
        'SELECT caseNumber, subject, status, mobile, email, createdDate, description, location, comment, image FROM reports WHERE caseNumber = ?',
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
app.post('/api/mobileCreate', upload.single('image'), async (req, res) => {
  const { subject, description, mobile, email, createdDate, location } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  console.log('Uploaded file:', req.file); // 디버그용
  try {
    // 프론트엔드로부터 받은 데이터 출력
    console.log('Uploaded file:', req.file); // 디버그용
    let locationPoint = null;

    // location 파싱 (JSON 형태에서 추출)
    if (location) {
      const { latitude, longitude } = JSON.parse(location);
      locationPoint = `POINT(${latitude},${longitude})`;
    }

    const query = `
      INSERT INTO reports (subject, description, status, image, createdDate, mobile, email, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ${locationPoint ? locationPoint : 'NULL'})
    `;

    const values = [
      subject,
      description,
      0, // 상태 (0: 접수됨)
      (image = imagePath),
      createdDate,
      mobile,
      email
    ];

    console.log('쿼리 데이터:', values); // 전달되는 데이터 확인

    await db.promise().query(query, values);
    res.status(201).json({ message: '신고 접수 성공' });
  } catch (error) {
    console.error('신고 저장 오류:', error);
    res.status(500).json({ error: '신고 저장 실패' });
  }
});

app.get('/api/reverse-geocode', async (req, res) => {
  const { x, y } = req.query;
  console.log(' 여기가 실행 되었음!');
  console.log('x, y ==> ' + x, y);

  if (!x || !y) {
    return res.status(400).json({ error: 'x와 y 좌표가 필요합니다.' });
  }

  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${y},${x}&sourcecrs=epsg:4326&orders=admcode,roadaddr&output=json`;
  const clientId = 'brjvrajhzz';
  const clientSecret = 'pJIztOnNipj8oqbLNdbWZJYbLUN5Kf3u9beBCAW0';
  try {
    const response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret
      }
    });

    const data = await response.json();
    console.log('서버쪽 Response Data ==> ' + JSON.stringify(data));
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Reverse Geocoding 요청 실패' });
  }
});

// 서버 시작
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`백엔드 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
