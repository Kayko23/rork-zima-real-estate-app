import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  MessageCircle, 
  Settings
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProTabsLayout() {
  const { userMode } = useAppStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Redirect to user tabs if in user mode
  useEffect(() => {
    if (userMode === 'user') {
      router.replace('/(tabs)/home');
    }
  }, [userMode, router]);

  // If in user mode, don't render provider tabs
  if (userMode === 'user') {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: [
          styles.tabBar, 
          { 
            paddingBottom: Math.max(insets.bottom, 8),
            height: 64 + Math.max(insets.bottom, 8)
          }
        ],
        tabBarBackground: () => (
          Platform.OS === 'web' ? (
            <View style={[styles.tabBarBackground, styles.webTabBarBackground]} />
          ) : (
            <BlurView
              intensity={20}
              tint="light"
              style={styles.tabBarBackground}
            />
          )
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
          lineHeight: 12,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
      initialRouteName="dashboard"
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} testID="tab-icon-dashboard" />
          ),
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: 'Annonces',
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} testID="tab-icon-listings" />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} testID="tab-icon-messages" />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} testID="tab-icon-agenda" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} testID="tab-icon-profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    borderTopWidth: 0,
    elevation: 0,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 30,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  webTabBarBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    backdropFilter: 'blur(26px)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
});