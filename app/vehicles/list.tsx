import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { useVehicles } from '@/hooks/useVehicles';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { useSettings } from '@/hooks/useSettings';
import { t } from '@/lib/i18n';
import type { VehicleKind } from '@/types/vehicle';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import RequireCountry from '@/src/guards/RequireCountry';
import ActiveCountryBadge from '@/components/ui/ActiveCountryBadge';

export default function VehicleList() {
  const { locale } = useSettings();
  const L = t(locale ?? 'fr');
  const params = useLocalSearchParams<{ premium?: string; kind?: string }>();

  const filter = {
    premium: params.premium ? true : undefined,
    kind: params.kind as VehicleKind | undefined,
  };

  const { data, isLoading } = useVehicles(filter);

  const hasFilter = Boolean(params.premium || params.kind);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: L.results,
          headerBackTitle: 'Retour',
          headerRight: () => <HeaderCountryButton />,
        }}
      />
      <RequireCountry>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0e5a43" style={styles.loader} />
        ) : (
          <FlatList
            data={data ?? []}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <VehicleCard vehicle={item} />
              </View>
            )}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={{ gap: 10 }}>
                <ActiveCountryBadge />
                <View style={styles.pillsRow} testID="vehicles-pills-row">
                  <Link href="/vehicles/list?kind=vip" asChild>
                    <Pressable style={styles.pill} testID="pill-vip">
                      <Text style={styles.pillText}>VIP</Text>
                    </Pressable>
                  </Link>
                  <Link href="/vehicles/list?kind=driver" asChild>
                    <Pressable style={styles.pill} testID="pill-driver">
                      <Text style={styles.pillText}>Chauffeurs</Text>
                    </Pressable>
                  </Link>
                  <Link href="/vehicles/list?kind=rent" asChild>
                    <Pressable style={styles.pill} testID="pill-rent">
                      <Text style={styles.pillText}>Location</Text>
                    </Pressable>
                  </Link>
                  <Link href="/vehicles/list?kind=sale" asChild>
                    <Pressable style={styles.pill} testID="pill-sale">
                      <Text style={styles.pillText}>Vente</Text>
                    </Pressable>
                  </Link>
                  {hasFilter && (
                    <Link href="/vehicles/list" asChild>
                      <Pressable style={[styles.pill, styles.pillReset]} testID="pill-reset">
                        <Text style={[styles.pillText, styles.pillResetText]}>Réinitialiser</Text>
                      </Pressable>
                    </Link>
                  )}
                </View>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Aucun véhicule trouvé</Text>
              </View>
            }
          />
        )}
      </RequireCountry>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E8F1EE',
  },
  pillText: {
    color: '#0E5A43',
    fontWeight: '600',
  },
  pillReset: {
    backgroundColor: '#F1F5F9',
  },
  pillResetText: {
    color: '#111827',
  },
  cardWrapper: {
    width: '100%',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
