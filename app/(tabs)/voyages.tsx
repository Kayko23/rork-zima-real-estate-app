import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useContentInsets } from '@/hooks/useContentInsets';
import { useSearchPreset } from '@/hooks/useSearchPreset';
import { X } from 'lucide-react-native';
import { CATEGORIES, CategorySlug } from '@/types/taxonomy';
import { openCategory } from '@/lib/navigation';
import UnifiedFilterSheet, { TripFilters } from '@/components/filters/UnifiedFilterSheet';

import SegmentedTabs from '@/components/home/SegmentedTabs';
import ZimaBrand from '@/components/ui/ZimaBrand';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import { useSettings } from '@/hooks/useSettings';
import { useMoney } from '@/lib/money';
import CategoryRail from '@/components/home/CategoryRail';
import TravelCard, { TravelItem } from '@/components/cards/TravelCard';

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

  const { format } = useMoney();

  const transformTrip = (item: any): TravelItem => ({
    id: item.id,
    title: item.title ?? 'Séjour',
    city: item.city ?? 'Ville',
    priceLabel: format(item.price ?? 0, item.currency ?? 'XOF'),
    cover: item.photos?.[0] ?? item.image ?? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    badges: [],
    rating: item.rating,
    isPremium: item.isPremium ?? item.premium ?? false
  });

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

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomInset + 120, paddingTop: 8 }}
        scrollIndicatorInsets={{ bottom: bottomInset }}
      >
        <CategoryRail
          title="Hôtels"
          queryKey={['trips-hotels', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const trips = [
              { id: 't1', title: 'Hôtel Ivoire', city: 'Abidjan', countryCode: 'CI', price: 85000, currency: 'XOF', isPremium: true, type: 'hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=600&fit=crop', rating: 4.8 },
              { id: 't2', title: 'Radisson Blu', city: 'Dakar', countryCode: 'SN', price: 120000, currency: 'XOF', isPremium: true, type: 'hotel', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&h=600&fit=crop', rating: 4.7 },
              { id: 't3', title: 'Pullman Douala', city: 'Douala', countryCode: 'CM', price: 95000, currency: 'XAF', isPremium: false, type: 'hotel', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&h=600&fit=crop', rating: 4.6 },
            ];
            const filtered = trips.filter(t => !activeCountry?.code || t.countryCode === activeCountry.code);
            return filtered.slice(0, 10).map(transformTrip);
          }}
          renderItem={(item) => <TravelCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/voyages/all', params: { type: 'hotel' } } as any)}
        />

        <CategoryRail
          title="Résidences journalières"
          queryKey={['trips-residences', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const trips = [
              { id: 'r1', title: 'Résidence Cocody', city: 'Abidjan', countryCode: 'CI', price: 45000, currency: 'XOF', isPremium: false, type: 'residence', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=600&fit=crop', rating: 4.5 },
              { id: 'r2', title: 'Appartement Almadies', city: 'Dakar', countryCode: 'SN', price: 55000, currency: 'XOF', isPremium: true, type: 'residence', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=600&fit=crop', rating: 4.7 },
              { id: 'r3', title: 'Studio Bonapriso', city: 'Douala', countryCode: 'CM', price: 38000, currency: 'XAF', isPremium: false, type: 'residence', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=600&fit=crop', rating: 4.3 },
            ];
            const filtered = trips.filter(t => !activeCountry?.code || t.countryCode === activeCountry.code);
            return filtered.slice(0, 10).map(transformTrip);
          }}
          renderItem={(item) => <TravelCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/voyages/all', params: { type: 'residence' } } as any)}
        />

        <CategoryRail
          title="Villas de vacances"
          queryKey={['trips-villas', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const trips = [
              { id: 'v1', title: 'Villa Assinie', city: 'Assinie', countryCode: 'CI', price: 150000, currency: 'XOF', isPremium: true, type: 'villa', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=600&fit=crop', rating: 4.9 },
              { id: 'v2', title: 'Villa Saly', city: 'Saly', countryCode: 'SN', price: 180000, currency: 'XOF', isPremium: true, type: 'villa', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop', rating: 4.8 },
              { id: 'v3', title: 'Villa Kribi', city: 'Kribi', countryCode: 'CM', price: 165000, currency: 'XAF', isPremium: true, type: 'villa', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop', rating: 4.7 },
            ];
            const filtered = trips.filter(t => !activeCountry?.code || t.countryCode === activeCountry.code);
            return filtered.slice(0, 10).map(transformTrip);
          }}
          renderItem={(item) => <TravelCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/voyages/all', params: { type: 'villa' } } as any)}
        />

        <CategoryRail
          title="Resorts"
          queryKey={['trips-resorts', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const trips = [
              { id: 'rs1', title: 'Resort Cap Skirring', city: 'Cap Skirring', countryCode: 'SN', price: 200000, currency: 'XOF', isPremium: true, type: 'resort', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=600&fit=crop', rating: 4.9 },
              { id: 'rs2', title: 'Resort Grand-Bassam', city: 'Grand-Bassam', countryCode: 'CI', price: 175000, currency: 'XOF', isPremium: true, type: 'resort', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&h=600&fit=crop', rating: 4.8 },
              { id: 'rs3', title: 'Resort Limbé', city: 'Limbé', countryCode: 'CM', price: 190000, currency: 'XAF', isPremium: true, type: 'resort', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&h=600&fit=crop', rating: 4.7 },
            ];
            const filtered = trips.filter(t => !activeCountry?.code || t.countryCode === activeCountry.code);
            return filtered.slice(0, 10).map(transformTrip);
          }}
          renderItem={(item) => <TravelCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/voyages/all', params: { type: 'resort' } } as any)}
        />

        <CategoryRail
          title="Lodges"
          queryKey={['trips-lodges', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const trips = [
              { id: 'l1', title: 'Lodge Parc Banco', city: 'Abidjan', countryCode: 'CI', price: 65000, currency: 'XOF', isPremium: false, type: 'lodge', image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&h=600&fit=crop', rating: 4.4 },
              { id: 'l2', title: 'Lodge Niokolo-Koba', city: 'Tambacounda', countryCode: 'SN', price: 75000, currency: 'XOF', isPremium: true, type: 'lodge', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&h=600&fit=crop', rating: 4.6 },
              { id: 'l3', title: 'Lodge Waza', city: 'Maroua', countryCode: 'CM', price: 70000, currency: 'XAF', isPremium: false, type: 'lodge', image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=900&h=600&fit=crop', rating: 4.5 },
            ];
            const filtered = trips.filter(t => !activeCountry?.code || t.countryCode === activeCountry.code);
            return filtered.slice(0, 10).map(transformTrip);
          }}
          renderItem={(item) => <TravelCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/voyages/all', params: { type: 'lodge' } } as any)}
        />

        <CategoryRail
          title="Auberges"
          queryKey={['trips-hostels', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const trips = [
              { id: 'h1', title: 'Auberge Plateau', city: 'Abidjan', countryCode: 'CI', price: 25000, currency: 'XOF', isPremium: false, type: 'hostel', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&h=600&fit=crop', rating: 4.2 },
              { id: 'h2', title: 'Auberge Gorée', city: 'Dakar', countryCode: 'SN', price: 30000, currency: 'XOF', isPremium: false, type: 'hostel', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&h=600&fit=crop', rating: 4.3 },
              { id: 'h3', title: 'Auberge Bassa', city: 'Douala', countryCode: 'CM', price: 28000, currency: 'XAF', isPremium: false, type: 'hostel', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&h=600&fit=crop', rating: 4.1 },
            ];
            const filtered = trips.filter(t => !activeCountry?.code || t.countryCode === activeCountry.code);
            return filtered.slice(0, 10).map(transformTrip);
          }}
          renderItem={(item) => <TravelCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/voyages/all', params: { type: 'hostel' } } as any)}
        />
      </ScrollView>

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
