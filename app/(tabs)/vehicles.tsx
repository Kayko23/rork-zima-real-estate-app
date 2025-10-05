import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useSettings } from '@/hooks/useSettings';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import ZimaBrand from '@/components/ui/ZimaBrand';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import CompanyLogoRow from '@/components/vehicles/CompanyLogoRow';
import UnifiedFilterSheet, { VehicleFilters } from '@/components/filters/UnifiedFilterSheet';
import CategoryRail from '@/components/home/CategoryRail';
import VehicleCard from '@/components/cards/VehicleCard';
import type { VehicleItem } from '@/components/cards/VehicleCard';
import { useMoney } from '@/lib/money';


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

  const { format } = useMoney();

  const transformVehicle = (item: any): VehicleItem => ({
    id: item.id,
    title: item.title ?? item.brand ?? 'Véhicule',
    city: item.city ?? 'Ville',
    priceLabel: format(item.pricePerDay ?? item.price ?? 0, item.currency ?? 'XOF'),
    cover: item.photos?.[0] ?? item.image ?? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    badges: [],
    rating: item.rating,
    isPremium: item.premium ?? false
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
            const vehicles = [
              { id: 'v4', title: 'Chauffeur Pro Paul', city: 'Dakar', countryCode: 'SN', price: 60000, currency: 'XOF', premium: true, kind: 'driver', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=600&fit=crop', rating: 5 },
              { id: 'v8', title: 'Chauffeur Pro Marie', city: 'Abidjan', countryCode: 'CI', price: 55000, currency: 'XOF', premium: false, kind: 'driver', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&h=600&fit=crop', rating: 4.7 },
              { id: 'v12', title: 'Chauffeur Pro Amadou', city: 'Douala', countryCode: 'CM', price: 65000, currency: 'XAF', premium: true, kind: 'driver', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=600&fit=crop', rating: 4.9 },
            ];
            const filtered = vehicles.filter(v => !country?.code || v.countryCode === country.code);
            return filtered.slice(0, 10).map(transformVehicle);
          }}
          renderItem={(item) => <VehicleCard item={item} />}
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
