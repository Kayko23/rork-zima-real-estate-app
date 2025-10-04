import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useContentInsets } from '@/hooks/useContentInsets';
import { useSearchPreset } from '@/hooks/useSearchPreset';
import { X } from 'lucide-react-native';
import { CATEGORIES, CategorySlug } from '@/types/taxonomy';
import { openCategory } from '@/lib/navigation';
import { useQuery } from '@tanstack/react-query';
import TravelFiltersSheet, { TravelFilters } from '@/components/travel/TravelFiltersSheet';
import { api } from '@/lib/api';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import ZimaBrand from '@/components/ui/ZimaBrand';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import { useSettings } from '@/hooks/useSettings';

const INITIAL: TravelFilters = {
  country: undefined,
  city: undefined,
  checkIn: null,
  checkOut: null,
  guests: 1,
  priceMin: 10000,
  priceMax: 105000,
  ratingMin: undefined,
  amenities: [],
};

export default function TripScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { bottom: bottomInset } = useContentInsets();
  const { preset, reset: resetPreset } = useSearchPreset();
  const { country: activeCountry, allowAllCountries } = useSettings();
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<TravelFilters>(INITIAL);

  useEffect(() => {
    const cat = params.category as CategorySlug;
    if (cat && CATEGORIES[cat]?.domain !== 'travel') {
      openCategory(cat, {}, 'replace');
    }
  }, [params.category]);

  useEffect(() => {
    if (preset?.domain === 'travel' && preset.premium) {
      const newFilters: TravelFilters = { ...INITIAL };
      setFilters(newFilters);
    }
  }, [preset]);

  useEffect(() => {
    if (!allowAllCountries && activeCountry?.name_fr) {
      setFilters(prev => ({ ...prev, country: prev.country ?? activeCountry.name_fr }));
    }
  }, [allowAllCountries, activeCountry?.name_fr]);

  const { data = [], isLoading } = useQuery({
    queryKey: ['trips', filters],
    queryFn: () =>
      api.listProperties({
        category: 'travel',
        country: filters.country,
        city: filters.city,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        ratingMin: filters.ratingMin,
        guests: filters.guests,
      }),
  });

  const resultCount = data.length;

  return (
    <View style={styles.container}>
      <View style={[styles.stickyHeader, { paddingTop: insets.top, position: 'relative', zIndex: 10 }]}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16 }}>
          <ZimaBrand />
          <HeaderCountryButton />
        </View>
        
        <View style={{ paddingHorizontal:16, paddingTop:16, paddingBottom:12 }}>
          <SegmentedTabs 
            value="trips" 
            onChange={(k)=>{
              if (k==='props') router.push('/(tabs)/properties');
              else if (k==='vehicles') router.push('/vehicles');
            }} 
          />
        </View>

        <View style={styles.controls}>

          {preset?.domain === 'travel' && (
            <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:12 }}>
              {preset.premium && (
                <View style={{ backgroundColor:'#0B6B53', paddingHorizontal:12, paddingVertical:6, borderRadius:999, flexDirection:'row', alignItems:'center', gap:6 }}>
                  <Text style={{ color:'#fff', fontWeight:'700', fontSize:12 }}>Premium</Text>
                </View>
              )}
              <Pressable onPress={resetPreset} style={{ backgroundColor:'#F3F4F6', paddingHorizontal:12, paddingVertical:6, borderRadius:999, flexDirection:'row', alignItems:'center', gap:4 }}>
                <X size={14} color="#6B7280" strokeWidth={2.5} />
                <Text style={{ color:'#6B7280', fontWeight:'700', fontSize:12 }}>Réinitialiser</Text>
              </Pressable>
            </View>
          )}
          <Pressable testID="openFilters" onPress={() => setOpen(true)} style={styles.searchStub}>
            <Text style={styles.searchTitle}>
              {filters.country ?? 'Pays'}, {filters.city ?? 'Ville'} • {filters.guests} voyageur(s)
            </Text>
            <Text style={styles.searchSub}>
              Budget: {fmt(filters.priceMin)} – {fmt(filters.priceMax)} •{' '}
              {filters.ratingMin ? `${filters.ratingMin}+ ★` : 'Toutes notes'}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={data as any[]}
        keyExtractor={(i: any) => String(i.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomInset, paddingTop: 8 }}
        ListEmptyComponent={!isLoading ? (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.empty}>Aucun résultat.</Text>
          </View>
        ) : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>{item.title ?? 'Séjour'}</Text>
              <Text style={styles.cardMeta}>{item.city}, {item.country}</Text>
              <Text style={styles.cardPrice}>{fmt(item.price)} / nuit</Text>
            </View>
          </View>
        )}
        scrollIndicatorInsets={{ bottom: bottomInset }}
      />

      <TravelFiltersSheet
        visible={open}
        initial={filters}
        resultCount={resultCount}
        onClose={() => setOpen(false)}
        onReset={() => setFilters(INITIAL)}
        onApply={(f) => { setFilters(f); setOpen(false); }}
        presetKey="zima/travel/lastFilters"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  stickyHeader: { backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  header: { height: 56, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  controls: { padding: 16, gap: 10 },
  searchStub: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 14, justifyContent: 'center' },
  searchTitle: { fontWeight: '700' },
  searchSub: { color: '#6B7280', marginTop: 2 },
  empty: { color: '#64748B', padding: 16 },
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, overflow: 'hidden', marginBottom: 12, backgroundColor: '#fff' },
  cardInner: { padding: 14 },
  cardTitle: { fontWeight: '800' },
  cardMeta: { color: '#6B7280', marginTop: 2 },
  cardPrice: { marginTop: 8, fontWeight: '700' },
});

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);
