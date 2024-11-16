import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { getReportDetail, updateReportStatus } from '../../api/api';
import { useRouter, useSearchParams } from 'expo-router';

export default function ReportDetailScreen() {
  const { caseNo } = useSearchParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const data = await getReportDetail(caseNo as string);
        setReport(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportDetail();
  }, [caseNo]);

  const handleCloseCase = async () => {
    try {
      await updateReportStatus(caseNo as string, 'closed', '사례 종료됨');
      alert('사례가 종료되었습니다.');
      router.back();
    } catch (error) {
      console.error('사례 종료 실패:', error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#ffd33d" />;

  return (
    <View style={styles.container}>
      {report ? (
        <>
          <Text style={styles.text}>제목: {report.subject}</Text>
          <Text style={styles.text}>설명: {report.description}</Text>
          <Text style={styles.text}>상태: {report.status}</Text>
          <Text style={styles.text}>위치: {report.location}</Text>
          <Text style={styles.text}>생성일: {report.createdDate}</Text>
          {report.status !== 'closed' && <Button title="사례 종료" onPress={handleCloseCase} />}
        </>
      ) : (
        <Text>데이터를 찾을 수 없습니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#25292e' },
  text: { color: '#fff', marginBottom: 10 }
});
