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
import VehicleCard, { VehicleItem } from '@/components/cards/VehicleCard';
import { useMoney } from '@/lib/money';
import { useVehicles } from '@/hooks/useVehicles';

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

  const vip = useVehicles({ kind: 'vip', countryCode: country?.code });
  const rent = useVehicles({ kind: 'rent', countryCode: country?.code });
  const sale = useVehicles({ kind: 'sale', countryCode: country?.code });
  const driver = useVehicles({ kind: 'driver', countryCode: country?.code });

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
          queryKey={['vehicles-vip', country?.name_fr]}
          queryFn={async () => {
            return (vip.data ?? []).slice(0, 10).map(transformVehicle);
          }}
          renderItem={(item) => <VehicleCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/vehicles/list', params: { intent: 'vip' } } as any)}
        />

        <CategoryRail
          title="Location"
          queryKey={['vehicles-rent', country?.name_fr]}
          queryFn={async () => {
            return (rent.data ?? []).slice(0, 10).map(transformVehicle);
          }}
          renderItem={(item) => <VehicleCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/vehicles/list', params: { intent: 'rent' } } as any)}
        />

        <CategoryRail
          title="Vente"
          queryKey={['vehicles-sale', country?.name_fr]}
          queryFn={async () => {
            return (sale.data ?? []).slice(0, 10).map(transformVehicle);
          }}
          renderItem={(item) => <VehicleCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/vehicles/list', params: { intent: 'sale' } } as any)}
        />

        <CategoryRail
          title="Chauffeurs Pro"
          queryKey={['vehicles-driver', country?.name_fr]}
          queryFn={async () => {
            return (driver.data ?? []).slice(0, 10).map(transformVehicle);
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
