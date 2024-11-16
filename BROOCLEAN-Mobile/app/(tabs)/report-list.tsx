import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getReports } from '../../api/api';
import { useRouter } from 'expo-router';

export default function ReportListScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#ffd33d" />;

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#25292e' },
  item: { padding: 15, marginVertical: 10, backgroundColor: '#333', borderRadius: 10 },
  title: { color: '#ffd33d', fontSize: 18 },
  status: { color: '#fff' }
});
