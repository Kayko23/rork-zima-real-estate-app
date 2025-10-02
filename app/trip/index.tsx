import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useContentInsets } from '@/hooks/useContentInsets';
import { useQuery } from '@tanstack/react-query';
import TravelFiltersSheet, { TravelFilters } from '@/components/travel/TravelFiltersSheet';
import { api } from '@/lib/api';
import SegmentedTabs from '@/components/home/SegmentedTabs';

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
  const { bottom: bottomInset } = useContentInsets();
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<TravelFilters>(INITIAL);

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voyages</Text>
      </View>

      <View style={{ paddingHorizontal:16, paddingTop:16, paddingBottom:12, backgroundColor:'#fff' }}>
        <SegmentedTabs 
          value="trips" 
          onChange={(k)=>{
            if (k==='props') router.push('/properties');
            else if (k==='pros') router.push('/professionals');
          }} 
        />
      </View>

      <View style={styles.controls}>
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

      <FlatList
        data={data as any[]}
        keyExtractor={(i: any) => String(i.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomInset }}
        ListEmptyComponent={!isLoading ? <Text style={styles.empty}>Aucun résultat.</Text> : null}
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
