import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useContentInsets } from '@/hooks/useContentInsets';
import { useSearchPreset } from '@/hooks/useSearchPreset';
import { X } from 'lucide-react-native';
import { CATEGORIES, CategorySlug } from '@/types/taxonomy';
import { openCategory } from '@/lib/navigation';
import { useQuery } from '@tanstack/react-query';
import UnifiedFilterSheet, { TripFilters } from '@/components/filters/UnifiedFilterSheet';
import { buildTripQuery } from '@/utils/filters';
import { api } from '@/lib/api';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import ZimaBrand from '@/components/ui/ZimaBrand';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import VoyageCard from '@/components/voyages/VoyageCard';
import { useSettings } from '@/hooks/useSettings';

const INITIAL: TripFilters = {
  destination: { country: undefined, city: undefined },
  checkIn: null,
  checkOut: null,
  guests: 1,
  budget: { min: 10000, max: 105000 },
  ratingMin: 0,
  amenities: [],
  sort: 'recent',
};

export default function VoyagesTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { bottom: bottomInset } = useContentInsets();
  const { preset, reset: resetPreset } = useSearchPreset();
  const { country: activeCountry, allowAllCountries } = useSettings();
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<TripFilters>(INITIAL);

  useEffect(() => {
    const cat = params.category as CategorySlug;
    if (cat && CATEGORIES[cat]?.domain !== 'travel') {
      openCategory(cat, {}, 'replace');
    }
  }, [params.category]);

  useEffect(() => {
    if (preset?.domain === 'travel' && preset.premium) {
      const newFilters: TripFilters = { ...INITIAL };
      setFilters(newFilters);
    }
  }, [preset]);

  useEffect(() => {
    if (!allowAllCountries && activeCountry?.name_fr) {
      setFilters(prev => ({ ...prev, destination: { country: prev.destination?.country ?? activeCountry.name_fr, city: prev.destination?.city } }));
    }
  }, [allowAllCountries, activeCountry?.name_fr]);

  const { data = [], isLoading } = useQuery({
    queryKey: ['trips', filters],
    queryFn: () => api.listProperties({
      category: 'travel',
      ...buildTripQuery(filters),
    }),
  });

  const resultCount = data.length;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.stickyHeader, { paddingTop: insets.top + 8 }]}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingBottom:8 }}>
          <Pressable onPress={() => router.push('/(tabs)/home')}>
            <ZimaBrand />
          </Pressable>
          <HeaderCountryButton />
        </View>
        
        <View style={{ paddingHorizontal:16, paddingBottom:8 }}>
          <SegmentedTabs 
            value="trips" 
            onChange={(k)=>{
              if (k==='props') router.push('/(tabs)/properties');
              else if (k==='vehicles') router.push('/(tabs)/vehicles');
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
              {(filters.destination?.country) ?? 'Pays'}, {(filters.destination?.city) ?? 'Ville'} • {filters.guests} voyageur(s)
            </Text>
            <Text style={styles.searchSub}>
              Budget: {fmt(filters.budget?.min ?? 0)} – {fmt(filters.budget?.max ?? 0)} • {filters.ratingMin ? `${filters.ratingMin}+ ★` : 'Toutes notes'}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={data as any[]}
        keyExtractor={(i: any) => String(i.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomInset + 120, paddingTop: 8, gap: 12 }}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#0B6B53" style={{ marginTop: 32 }} />
          ) : (
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={styles.empty}>Aucun résultat.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <VoyageCard item={{
              id: item.id,
              title: item.title ?? 'Séjour',
              city: item.city ?? 'Ville',
              country: item.country ?? 'Pays',
              price: item.price ?? 0,
              currency: item.currency ?? 'XOF',
              rating: item.rating ?? 4.5,
              reviews: item.reviews ?? 0,
              image: { uri: item.photos?.[0] ?? item.image ?? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
              badge: item.premium ? 'Premium' : undefined,
              type: item.type ?? 'hotel'
            }} />
          </View>
        )}
        scrollIndicatorInsets={{ bottom: bottomInset }}
      />

      <UnifiedFilterSheet
        kind="trip"
        open={open}
        initial={filters}
        onClose={() => setOpen(false)}
        onReset={() => setFilters(INITIAL)}
        onApply={(f) => { setFilters(f); setOpen(false); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  stickyHeader: { backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 6 },
  controls: { paddingHorizontal: 16, paddingBottom: 12 },
  searchStub: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 14, justifyContent: 'center' },
  searchTitle: { fontWeight: '700' },
  searchSub: { color: '#6B7280', marginTop: 2 },
  empty: { color: '#64748B', padding: 16 },

});

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);
