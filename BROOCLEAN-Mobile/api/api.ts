import axios from 'axios';

const BASE_URL = 'http://192.168.93.202:5000/api';

// 신고 목록 조회
export const getReports = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/reports`);
    return response.data;
  } catch (error) {
    console.error('신고 목록을 가져오는 중 오류:', error);
    throw error;
  }
};

// 신고 상세 조회
export const getReportDetail = async (caseNo: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/report/${caseNo}`);
    return response.data;
  } catch (error) {
    console.error('신고 상세를 가져오는 중 오류:', error);
    throw error;
  }
};

// 신고 상태 업데이트 (사례 종료)
export const updateReportStatus = async (caseNo: string, status: string, comment: string) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${caseNo}`, {
      status,
      comment
    });
    return response.data;
  } catch (error) {
    console.error('상태 업데이트 중 오류:', error);
    throw error;
  }
};
