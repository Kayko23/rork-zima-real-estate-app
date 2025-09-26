import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Home, Heart, Search, MessageCircle, User2 } from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

export default function TabsLayout() {
  const { userMode } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (userMode === 'provider') {
      router.replace('/(proTabs)/dashboard');
    }
  }, [userMode, router]);

  if (userMode === 'provider') return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1F2937',
        tabBarInactiveTintColor: '#7C8A9A',
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 14,
          borderTopWidth: 0,
          backgroundColor: '#fff',
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User2 color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});