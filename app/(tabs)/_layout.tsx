import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, Pressable } from 'react-native';
import { Home as HomeIcon, Search as SearchIcon, Plane, Briefcase, Plus } from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <GlassTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color, size }) => <SearchIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: 'Publier',
          tabBarIcon: () => null,
          href: null,
        }}
      />
      <Tabs.Screen
        name="voyages"
        options={{
          title: 'Voyages',
          tabBarIcon: ({ color, size }) => <Plane color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="professionals"
        options={{
          title: 'Pros',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

function GlassTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const activeColor = '#0F6B56';
  const idle = '#273142CC';
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {Platform.OS === 'web' ? (
        <View style={[styles.glass, { backgroundColor: '#FFFFFFCC' }]}> 
          {state.routes.map((route: any, index: number) => {
            if (route.name === 'publish') {
              return (
                <Pressable key="center" onPress={() => navigation.navigate('/property/new')} style={styles.centerBtn} testID="tab-center">
                  <Plus color="#fff" size={24} />
                </Pressable>
              );
            }
            const isFocused = state.index === index;
            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
            };
            const Icon = descriptors[route.key].options.tabBarIcon;
            return (
              <Pressable key={route.key} onPress={onPress} style={styles.item} testID={`tab-${route.name}`}>
                {Icon ? <Icon focused={isFocused} color={isFocused ? activeColor : idle} size={22} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : (
        <BlurView intensity={50} tint="light" style={styles.glass}>
          {state.routes.map((route: any, index: number) => {
            if (route.name === 'publish') {
              return (
                <Pressable key="center" onPress={() => navigation.navigate('/property/new')} style={styles.centerBtn} testID="tab-center">
                  <Plus color="#fff" size={24} />
                </Pressable>
              );
            }
            const isFocused = state.index === index;
            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
            };
            const Icon = descriptors[route.key].options.tabBarIcon;
            return (
              <Pressable key={route.key} onPress={onPress} style={styles.item} testID={`tab-${route.name}`}>
                {Icon ? <Icon focused={isFocused} color={isFocused ? activeColor : idle} size={22} /> : null}
              </Pressable>
            );
          })}
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' },
  glass: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
    borderRadius: 28,
    overflow: 'hidden',
    paddingVertical: 10,
    gap: 6,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 44 },
  centerBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0F6B56',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    transform: [{ translateY: -18 }],
    shadowColor: '#0F6B56',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});