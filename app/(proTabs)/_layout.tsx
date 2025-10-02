import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, Pressable } from 'react-native';
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  MessageCircle, 
  Settings
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/colors';
import { useApp } from '@/hooks/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function ProTabsLayout() {
  const { userMode } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (userMode === 'user') {
      router.replace('/');
    }
  }, [userMode, router]);

  if (userMode === 'user') {
    return null;
  }

  const CustomTabBar = (props: any) => {
    const { state, navigation } = props;
    const bottomPad = Math.max(insets.bottom, 10);
    const barHeight = 66 + bottomPad;

    const tabs = [
      { name: 'dashboard', icon: BarChart3, label: 'Dashboard' },
      { name: 'messages', icon: MessageCircle, label: 'Messages' },
      { name: 'listings', icon: FileText, label: 'Annonces', isCenter: true },
      { name: 'agenda', icon: Calendar, label: 'Agenda' },
      { name: 'profile', icon: Settings, label: 'Profil' },
    ];

    return (
      <View style={{ height: barHeight, backgroundColor: 'transparent' }}>
        <View style={[styles.tabBarWrap, { paddingBottom: bottomPad }]}>
          {Platform.OS === 'web' ? (
            <View style={[styles.tabBarBackground, styles.webTabBarBackground]} />
          ) : (
            <BlurView intensity={30} tint="light" style={styles.tabBarBackground} />
          )}
          <View style={styles.tabBarRow}>
            {tabs.map((tab) => {
              const route = state.routes.find((r: any) => r.name === tab.name);
              if (!route) return null;
              
              const isFocused = state.routes[state.index]?.name === tab.name;
              const Icon = tab.icon;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <Pressable
                  key={tab.name}
                  onPress={onPress}
                  style={[styles.tabItem, tab.isCenter && styles.centerTabItem]}
                  testID={`tab-${tab.name}`}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      tab.isCenter && styles.centerIconWrap,
                      isFocused && !tab.isCenter && styles.iconActive,
                    ]}
                  >
                    <Icon
                      size={tab.isCenter ? 26 : 22}
                      color={isFocused ? Colors.primary : '#6B7280'}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName="dashboard"
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="agenda" />
      <Tabs.Screen name="listings" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
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
  tabBarRow: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '19%',
  },
  centerTabItem: {
    width: '24%',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: 'rgba(14, 96, 73, 0.10)',
  },
  centerIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginTop: -16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(14, 96, 73, 0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
});
