import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Home as HomeIcon, Heart, Building2, MessageCircle, User } from 'lucide-react-native';
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
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 12,
          height: 68,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.72)',
          borderWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          backdropFilter: 'blur(16px)' as any,
        },
        tabBarActiveTintColor: '#0B5C4A',
        tabBarInactiveTintColor: '#9AA4AE',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
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
        name="properties"
        options={{
          title: 'Biens',
          tabBarIcon: ({ color, size }) => <Building2 color={color} size={size + 4} />,
          tabBarItemStyle: {
            marginTop: -10,
            backgroundColor: 'rgba(11,92,74,0.10)',
            borderRadius: 14,
          },
          tabBarLabelStyle: { fontWeight: '600' },
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
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />

      {/* Hidden routes under tabs to keep header + bottom bar when navigated to */}
      <Tabs.Screen name="voyages" options={{ href: null }} />
      <Tabs.Screen name="vehicles" options={{ href: null }} />
    </Tabs>
  );
}
