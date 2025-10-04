import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, Pressable } from 'react-native';
import { Home as HomeIcon, Heart, Building2, MessageCircle, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/colors';
import { useApp } from '@/hooks/useAppStore';

export default function TabsLayout() {
  const { userMode } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (userMode === 'provider') {
      router.replace('/(proTabs)/dashboard');
    }
  }, [userMode, router]);

  if (userMode === 'provider') return null;

  const CustomTabBar = (props: any) => {
    const { state, navigation } = props;
    const bottomPad = Math.max(insets.bottom, 10);
    const barHeight = 66 + bottomPad;

    type TabDef = { name: string; icon: typeof HomeIcon; label: string; isCenter?: boolean };
    const tabs: TabDef[] = [
      { name: 'home', icon: HomeIcon, label: 'Accueil' },
      { name: 'favorites', icon: Heart, label: 'Favoris' },
      { name: 'properties', icon: Building2, label: 'Biens', isCenter: true },
      { name: 'messages', icon: MessageCircle, label: 'Messages' },
      { name: 'profile', icon: User, label: 'Profil' },
    ];

    console.log('[UserTabBar] render', { index: state.index, routes: state.routes.map((r: any) => r.name) });

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
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
              };

              return (
                <Pressable
                  key={tab.name}
                  onPress={onPress}
                  style={[styles.tabItem, tab.isCenter && styles.centerTabItem]}
                  testID={`tab-${tab.name}`}
                  accessibilityRole="button"
                >
                  <View
                    style={[
                      styles.iconWrap,
                      tab.isCenter && styles.centerIconWrap,
                      isFocused && !tab.isCenter && styles.iconActive,
                    ]}
                  >
                    <Icon size={tab.isCenter ? 26 : 22} color={isFocused ? Colors.primary : '#6B7280'} />
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
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="properties" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="voyages" options={{ href: null }} />
      <Tabs.Screen name="vehicles" options={{ href: null }} />
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