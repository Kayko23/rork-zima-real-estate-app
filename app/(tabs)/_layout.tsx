import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { 
  Home, 
  Heart, 
  Grid3X3, 
  MessageCircle, 
  User,
  Flag,
  Calendar,
  FileText,
  Menu
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/colors';
import { useApp } from '@/hooks/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { userMode } = useApp();
  const insets = useSafeAreaInsets();

  const userTabs = [
    {
      name: 'index',
      title: 'Explorer',
      icon: Home,
    },
    {
      name: 'favorites',
      title: 'Favoris',
      icon: Heart,
    },
    {
      name: 'categories',
      title: 'Tout',
      icon: Grid3X3,
    },
    {
      name: 'messages',
      title: 'Messages',
      icon: MessageCircle,
    },
    {
      name: 'profile',
      title: 'Profil',
      icon: User,
    },
  ];

  const providerTabs = [
    {
      name: 'dashboard',
      title: "Tableau de bord",
      icon: Flag,
    },
    {
      name: 'agenda',
      title: 'Agenda',
      icon: Calendar,
    },
    {
      name: 'listings',
      title: 'Annonces',
      icon: FileText,
    },
    {
      name: 'messages',
      title: 'Messages',
      icon: MessageCircle,
    },
    {
      name: 'profile',
      title: 'Profil',
      icon: Menu,
    },
  ];

  const currentTabs = userMode === 'provider' ? providerTabs : userTabs;

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
      {currentTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => {
              console.log('[TabBar] render icon', { name: tab.name, color, size, userMode });
              const Icon = tab.icon;
              return <Icon size={size} color={color} testID={`tab-icon-${tab.name}`} />;
            },
          }}
        />
      ))}
      
      {/* Hidden tabs - accessible via navigation but not shown in tab bar */}
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          href: null,
          // hidden from tab bar
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