import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, Stack, useRouter } from 'expo-router';
import { useVehicles } from '@/hooks/useVehicles';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { useSettings } from '@/hooks/useSettings';
import { t } from '@/lib/i18n';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import ZimaBrand from '@/components/ui/ZimaBrand';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import CompanyLogoRow from '@/components/vehicles/CompanyLogoRow';
import UnifiedFilterSheet, { VehicleFilters } from '@/components/filters/UnifiedFilterSheet';
import { buildVehicleQuery } from '@/utils/filters';

function Section({
  title,
  data,
  link,
  loading,
}: {
  title: string;
  data: any[];
  link: string;
  loading?: boolean;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Link href={link as any} asChild>
          <Text style={styles.viewAllLink} testID="seeAllLink">Voir tout ›</Text>
        </Link>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0e5a43" style={styles.loader} />
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(it: any) => it.id}
          renderItem={({ item }) => <VehicleCard vehicle={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

export default function VehiclesTab() {
  const { locale, country } = useSettings();
  const L = t(locale ?? 'fr');
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

  const vip = useVehicles({ kind: 'vip' });
  const sale = useVehicles({ kind: 'sale' });
  const loc = useVehicles({ kind: 'rent' });
  const drv = useVehicles({ kind: 'driver' });

  const allVehicles = [
    ...(vip.data ?? []),
    ...(sale.data ?? []),
    ...(loc.data ?? []),
    ...(drv.data ?? [])
  ];

  const isLoadingAny = vip.isLoading || sale.isLoading || loc.isLoading || drv.isLoading;

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

      <FlatList
        data={allVehicles}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: Math.max(insets.bottom + 80, 96), gap: 12 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sociétés</Text>
            </View>
            <CompanyLogoRow />
          </View>
        }
        ListEmptyComponent={
          isLoadingAny ? (
            <ActivityIndicator size="large" color="#0e5a43" style={{ marginTop: 32 }} />
          ) : (
            <Text style={{ color: '#64748B', textAlign: 'center', marginTop: 32 }}>Aucun véhicule disponible.</Text>
          )
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <VehicleCard vehicle={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

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
          const q = buildVehicleQuery(values);
          console.log('[vehicles] apply filters =>', q);
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
