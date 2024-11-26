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



CREATE TABLE accidents (
  accidentsNo INT AUTO_INCREMENT PRIMARY KEY,
  accidentName VARCHAR(255),
  accidentDateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accidentType VARCHAR(255),
  safetyAccidentType VARCHAR(255),
  death int(10),
  missing int(10),
  deathMissing int(10),
  injured int(10),
  seaArea VARCHAR(50),
  shipUseStatistics VARCHAR(50),
  shipUseLarge VARCHAR(50),
  shipUseMedium VARCHAR(50),
  shipUseSmall VARCHAR(50),
  shipTonnage decimal(10,2),
  shipTonnageStatistics VARCHAR(255),
  lat decimal(6,3),
  lng decimal(6,3),
  accidentYear int(4),
);
