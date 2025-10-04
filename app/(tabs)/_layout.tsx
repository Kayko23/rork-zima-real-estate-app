import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, Pressable, Text } from 'react-native';
import { Home as HomeIcon, Heart, Building2, MessageCircle, User } from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, TABBAR_HEIGHT, TABBAR_RADIUS } from '@/theme/tokens';

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
          tabBarIcon: ({ color, size }) => <Building2 color={color} size={size} />,
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
    </Tabs>
  );
}

const ICONS: Record<string, { label: string }> = {
  home: { label: 'Accueil' },
  favorites: { label: 'Favoris' },
  properties: { label: 'Biens' },

  messages: { label: 'Messages' },
  profile: { label: 'Profil' },
};

function GlassTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);
  const barH = TABBAR_HEIGHT + bottomPad;

  return (
    <View style={{ height: barH, backgroundColor: 'transparent' }}>
      <View style={[styles.wrap, { paddingBottom: bottomPad }]}>
        {Platform.OS === 'web' ? (
          <View style={[styles.glass, { backgroundColor: colors.glassBg }]}>
            <View style={styles.row}>
              {state.routes.map((route: any, index: number) => {
                const isFocused = state.index === index;
                const onPress = () => {
                  const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                };
                const Icon = descriptors[route.key].options.tabBarIcon;
                const meta = ICONS[route.name] ?? { label: route.name };
                const isCenter = route.name === 'properties';

                return (
                  <Pressable
                    key={route.key}
                    onPress={onPress}
                    style={[styles.item, isCenter && styles.centerItem]}
                    testID={`tab-${route.name}`}
                  >
                    <View style={[styles.iconWrap, isCenter && styles.centerIconWrap, isFocused && styles.iconActive]}>
                      {Icon ? <Icon focused={isFocused} color={isFocused ? colors.tabActive : colors.tabInactive} size={isCenter ? 26 : 22} /> : null}
                    </View>
                    {!isCenter && (
                      <Text style={[styles.label, { color: isFocused ? colors.tabActive : colors.tabInactive }]}>
                        {meta.label}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : (
          <BlurView intensity={30} tint="light" style={styles.glass}>
            <View style={styles.row}>
              {state.routes.map((route: any, index: number) => {
                const isFocused = state.index === index;
                const onPress = () => {
                  const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                };
                const Icon = descriptors[route.key].options.tabBarIcon;
                const meta = ICONS[route.name] ?? { label: route.name };
                const isCenter = route.name === 'properties';

                return (
                  <Pressable
                    key={route.key}
                    onPress={onPress}
                    style={[styles.item, isCenter && styles.centerItem]}
                    testID={`tab-${route.name}`}
                  >
                    <View style={[styles.iconWrap, isCenter && styles.centerIconWrap, isFocused && styles.iconActive]}>
                      {Icon ? <Icon focused={isFocused} color={isFocused ? colors.tabActive : colors.tabInactive} size={isCenter ? 26 : 22} /> : null}
                    </View>
                    {!isCenter && (
                      <Text style={[styles.label, { color: isFocused ? colors.tabActive : colors.tabInactive }]}>
                        {meta.label}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </BlurView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12, bottom: 0 },
  glass: {
    height: TABBAR_HEIGHT,
    borderRadius: TABBAR_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...Platform.select({
      android: { backgroundColor: 'rgba(255,255,255,0.80)' },
    }),
  },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 },
  item: { alignItems: 'center', justifyContent: 'center', gap: 2, width: '15%' },
  label: { fontSize: 11, fontWeight: '700' },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  iconActive: { backgroundColor: 'rgba(14,96,73,0.10)' },
  centerItem: { width: '20%' },
  centerIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginTop: -16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: colors.shadow,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
});