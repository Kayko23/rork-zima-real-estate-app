import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useVehicles } from '@/hooks/useVehicles';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { useSettings } from '@/hooks/useSettings';
import { t } from '@/lib/i18n';
import type { VehicleKind } from '@/types/vehicle';

export default function VehicleList() {
  const { locale } = useSettings();
  const L = t(locale ?? 'fr');
  const params = useLocalSearchParams<{ premium?: string; kind?: string }>();

  const filter = {
    premium: params.premium ? true : undefined,
    kind: params.kind as VehicleKind | undefined,
  };

  const { data, isLoading } = useVehicles(filter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: L.results,
          headerBackTitle: 'Retour',
        }}
      />
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
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Aucun véhicule trouvé</Text>
            </View>
          }
        />
      )}
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
