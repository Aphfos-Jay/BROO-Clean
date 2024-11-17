import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { createReport } from '../../api/api';
import Button from '@/components/Button';

export default function ReportScreen() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isCameraPhoto, setIsCameraPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted' || locationStatus !== 'granted') {
        Alert.alert('권한 오류', '필수 권한이 부여되지 않았습니다.');
      }
    })();
  }, []);

  const pickImage = async (source: 'camera' | 'library') => {
    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
      setIsCameraPhoto(true);
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
      setIsCameraPhoto(false);
    }

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      Alert.alert('사진을 선택하지 않았습니다.');
    }
  };

  const handleImagePick = () => {
    Alert.alert('사진 선택', '옵션을 선택하세요.', [
      { text: '취소', style: 'cancel' },
      { text: '촬영하기', onPress: () => pickImage('camera') },
      { text: '저장소에서 선택', onPress: () => pickImage('library') }
    ]);
  };

  const handleSubmit = async () => {
    if (!subject || !description || !mobile || !email) {
      Alert.alert('입력 오류', '모든 필드는 필수입니다.');
      return;
    }

    setLoading(true);

    try {
      let currentLocation = null;
      if (isCameraPhoto) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          currentLocation = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setLocation(currentLocation);
        } else {
          Alert.alert('위치 권한이 필요합니다.');
        }
      }

      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('description', description);
      formData.append('mobile', mobile);
      formData.append('email', email);
      formData.append('createdDate', new Date().toISOString());

      if (currentLocation) {
        formData.append('latitude', currentLocation.latitude.toString());
        formData.append('longitude', currentLocation.longitude.toString());
      }

      if (selectedImage) {
        const filename = selectedImage.split('/').pop();
        const fileType = filename?.split('.').pop();
        formData.append('image', { uri: selectedImage, name: filename, type: `image/${fileType}` } as any);
      }

      await createReport(formData);
      Alert.alert('신고 완료', '신고가 성공적으로 접수되었습니다.');
      router.push('/report-list');
    } catch (error) {
      Alert.alert('신고 실패', '신고 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 입력 폼 */}
      <Text style={styles.label}>제목</Text>
      <TextInput style={styles.input} placeholder="제목을 입력하세요" value={subject} onChangeText={setSubject} />

      <Text style={styles.label}>휴대폰 번호</Text>
      <TextInput style={styles.input} placeholder="휴대폰 번호" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

      <Text style={styles.label}>이메일</Text>
      <TextInput style={styles.input} placeholder="이메일" value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>설명</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="설명을 입력하세요"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* 사진 선택 버튼 */}
      <Button theme="picture" label="사진 선택" onPress={handleImagePick} />

      {/* 사진 미리보기 */}
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}

      {/* 신고하기 버튼 */}
      {!loading ? (
        <Button label="신고하기" onPress={handleSubmit} />
      ) : (
        <ActivityIndicator size="large" color="#ffd33d" style={{ marginTop: 20 }} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#25292e', alignItems: 'center' },
  label: { color: '#fff', fontSize: 18, marginVertical: 10, alignSelf: 'flex-start' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 10, width: '100%', marginBottom: 15 },
  textArea: { height: 150, textAlignVertical: 'top' },
  imagePreview: { width: 300, height: 300, marginVertical: 20, borderRadius: 15 }
});
