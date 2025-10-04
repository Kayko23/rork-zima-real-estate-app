import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, SectionList, StyleSheet, Platform, SectionListData } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import Colors from '@/constants/colors';
import { mockProperties, mockProviders } from '@/constants/data';
import NotificationBell from '@/components/ui/NotificationBell';
import { useApp } from '@/hooks/useAppStore';
import { FavoritePropertyCard } from '@/components/favorites/FavoritePropertyCard';
import { FavoriteProCard } from '@/components/favorites/FavoriteProCard';
import VoyageCard from '@/components/voyages/VoyageCard';
import type { TripItem } from '@/components/voyages/helpers';

type SortType = 'recent' | 'rating' | 'priceAsc' | 'priceDesc';
type SectionKey = 'properties' | 'providers' | 'voyages';

const mockVoyages: TripItem[] = [
  {
    id: 'v1',
    title: 'Suite Luxe Vue Mer',
    city: 'Dakar',
    country: 'Sénégal',
    price: 85000,
    currency: 'XOF',
    rating: 4.8,
    reviews: 156,
    image: { uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' },
    type: 'hotel',
    badge: 'Premium',
  },
  {
    id: 'v2',
    title: 'Villa Moderne Piscine',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    price: 65000,
    currency: 'XOF',
    rating: 4.6,
    reviews: 89,
    image: { uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
    type: 'daily',
  },
  {
    id: 'v3',
    title: 'Appartement Centre Ville',
    city: 'Accra',
    country: 'Ghana',
    price: 120,
    currency: 'USD',
    rating: 4.7,
    reviews: 203,
    image: { uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
    type: 'daily',
    badge: 'Top',
  },
];

const shadowMicro = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  android: { elevation: 2 },
  default: {},
});


export default function FavoritesScreen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { hasUnreadNotifications } = useApp();

  const [sort] = useState<SortType>('recent');
  const [collapsedSections, setCollapsedSections] = useState<Set<SectionKey>>(new Set());

  const { favoritePropertyIds, favoriteProviderIds, favoriteVoyageIds } = useApp();

  const premiumFirst = <T extends { isPremium?: boolean }>(a: T, b: T) => {
    if (!!a.isPremium === !!b.isPremium) return 0;
    return a.isPremium ? -1 : 1;
  };
  
  const favoriteProperties = useMemo(() => {
    const base = mockProperties.filter((p) => favoritePropertyIds.has(p.id));
    const sorted = [...base].sort((a, b) => {
      const pf = premiumFirst(a, b);
      if (pf !== 0) return pf;
      if (sort === 'priceAsc') return a.price - b.price;
      if (sort === 'priceDesc') return b.price - a.price;
      if (sort === 'rating') return (b.provider?.rating ?? 0) - (a.provider?.rating ?? 0);
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
    return sorted;
  }, [sort, favoritePropertyIds]);

  const favoriteProviders = useMemo(() => {
    const base = mockProviders.filter((p) => favoriteProviderIds.has(p.id));
    const sorted = [...base].sort((a, b) => {
      const pf = premiumFirst(a, b);
      if (pf !== 0) return pf;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });
    return sorted;
  }, [sort, favoriteProviderIds]);

  const favoriteVoyages = useMemo(() => {
    const base = mockVoyages.filter((t: TripItem) => favoriteVoyageIds.has(t.id));
    const sorted = [...base].sort((a: TripItem, b: TripItem) => {
      if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === 'priceAsc') return a.price - b.price;
      if (sort === 'priceDesc') return b.price - a.price;
      return 0;
    });
    return sorted;
  }, [sort, favoriteVoyageIds]);

  const toggleSection = useCallback((key: SectionKey) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  type FavoriteSection = SectionListData<any, {
    key: SectionKey;
    title: string;
    collapsed: boolean;
  }>;

  const sections = useMemo((): FavoriteSection[] => {
    const result: FavoriteSection[] = [];
    
    if (favoriteProperties.length > 0) {
      result.push({
        key: 'properties' as SectionKey,
        title: `Biens (${favoriteProperties.length})`,
        data: collapsedSections.has('properties') ? [] : favoriteProperties,
        collapsed: collapsedSections.has('properties'),
      });
    }
    
    if (favoriteProviders.length > 0) {
      result.push({
        key: 'providers' as SectionKey,
        title: `Professionnels (${favoriteProviders.length})`,
        data: collapsedSections.has('providers') ? [] : favoriteProviders,
        collapsed: collapsedSections.has('providers'),
      });
    }
    
    if (favoriteVoyages.length > 0) {
      result.push({
        key: 'voyages' as SectionKey,
        title: `Voyages (${favoriteVoyages.length})`,
        data: collapsedSections.has('voyages') ? [] : favoriteVoyages,
        collapsed: collapsedSections.has('voyages'),
      });
    }
    
    return result;
  }, [favoriteProperties, favoriteProviders, favoriteVoyages, collapsedSections]);

  const totalFavorites = favoriteProperties.length + favoriteProviders.length + favoriteVoyages.length;

  const handlePropertyPress = useCallback((id: string) => {
    console.log('[Favorites] Open property', id);
    router.push({ pathname: '/property/[id]', params: { id } });
  }, [router]);

  const handleViewProfile = useCallback((id: string) => {
    console.log('[Favorites] Open pro profile', id);
    router.push({ pathname: '/professional/[id]', params: { id } });
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

  const renderSectionHeader = useCallback(({ section }: any) => {
    const isCollapsed = section.collapsed;
    return (
      <Pressable
        style={styles.sectionHeader}
        onPress={() => toggleSection(section.key)}
        accessibilityRole="button"
        accessibilityLabel={isCollapsed ? `Développer ${section.title}` : `Réduire ${section.title}`}
      >
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {isCollapsed ? (
          <ChevronDown size={20} color={Colors.text.primary} />
        ) : (
          <ChevronUp size={20} color={Colors.text.primary} />
        )}
      </Pressable>
    );
  }, [toggleSection]);

  const renderItem = useCallback(({ item, section }: any) => {
    if (section.key === 'properties') {
      return (
        <View style={styles.itemWrapper}>
          <FavoritePropertyCard
            item={item}
            layout="list"
            onPress={() => handlePropertyPress(item.id)}
          />
        </View>
      );
    }
    
    if (section.key === 'providers') {
      return (
        <View style={styles.itemWrapper}>
          <FavoriteProCard
            pro={item}
            onViewProfile={() => handleViewProfile(item.id)}
            onCall={() => handleCall(item.phone)}
            onWhatsApp={() => handleWhatsApp(item.whatsapp ?? item.phone)}
            onEmail={() => handleEmail(item.email)}
          />
        </View>
      );
    }
    
    if (section.key === 'voyages') {
      return (
        <View style={styles.itemWrapper}>
          <VoyageCard item={item} />
        </View>
      );
    }
    
    return null;
  }, [handlePropertyPress, handleViewProfile, handleCall, handleWhatsApp, handleEmail]);

  return (
    <View style={[styles.screen, { paddingTop: top + 8 }]} testID="favorites-screen">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title} testID="favorites-title">Favoris</Text>
          <Text style={styles.subtitle}>{totalFavorites} élément{totalFavorites > 1 ? 's' : ''}</Text>
        </View>
        <NotificationBell hasUnread={hasUnreadNotifications} onPress={() => {
          console.log('[Favorites] Opening notifications');
          router.push('/notifications');
        }} />
      </View>

      {totalFavorites === 0 ? (
        <Empty 
          title="Aucun favori" 
          subtitle="Ajoutez des biens, professionnels ou voyages à vos favoris pour les retrouver ici" 
        />
      ) : (
        <SectionList
          testID="favorites-section-list"
          sections={sections}
          keyExtractor={(item: any, index) => `${item.id}-${index}`}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
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



const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background.secondary },
  headerRow: { paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: 0.5, color: Colors.text.primary },
  subtitle: { fontSize: 14, color: Colors.text.secondary, marginTop: 4, fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingBottom: 120 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 8,
    ...(shadowMicro as object),
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: 0.3,
  },
  itemWrapper: {
    marginBottom: 12,
  },
  emptyWrap: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24, flex: 1, justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text.primary },
  emptySub: { marginTop: 6, fontSize: 14, color: Colors.text.secondary, textAlign: 'center', lineHeight: 20 },
});