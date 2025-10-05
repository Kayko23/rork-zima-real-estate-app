import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useSettings } from '@/hooks/useSettings';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import CompanyLogoRow from '@/components/vehicles/CompanyLogoRow';
import UnifiedFilterSheet, { VehicleFilters } from '@/components/filters/UnifiedFilterSheet';
import CategoryRail from '@/components/home/CategoryRail';
import VehicleCard from '@/components/cards/VehicleCard';
import DriverCard from '@/components/cards/DriverCard';
import type { VehicleItem } from '@/components/cards/VehicleCard';
import type { DriverItem } from '@/components/cards/DriverCard';


export default function VehiclesTab() {
  const { country } = useSettings();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({
    destination: { country: country?.name_fr, city: undefined },
    intent: 'vip',
    brand: undefined,
    model: undefined,
    seats: undefined,
    fuel: undefined,
    gearbox: undefined,
    withDriver: undefined,
    year: { min: undefined, max: undefined },
    pricePerDay: { min: 0, max: 1000000 },
    startDate: null,
    endDate: null,
    ratingMin: 0,
    amenities: [],
  });

  const transformVehicle = (item: any): VehicleItem => ({
    id: item.id,
    title: item.title ?? item.brand ?? 'Véhicule',
    city: item.city ?? 'Ville',
    imageUrl: item.photos?.[0] ?? item.image ?? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    isPremium: item.premium ?? false,
    isVip: item.kind === 'vip',
    forRent: item.kind !== 'sale',
    pricePerDay: item.price ?? item.pricePerDay ?? 0,
    currency: item.currency ?? 'XOF',
    seats: item.seats ?? 5,
    fuel: item.fuel ?? 'diesel',
    transmission: item.transmission ?? 'auto',
    rating: item.rating
  });

  const transformDriver = (item: any): DriverItem => ({
    id: item.id,
    name: item.title ?? 'Chauffeur',
    city: item.city ?? 'Ville',
    imageUrl: item.image ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    isPremium: item.premium ?? false,
    pricePerDay: item.price ?? 0,
    currency: item.currency ?? 'XOF',
    rating: item.rating,
    experience: item.experience ?? 5,
    languages: item.languages ?? ['Français'],
    verified: item.verified ?? true
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.stickyHeader, { paddingTop: insets.top }]}>
        <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:16, position:'relative' }}>
          <Pressable onPress={() => router.push('/(tabs)/home')} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ textAlign:'center', fontSize:38, fontWeight:'900', color: '#0B1720', letterSpacing: 3, marginVertical: 8 }}>ZIMA</Text>
          </Pressable>
          <View style={{ position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' }}>
            <HeaderCountryButton />
          </View>
        </View>
        <View style={{ paddingHorizontal:16, paddingBottom:8 }}>
          <SegmentedTabs
            value="vehicles"
            onChange={(k)=>{
              if (k==='props') router.push('/(tabs)/properties');
              else if (k==='trips') router.push('/(tabs)/voyages');
            }}
          />
        </View>
        <View style={{ paddingHorizontal:16, paddingBottom:12 }}>
          <Pressable onPress={()=>setOpenFilters(true)} style={{ height:48, borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, justifyContent:'center', paddingHorizontal:14 }}>
            <Text style={{ fontWeight:'700' }}>
              {(filters.destination?.country) ?? 'Pays'}, {(filters.destination?.city) ?? 'Ville'} • {filters.intent==='vip'?'VIP':filters.intent==='rent'?'Location':filters.intent==='sale'?'Vente':'Chauffeurs'}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: 16, paddingBottom: Math.max(insets.bottom + 80, 96) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 16, paddingHorizontal: 16 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sociétés</Text>
          </View>
          <CompanyLogoRow />
        </View>

        <CategoryRail
          title="VIP avec chauffeur"
          queryKey={['vehicles-vip', country?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const vehicles = [
              { id: 'v1', title: 'Mercedes V-Class', city: 'Abidjan', countryCode: 'CI', price: 120000, currency: 'XOF', premium: true, kind: 'vip', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&h=600&fit=crop', rating: 4.9 },
              { id: 'v5', title: 'BMW X5', city: 'Douala', countryCode: 'CM', price: 150000, currency: 'XAF', premium: true, kind: 'vip', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop', rating: 4.8 },
              { id: 'v9', title: 'Audi A6', city: 'Abidjan', countryCode: 'CI', price: 95000, currency: 'XOF', premium: true, kind: 'vip', image: 'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=900&h=600&fit=crop', rating: 4.7 },
            ];
            const filtered = vehicles.filter(v => !country?.code || v.countryCode === country.code);
            return filtered.slice(0, 10).map(transformVehicle);
          }}
          renderItem={(item) => <VehicleCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/vehicles/list', params: { intent: 'vip' } } as any)}
        />

        <CategoryRail
          title="Location"
          queryKey={['vehicles-rent', country?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const vehicles = [
              { id: 'v2', title: 'Toyota Corolla', city: 'Lomé', countryCode: 'TG', price: 35000, currency: 'XOF', premium: false, kind: 'rent', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=900&h=600&fit=crop', rating: 4.6 },
              { id: 'v6', title: 'Peugeot 508', city: 'Abidjan', countryCode: 'CI', price: 45000, currency: 'XOF', premium: false, kind: 'rent', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop', rating: 4.3 },
              { id: 'v11', title: 'Renault Clio', city: 'Lomé', countryCode: 'TG', price: 28000, currency: 'XOF', premium: false, kind: 'rent', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&h=600&fit=crop', rating: 4.1 },
            ];
            const filtered = vehicles.filter(v => !country?.code || v.countryCode === country.code);
            return filtered.slice(0, 10).map(transformVehicle);
          }}
          renderItem={(item) => <VehicleCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/vehicles/list', params: { intent: 'rent' } } as any)}
        />

        <CategoryRail
          title="Vente"
          queryKey={['vehicles-sale', country?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const vehicles = [
              { id: 'v3', title: 'Hyundai H1', city: 'Cotonou', countryCode: 'BJ', price: 9000000, currency: 'XOF', premium: false, kind: 'sale', image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=900&h=600&fit=crop', rating: 4.2 },
              { id: 'v7', title: 'Range Rover Sport', city: 'Libreville', countryCode: 'GA', price: 25000000, currency: 'XAF', premium: true, kind: 'sale', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop', rating: 4.9 },
              { id: 'v10', title: 'Nissan Patrol', city: 'Dakar', countryCode: 'SN', price: 18000000, currency: 'XOF', premium: true, kind: 'sale', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop', rating: 4.5 },
            ];
            const filtered = vehicles.filter(v => !country?.code || v.countryCode === country.code);
            return filtered.slice(0, 10).map(transformVehicle);
          }}
          renderItem={(item) => <VehicleCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/vehicles/list', params: { intent: 'sale' } } as any)}
        />

        <CategoryRail
          title="Chauffeurs Pro"
          queryKey={['vehicles-driver', country?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const drivers = [
              { id: 'v4', title: 'Paul Diop', city: 'Dakar', countryCode: 'SN', price: 60000, currency: 'XOF', premium: true, kind: 'driver', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=600&fit=crop', rating: 5, experience: 8, languages: ['Français', 'Wolof', 'Anglais'], verified: true },
              { id: 'v8', title: 'Marie Kouassi', city: 'Abidjan', countryCode: 'CI', price: 55000, currency: 'XOF', premium: false, kind: 'driver', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&h=600&fit=crop', rating: 4.7, experience: 6, languages: ['Français', 'Baoulé'], verified: true },
              { id: 'v12', title: 'Amadou Ndiaye', city: 'Douala', countryCode: 'CM', price: 65000, currency: 'XAF', premium: true, kind: 'driver', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=600&fit=crop', rating: 4.9, experience: 10, languages: ['Français', 'Anglais', 'Douala'], verified: true },
            ];
            const filtered = drivers.filter(v => !country?.code || v.countryCode === country.code);
            return filtered.slice(0, 10).map(transformDriver);
          }}
          renderItem={(item) => <DriverCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/vehicles/list', params: { intent: 'driver' } } as any)}
        />
      </ScrollView>

      <UnifiedFilterSheet
        kind="vehicle"
        open={openFilters}
        initial={filters}
        onClose={()=>setOpenFilters(false)}
        onReset={()=>setFilters({
          destination: { country: country?.name_fr, city: undefined },
          intent: 'vip', brand: undefined, model: undefined,
          seats: undefined, fuel: undefined, gearbox: undefined, withDriver: undefined,
          year: {}, pricePerDay: { min: 0, max: 1000000 },
          startDate: null, endDate: null, ratingMin: 0, amenities: []
        })}
        onApply={(values)=>{
          setFilters(values);
          setOpenFilters(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stickyHeader: { backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB', zIndex: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 6 },
  section: {
    marginVertical: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  viewAllLink: {
    color: '#0e5a43',
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  loader: {
    marginVertical: 20,
  },
});
