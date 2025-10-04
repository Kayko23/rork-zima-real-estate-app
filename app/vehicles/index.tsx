import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Stack } from 'expo-router';
import { useVehicles } from '@/hooks/useVehicles';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { useSettings } from '@/hooks/useSettings';
import { t } from '@/lib/i18n';

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
          <Text style={styles.viewAllLink}>Voir tout ›</Text>
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

  const prem = useVehicles({ premium: true });
  const loc = useVehicles({ kind: 'rent' });
  const sale = useVehicles({ kind: 'sale' });
  const vip = useVehicles({ kind: 'vip' });
  const drv = useVehicles({ kind: 'driver' });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        data={[0]}
        renderItem={() => (
          <View>
            <Section
              title={L.vehiclesPremium}
              data={prem.data ?? []}
              link="/vehicles/list?premium=1"
              loading={prem.isLoading}
            />
            <Section
              title={L.vehiclesRent}
              data={loc.data ?? []}
              link="/vehicles/list?kind=rent"
              loading={loc.isLoading}
            />
            <Section
              title={L.vehiclesSale}
              data={sale.data ?? []}
              link="/vehicles/list?kind=sale"
              loading={sale.isLoading}
            />
            <Section
              title={L.vehiclesVip}
              data={vip.data ?? []}
              link="/vehicles/list?kind=vip"
              loading={vip.isLoading}
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
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
