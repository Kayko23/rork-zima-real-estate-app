import React from 'react';
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs, useRouter } from 'expo-router';
import { Home, Heart, Building2, MessageCircle, User2, BarChart3, CalendarDays, Files, Settings } from 'lucide-react-native';

type Mode = 'user' | 'pro';

type TabItem = {
  name: string;
  label: string;
  icon: (props: { size?: number; color?: string }) => React.ReactElement;
  href?: string | null;
  center?: boolean;
};

function GlassContainer({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const extraPad = Math.max(insets.bottom, 12);
  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      {Platform.OS === 'web' ? (
        <View style={[styles.glass, styles.webGlass, { paddingBottom: extraPad }]}>
          <View style={styles.row}>{children}</View>
        </View>
      ) : (
        <BlurView intensity={28} tint="light" style={[styles.glass, { paddingBottom: extraPad }]}> 
          <View style={styles.row}>{children}</View>
        </BlurView>
      )}
    </View>
  );
}

export function makeTabs(mode: Mode) {
  const items: TabItem[] =
    mode === 'user'
      ? [
          { name: 'home', label: 'Accueil', icon: (p) => <Home {...p} /> },
          { name: 'favorites', label: 'Favoris', icon: (p) => <Heart {...p} /> },
          { name: 'properties', label: 'Biens', icon: (p) => <Building2 {...p} />, center: true },
          { name: 'messages', label: 'Messages', icon: (p) => <MessageCircle {...p} /> },
          { name: 'profile', label: 'Profil', icon: (p) => <User2 {...p} /> },
          { name: 'voyages', label: '', icon: () => <View />, href: null },
          { name: 'vehicles', label: '', icon: () => <View />, href: null },
        ]
      : [
          { name: 'dashboard', label: '', icon: () => <View />, href: null },
          { name: 'dashboard', label: 'Stats', icon: (p) => <BarChart3 {...p} /> },
          { name: 'agenda', label: 'Agenda', icon: (p) => <CalendarDays {...p} /> },
          { name: 'listings', label: 'Annonces', icon: (p) => <Files {...p} />, center: true },
          { name: 'messages', label: 'Messages', icon: (p) => <MessageCircle {...p} /> },
          { name: 'profile', label: 'Réglages', icon: (p) => <Settings {...p} /> },
        ];

  function TabBar({ state, navigation }: any) {
    return (
      <GlassContainer>
        {items.slice(0, 5).map((it, idx) => {
          const isFocused = state.index === idx;
          const Icon = it.icon;
          const onPress = () => {
            navigation.navigate(it.name);
          };
          return (
            <Pressable
              key={it.name}
              onPress={onPress}
              style={[styles.item, it.center && styles.centerItem]}
              testID={`tab-${it.name}`}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconActive, it.center && styles.centerIcon]}
              >
                <Icon size={it.center ? 26 : 22} color={isFocused ? '#0C5B46' : '#6E7A73'} />
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
                {it.label}
              </Text>
            </Pressable>
          );
        })}
      </GlassContainer>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} tabBar={(props) => <TabBar {...props} />}>
      {items.map((it, i) => (
        <Tabs.Screen key={i} name={it.name} options={{ href: it.href as any }} />
      ))}
    </Tabs>
  );
}

const HEIGHT = 72;

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 12, right: 12, bottom: 12 },
  glass: {
    height: HEIGHT,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(12,91,70,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.75)' : 'transparent',
  },
  webGlass: {
    // RN Web fallback for blur
    backdropFilter: 'blur(22px)' as unknown as undefined,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  item: { alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 56 },
  iconWrap: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(12,91,70,0.06)' },
  iconActive: { backgroundColor: 'rgba(12,91,70,0.14)' },
  label: { fontSize: 12, color: '#6E7A73' },
  labelActive: { color: '#0C5B46', fontWeight: '600' },
  centerItem: { transform: [{ translateY: -10 }] },
  centerIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: 'rgba(12,91,70,0.18)' },
});
