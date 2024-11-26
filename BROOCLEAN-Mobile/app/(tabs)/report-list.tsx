import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getMyReports } from '../../api/api';
import Button from '@/components/Button';

type Report = {
  caseNumber: number;
  subject: string;
  status: string;
};

export default function ReportListScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const router = useRouter();

  // 탭 접근 시마다 인증 초기화
  useFocusEffect(
    React.useCallback(() => {
      setIsAuthenticated(false);
      setPhoneNumber('');
      setEmail('');
    }, [])
  );

  // 신고 목록 가져오기
  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getMyReports(phoneNumber, email);
      if (data.length === 0) {
        Alert.alert('알림', '신고 내역이 없습니다.');
        setIsAuthenticated(false);
      } else {
        setReports(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // 폼 검증 및 인증 처리
  const handleAuth = () => {
    if (!phoneNumber || !email) {
      Alert.alert('입력 오류', '휴대폰 번호와 이메일을 모두 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('입력 오류', '유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setIsAuthenticated(true);
    fetchReports();
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>휴대폰 번호와 이메일을 입력해주세요</Text>
        <TextInput
          style={styles.input}
          placeholder="휴대폰 번호"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="이메일 주소"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button label="확인" onPress={handleAuth} />
      </View>
    );
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#ffd33d" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      {reports.length > 0 ? (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.caseNumber.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/report-detail?caseNo=${item.caseNumber}`)}>
              <View style={styles.item}>
                <Text style={styles.title}>{item.subject}</Text>
                <Text style={styles.status}>Status: {item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noReports}>신고 내역이 없습니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#25292e'
  },
  authTitle: {
    color: '#ffd33d',
    fontSize: 24,
    marginBottom: 20
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25292e'
  },
  item: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#333',
    borderRadius: 10
  },
  title: {
    color: '#ffd33d',
    fontSize: 18
  },
  status: {
    color: '#fff'
  },
  noReports: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18
  }
});
