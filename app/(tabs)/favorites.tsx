import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import Colors from '@/constants/colors';
import { mockProperties, mockProviders } from '@/constants/data';
import { Property, Provider } from '@/types';
import NotificationBell from '@/components/ui/NotificationBell';
import { useApp } from '@/hooks/useAppStore';
import { FavoritePropertyCard } from '@/components/favorites/FavoritePropertyCard';
import { FavoriteProCard } from '@/components/favorites/FavoriteProCard';

type TabType = 'properties' | 'providers';
type ViewType = 'grid' | 'list';
type SortType = 'recent' | 'rating' | 'priceAsc' | 'priceDesc';

const shadowMicro = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  android: { elevation: 2 },
  default: {},
});
const shadowSoft = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 4 },
  default: {},
});

export default function FavoritesScreen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { hasUnreadNotifications, markNotificationsAsRead } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('properties');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [sort, setSort] = useState<SortType>('recent');

  const favoriteProperties = useMemo(() => {
    const arr = mockProperties.filter((p) => p.isFavorite);
    if (sort === 'priceAsc') return [...arr].sort((a, b) => a.price - b.price);
    if (sort === 'priceDesc') return [...arr].sort((a, b) => b.price - a.price);
    if (sort === 'rating') return [...arr].sort((a, b) => (b.provider?.rating ?? 0) - (a.provider?.rating ?? 0));
    return arr;
  }, [sort]);

  const favoriteProviders = useMemo(() => {
    const arr = mockProviders.slice(0, 8);
    if (sort === 'rating') return [...arr].sort((a, b) => b.rating - a.rating);
    return arr;
  }, [sort]);

  const onCycleSort = useCallback(() => {
    const order: SortType[] = ['recent', 'rating', 'priceAsc', 'priceDesc'];
    const i = order.indexOf(sort);
    setSort(order[(i + 1) % order.length]);
  }, [sort]);

  const sortLabel = useMemo(() => {
    return sort === 'recent' ? 'Plus récents' : sort === 'rating' ? 'Mieux notés' : sort === 'priceAsc' ? 'Prix ↑' : 'Prix ↓';
  }, [sort]);

  const handlePropertyPress = useCallback((id: string) => {
    console.log('[Favorites] Open property', id);
    router.push({ pathname: '/property/[id]', params: { id } });
  }, [router]);

  const handleViewProfile = useCallback((id: string) => {
    console.log('[Favorites] Open pro profile', id);
    router.push({ pathname: '/(tabs)/professionnels/profile/[id]', params: { id } });
  }, [router]);

  const handleCall = useCallback((phone?: string) => {
    if (!phone) return;
    const url = `tel:${phone}`;
    console.log('[Favorites] Call', url);
    Linking.openURL(url).catch((e) => console.warn('Call failed', e));
  }, []);

  const handleWhatsApp = useCallback((phone?: string) => {
    if (!phone) return;
    const sanitized = phone.replace(/\+/g, '');
    const url = `https://wa.me/${sanitized}`;
    console.log('[Favorites] WhatsApp', url);
    Linking.openURL(url).catch((e) => console.warn('WhatsApp failed', e));
  }, []);

  const handleEmail = useCallback((email?: string) => {
    if (!email) return;
    const url = `mailto:${email}`;
    console.log('[Favorites] Email', url);
    Linking.openURL(url).catch((e) => console.warn('Email failed', e));
  }, []);

  return (
    <View style={[styles.screen, { paddingTop: top + 8 }]} testID="favorites-screen">
      <View style={styles.headerRow}>
        <Text style={styles.title} testID="favorites-title">Favoris</Text>
        <NotificationBell hasUnread={hasUnreadNotifications} onPress={markNotificationsAsRead} />
      </View>

      <BlurView intensity={30} tint="light" style={styles.tabsWrap}>
        <View style={styles.tabsRow}>
          <TabBtn active={activeTab === 'properties'} label={`Annonces (${favoriteProperties.length})`} onPress={() => setActiveTab('properties')} />
          <TabBtn active={activeTab === 'providers'} label={`Pros (${favoriteProviders.length})`} onPress={() => setActiveTab('providers')} />
        </View>
      </BlurView>

      <View style={styles.toolsRow}>
        <View style={styles.leftTools}>
          <IconPill active={viewType === 'grid'} onPress={() => setViewType('grid')}>
            <Grid3X3 size={18} color={viewType === 'grid' ? Colors.primary : Colors.text.secondary} />
          </IconPill>
          <IconPill active={viewType === 'list'} onPress={() => setViewType('list')}>
            <List size={18} color={viewType === 'list' ? Colors.primary : Colors.text.secondary} />
          </IconPill>
        </View>
        <Pressable style={styles.sortBtn} onPress={onCycleSort} accessibilityRole="button" testID="favorites-sort">
          <SlidersHorizontal size={18} color={Colors.text.primary} />
          <Text style={styles.sortTxt}>{sortLabel}</Text>
        </Pressable>
      </View>

      {activeTab === 'properties' ? (
        <FlatList
          testID="favorites-list-properties"
          data={favoriteProperties}
          key={viewType}
          numColumns={viewType === 'grid' ? 2 : 1}
          columnWrapperStyle={viewType === 'grid' ? { gap: 12 } : undefined}
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 12 }}
          keyExtractor={(item: Property) => item.id}
          renderItem={({ item }) => (
            <FavoritePropertyCard
              item={item}
              layout={viewType}
              onPress={() => handlePropertyPress(item.id)}
            />
          )}
          ListEmptyComponent={<Empty title="Aucun favori" subtitle="Ajoutez des propriétés à vos favoris pour les retrouver ici" />}
        />
      ) : (
        <FlatList
          testID="favorites-list-pros"
          data={favoriteProviders}
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 12 }}
          keyExtractor={(item: Provider) => item.id}
          renderItem={({ item }) => (
            <FavoriteProCard
              pro={item}
              onViewProfile={() => handleViewProfile(item.id)}
              onCall={() => handleCall(item.phone)}
              onWhatsApp={() => handleWhatsApp(item.whatsapp ?? item.phone)}
              onEmail={() => handleEmail(item.email)}
            />
          )}
          ListEmptyComponent={<Empty title="Aucun professionnel favori" subtitle="Ajoutez des professionnels à vos favoris pour les retrouver ici" />}
        />
      )}
    </View>
  );
}

