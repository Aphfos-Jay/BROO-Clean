INSERT INTO reports (subject, description, status, image, createdDate, mobile, email, location)
values('쓰레기 투기 의심 신고','안녕하세요. \n 쓰레기 투기가 의심되어 신고하였습니다. 여기 확인 부탁드립니다. ',0,'',date('2024-11-08'),'010-1234-5678','testEmail@naver.com',point(37.405184,129.209373));

DELETE from reports WHERE caseNumber in (1,5,6,7,8,9,10,11);

update reports set email = '44@44.com' where caseNumber = '13';