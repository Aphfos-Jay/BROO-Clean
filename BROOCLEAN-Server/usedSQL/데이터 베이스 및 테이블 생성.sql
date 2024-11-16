CREATE DATABASE brcl_report DEFAULT CHARACTER SET UTF8;
USE brcl_report;


CREATE TABLE reports (
  caseNumber INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(255),
  description VARCHAR(255),
  status int(1),
  image longblob,
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  mobile VARCHAR(30),
  email VARCHAR(255)
);

/* 아래의 코드는 필드(컬럼) 사이즈 변경*/
alter table reports modify description text(21845);

/* 테이블에 칼럼 추가*/
ALTER TABLE reports ADD COLUMN comment text(21845);