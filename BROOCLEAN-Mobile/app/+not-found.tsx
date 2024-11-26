import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        {/* 아이콘 추가 */}
        <Ionicons name="alert-circle-outline" size={80} color="#ffd33d" style={styles.icon} />
        <Text style={styles.title}>페이지를 찾을 수 없습니다.</Text>
        <Text style={styles.message}>요청하신 페이지가 존재하지 않거나, 삭제된 페이지입니다.</Text>

        {/* 홈으로 돌아가기 버튼 */}
        <Link href="/" style={styles.button}>
          <Ionicons name="home" size={20} color="#25292e" />
          <Text style={styles.buttonText}>홈 화면으로 돌아가기</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  icon: {
    marginBottom: 20
  },
  title: {
    color: '#ffd33d',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffd33d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  buttonText: {
    color: '#25292e',
    fontSize: 18,
    marginLeft: 10
  }
});
