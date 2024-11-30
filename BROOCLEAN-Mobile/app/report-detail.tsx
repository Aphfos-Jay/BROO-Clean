import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, Alert, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getReportDetail } from '../api/api';

const screenWidth = Dimensions.get('window').width;
// const BASE_URL = 'http://192.168.45.250:5000'; // 집 와이파이
const BASE_URL = 'http://192.168.93.202:5000'; // 스마트폰 핫스팟

export default function ReportDetailScreen() {
  const { caseNo } = useLocalSearchParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (!caseNo) {
        Alert.alert('오류', '유효하지 않은 요청입니다.');
        return;
      }
      try {
        const data = await getReportDetail(caseNo as string);
        if (data) {
          setReport(data);
        } else {
          Alert.alert('데이터 없음', '해당 신고 데이터를 찾을 수 없습니다.');
        }
      } catch (error) {
        Alert.alert('오류', '데이터를 불러오는 중 문제가 발생했습니다.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportDetail();
  }, [caseNo]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffd33d" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>신고 데이터를 찾을 수 없습니다.</Text>
        <Text style={styles.errorText}>이전 화면으로 돌아가 다시 시도해주세요.</Text>
      </View>
    );
  }

  const { x, y } = report.location || {};
  const localCreatedDate = new Date(report.createdDate);
  localCreatedDate.setHours(localCreatedDate.getHours() + 9); // KST 변환
  console.log('Image URL:', `${BASE_URL}${report.image}`);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{report.subject}</Text>
      <View style={styles.detailBox}>
        <Text style={styles.label}>설명</Text>
        <Text style={styles.value}>{report.description || '설명 없음'}</Text>
      </View>
      {report.image && (
        <View style={styles.imageContainer}>
          <Text style={styles.label}>첨부된 이미지</Text>
          <Image
            source={{ uri: `${BASE_URL}${report.image}` }} // 이미지 URL
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={styles.detailBox}>
        <Text style={styles.label}>상태</Text>
        <Text style={styles.value}>
          {report.status == 0
            ? '접수됨'
            : report.status == 1
              ? '진행중'
              : report.status == 2
                ? '완료됨'
                : report.status == 3
                  ? '보류됨'
                  : '상태없음'}
        </Text>
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.label}>위치</Text>
        {x && y ? (
          <>
            <Text style={styles.value}>
              Lat: {x}, Lon: {y}
            </Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(x),
                longitude: parseFloat(y),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(x),
                  longitude: parseFloat(y)
                }}
                title={report.subject}
                description={report.description}
              />
            </MapView>
          </>
        ) : (
          <Text style={styles.value}>위치 정보 없음</Text>
        )}
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.label}>작성일</Text>
        <Text style={styles.value}>{report.createdDate ? new Date(localCreatedDate).toLocaleString() : '작성일 정보 없음'}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText} onPress={() => router.push('/report-list')}>
          목록으로 돌아가기
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#25292e',
    flexGrow: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
    padding: 20
  },
  errorText: {
    color: '#ff5c5c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    color: '#ffd33d',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  detailBox: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5
  },
  value: {
    fontSize: 18,
    color: '#ddd',
    fontWeight: '500'
  },
  map: {
    width: screenWidth - 40,
    height: 200,
    marginTop: 10,
    borderRadius: 10
  },
  buttonContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffd33d',
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#25292e',
    fontSize: 18,
    fontWeight: 'bold'
  },
  imageContainer: { marginTop: 20 },
  image: { width: screenWidth - 40, height: 300, borderRadius: 10 }
});
