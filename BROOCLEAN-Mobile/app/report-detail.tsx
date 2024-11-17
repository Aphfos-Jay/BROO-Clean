import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { getReportDetail } from '../api/api';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ReportDetailScreen() {
  const { caseNo } = useLocalSearchParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (!caseNo) return;
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

  if (loading) return <ActivityIndicator size="large" color="#ffd33d" />;

  return (
    <View style={styles.container}>
      {report ? (
        <>
          <Text style={styles.text}>제목: {report.subject}</Text>
          <Text style={styles.text}>설명: {report.description}</Text>
          <Text style={styles.text}>상태: {report.status}</Text>
          {/* location이 객체일 경우 JSON.stringify를 사용하여 문자열로 변환 */}
          <Text style={styles.text}>위치: {typeof report.location === 'object' ? JSON.stringify(report.location) : report.location}</Text>
          <Text style={styles.text}>생성일: {report.createdDate}</Text>
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