function Empty({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySub}>{subtitle}</Text>
    </View>
  );
}

function TabBtn({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]} accessibilityRole="button">
      <Text style={[styles.tabTxt, active && styles.tabTxtActive]}>{label}</Text>
      {active ? <View style={styles.tabUnderline} /> : null}
    </Pressable>
  );
}

function IconPill({ active, onPress, children }: { active?: boolean; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} style={[styles.iconPill, active ? styles.iconPillActive : null]} accessibilityRole="button">
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background.secondary },
  headerRow: { paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: 0.5, color: Colors.text.primary },
  tabsWrap: { marginHorizontal: 16, borderRadius: 24, overflow: 'hidden', ...(shadowSoft as object) },
  tabsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.7)' },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  tabBtnActive: {},
  tabTxt: { fontSize: 15, color: Colors.text.secondary, fontWeight: '600' },
  tabTxtActive: { color: Colors.text.primary },
  tabUnderline: { height: 3, width: 36, borderRadius: 2, backgroundColor: Colors.primary, marginTop: 8 },
  toolsRow: { marginTop: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftTools: { flexDirection: 'row', gap: 8 },
  iconPill: { height: 36, width: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...(shadowMicro as object) },
  iconPillActive: { backgroundColor: '#F0F7F5' },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', paddingHorizontal: 14, height: 36, borderRadius: 18, ...(shadowMicro as object) },
  sortTxt: { fontSize: 14, fontWeight: '700', color: Colors.text.primary },
  emptyWrap: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text.primary },
  emptySub: { marginTop: 6, fontSize: 14, color: Colors.text.secondary, textAlign: 'center', lineHeight: 20 },
});