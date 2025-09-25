import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { 
  Home, 
  Heart, 
  Grid3X3, 
  MessageCircle, 
  User
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/colors';
import { useApp } from '@/hooks/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { userMode } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Redirect to provider tabs if in provider mode
  useEffect(() => {
    if (userMode === 'provider') {
      router.replace('/(proTabs)/dashboard');
    }
  }, [userMode, router]);

  // If in provider mode, don't render user tabs
  if (userMode === 'provider') {
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
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} testID="tab-icon-home" />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color, size }) => (
            <Heart size={size} color={color} testID="tab-icon-favorites" />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Tout',
          tabBarIcon: ({ color, size }) => (
            <Grid3X3 size={size} color={color} testID="tab-icon-categories" />
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
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} testID="tab-icon-profile" />
          ),
        }}
      />
      
      {/* Hidden tabs - accessible via navigation but not shown in tab bar */}
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          href: null,
        }}
      />
      <Tabs.Screen
        name="professionnels"
        options={{
          href: null,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
});