import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import axios from 'axios';

import ImageViewer from '@/components/ImageViewer';
import Button from '@/components/Button';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function ReportScreen() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 이미지 선택 함수
  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      Alert.alert('사진을 선택하지 않았습니다.');
    }
  };

  // 위치 정보 가져오기 함수
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('위치 권한이 필요합니다.');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude
    });
    Alert.alert('위치 정보 가져오기 완료');
  };

  // 신고 데이터 서버로 전송
  const handleSubmit = async () => {
    if (!subject || !description || !location) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('description', description);
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());

      if (selectedImage) {
        const filename = selectedImage.split('/').pop();
        const fileType = filename?.split('.').pop();

        formData.append('image', {
          uri: selectedImage,
          name: filename,
          type: `image/${fileType}`
        } as any);
      }

      await axios.post('http://localhost:5000/api/report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Alert.alert('신고 완료', '신고가 성공적으로 접수되었습니다.');
      router.push('/report-list');
    } catch (error) {
      console.error('신고 실패:', error);
      Alert.alert('신고 실패', '신고 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 이미지 뷰어 */}
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>

      {/* 제목 입력 */}
      <Text style={styles.label}>제목</Text>
      <TextInput style={styles.input} placeholder="제목을 입력하세요" value={subject} onChangeText={setSubject} />

      {/* 설명 입력 */}
      <Text style={styles.label}>설명</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="설명을 입력하세요"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* 위치 가져오기 버튼 */}
      <Button label="위치 정보 가져오기" onPress={getLocation} />

      {/* 위치 정보 표시 */}
      {location && (
        <Text style={styles.locationText}>
          위치: {location.latitude}, {location.longitude}
        </Text>
      )}

      {/* 사진 선택 버튼 */}
      <Button theme="picture" label="사진 선택" onPress={pickImageAsync} />

      {/* 로딩 표시 & 신고하기 버튼 */}
      {loading ? (
        <ActivityIndicator size="large" color="#ffd33d" style={{ marginTop: 20 }} />
      ) : (
        <Button label="신고하기" onPress={handleSubmit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#25292e', justifyContent: 'center' },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  label: { color: '#fff', fontSize: 18, marginBottom: 10 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  locationText: { color: '#ffd33d', marginVertical: 10, textAlign: 'center' }
});
