import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ZimaBrand from '@/components/ui/ZimaBrand';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import CompanyLogoRow from '@/components/vehicles/CompanyLogoRow';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { useVehicles } from '@/hooks/useVehicles';
import { useSettings } from '@/hooks/useSettings';
import { t } from '@/lib/i18n';

export default function ProVehiclesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale } = useSettings();
  const L = useMemo(() => t(locale ?? 'fr'), [locale]);

  const vip = useVehicles({ kind: 'vip' });
  const sale = useVehicles({ kind: 'sale' });
  const rent = useVehicles({ kind: 'rent' });
  const driver = useVehicles({ kind: 'driver' });

  return (
    <View style={styles.container} testID="pro-vehicles-screen">
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.push('/(proTabs)/dashboard')} testID="brand-button">
            <ZimaBrand />
          </Pressable>
          <HeaderCountryButton />
        </View>
        <View style={styles.segmentWrap}>
          <SegmentedTabs
            value="vehicles"
            onChange={(k) => {
              if (k === 'props') router.push('/(proTabs)/listings');
              else if (k === 'trips') router.push('/(proTabs)/agenda');
            }}
          />
        </View>
      </View>

      <FlatList
        data={[0]}
        keyExtractor={() => 'pro-vehicles-root'}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 84, 96) }}
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <View>
            <View style={{ marginTop: 16 }}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Sociétés</Text>
              </View>
              <CompanyLogoRow />
            </View>

            <Section title={L.vehiclesVip} loading={vip.isLoading} data={vip.data ?? []} link="/(proTabs)/vehicles-list?kind=vip" />
            <Section title={L.vehiclesSale} loading={sale.isLoading} data={sale.data ?? []} link="/(proTabs)/vehicles-list?kind=sale" />
            <Section title={L.vehiclesRent} loading={rent.isLoading} data={rent.data ?? []} link="/(proTabs)/vehicles-list?kind=rent" />
            <Section title={L.vehiclesDriver} loading={driver.isLoading} data={driver.data ?? []} link="/(proTabs)/vehicles-list?kind=driver" />
          </View>
        )}
      />
    </View>
  );
}

function Section({ title, data, link, loading }: { title: string; data: any[]; link: string; loading?: boolean }) {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={() => router.push(link as any)} testID="see-all">
          <Text style={styles.viewAllLink}>Voir tout ›</Text>
        </Pressable>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    zIndex: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 },
  segmentWrap: { paddingHorizontal: 16, paddingBottom: 8 },
  section: { marginVertical: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8, alignItems: 'center' },
  sectionTitle: { fontSize: 22, fontWeight: '800' },
  viewAllLink: { color: '#0e5a43', fontWeight: '700', fontSize: 16 },
  listContent: { paddingHorizontal: 16 },
  loader: { marginVertical: 20 },
});
