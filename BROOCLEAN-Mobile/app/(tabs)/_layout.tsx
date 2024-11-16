import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: { backgroundColor: '#25292e' },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#25292e' }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        }}
      />
      <Tabs.Screen
        name="report-list"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'list-circle' : 'list-circle-outline'} color={color} size={24} />
        }}
      />
    </Tabs>
  );
}
