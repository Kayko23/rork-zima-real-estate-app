import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useVehicles } from '@/hooks/useVehicles';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { useSettings } from '@/hooks/useSettings';
import { t } from '@/lib/i18n';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import ZimaBrand from '@/components/ui/ZimaBrand';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import CompanyLogoRow from '@/components/vehicles/CompanyLogoRow';
import { TABBAR_HEIGHT } from '@/theme/tokens';

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
  const router = useRouter();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={() => router.push(link as any)}>
          <Text style={styles.viewAllLink} testID="seeAllLink">Voir tout ›</Text>
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

export default function VehiclesTab() {
  const { locale } = useSettings();
  const L = t(locale ?? 'fr');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const vip = useVehicles({ kind: 'vip' });
  const sale = useVehicles({ kind: 'sale' });
  const loc = useVehicles({ kind: 'rent' });
  const drv = useVehicles({ kind: 'driver' });

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Véhicules',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerRight: () => <HeaderCountryButton />,
        }} 
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + TABBAR_HEIGHT + 20 }}
      >
        <View style={styles.stickyHeader}>
          <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16 }}>
            <Pressable onPress={() => router.push('/(tabs)/home')} style={{ paddingVertical:8 }}>
              <ZimaBrand />
            </Pressable>
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
        </View>

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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stickyHeader: { 
    backgroundColor: '#fff', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor: '#E5E7EB', 
    zIndex: 10 
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
