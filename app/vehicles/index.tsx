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
import VehicleFiltersSheet, { VehicleFilters } from '@/components/filters/VehicleFiltersSheet';
import type { VehicleKind } from '@/types/vehicle';
import React from "react";

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

export default function VehiclesHome() {
  const { locale } = useSettings();
  const L = t(locale ?? 'fr');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [filtersOpen, setFiltersOpen] = React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<VehicleFilters>({ kind: undefined, premium: undefined });

  const vip = useVehicles({ kind: 'vip', premium: filters.premium });
  const sale = useVehicles({ kind: 'sale', premium: filters.premium });
  const loc = useVehicles({ kind: 'rent', premium: filters.premium });
  const drv = useVehicles({ kind: 'driver', premium: filters.premium });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.stickyHeader, { paddingTop: insets.top }]}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16 }}>
          <Pressable onPress={() => router.push('/(tabs)/home')} style={{ paddingVertical:8 }}>
            <ZimaBrand />
          </Pressable>
          <HeaderCountryButton />
        </View>
        <View style={{ paddingHorizontal:16, paddingBottom:12, paddingTop:16 }}>
          <SegmentedTabs
            value="vehicles"
            onChange={(k)=>{
              if (k==='props') router.push('/(tabs)/properties');
              else if (k==='trips') router.push('/(tabs)/voyages');
            }}
          />
        </View>
        <View style={{ paddingHorizontal:16, paddingBottom:12 }}>
          <Pressable testID="openVehicleFilters" onPress={() => setFiltersOpen(true)} style={styles.searchStub}>
            <Text style={styles.searchTitle}>
              {filters.kind ? labelKind(filters.kind) : 'Type'} • {filters.premium === true ? 'Premium' : filters.premium === false ? 'Standard' : 'Tous'}
            </Text>
            <Text style={styles.searchSub}>Filtrer les véhicules et chauffeurs</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={[0]}
        renderItem={() => (
          <View>
            <View style={{ marginTop: 16 }}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Sociétés</Text>
              </View>
              <CompanyLogoRow />
            </View>

            <Section
              title={L.vehiclesVip}
              data={vip.data ?? []}
              link="/vehicles/list?kind=vip"
              loading={vip.isLoading}
            />
            <Section
              title={L.vehiclesSale}
              data={sale.data ?? []}
              link="/vehicles/list?kind=sale"
              loading={sale.isLoading}
            />
            <Section
              title={L.vehiclesRent}
              data={loc.data ?? []}
              link="/vehicles/list?kind=rent"
              loading={loc.isLoading}
            />
            <Section
              title={L.vehiclesDriver}
              data={drv.data ?? []}
              link="/vehicles/list?kind=driver"
              loading={drv.isLoading}
            />
          </View>
        )}
        keyExtractor={() => 'vehicles'}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) }}
        showsVerticalScrollIndicator={false}
      />

      <VehicleFiltersSheet
        visible={filtersOpen}
        initial={filters}
        resultCount={(vip.data?.length ?? 0) + (sale.data?.length ?? 0) + (loc.data?.length ?? 0) + (drv.data?.length ?? 0)}
        onClose={() => setFiltersOpen(false)}
        onApply={(f) => { setFilters(f); setFiltersOpen(false); }}
      />
    </View>
  );
}

function labelKind(k: VehicleKind): string {
  switch (k) {
    case 'vip': return 'VIP';
    case 'rent': return 'À louer';
    case 'sale': return 'En vente';
    case 'driver': return 'Chauffeurs';
    default: return 'Type';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stickyHeader: { backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB', zIndex: 10 },
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
  searchStub: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 14, justifyContent: 'center' },
  searchTitle: { fontWeight: '700' },
  searchSub: { color: '#6B7280', marginTop: 2 },
});
