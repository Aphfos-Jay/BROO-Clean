import axios from 'axios';

const BASE_URL = 'http://192.168.93.202:5000/api'; // 스마트폰 핫스팟
// const BASE_URL = 'http://192.168.45.250:5000/api';

// 신고 목록 조회
export const getReports = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/reports`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyReports = async (mobile: string, email: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/myReports?mobile=${encodeURIComponent(mobile)}&email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 신고 상세 조회
export const getReportDetail = async (caseNo: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/report/${caseNo}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 신고 데이터 전송
export const createReport = async (formData: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/mobileCreate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
