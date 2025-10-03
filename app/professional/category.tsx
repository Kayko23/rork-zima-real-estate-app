import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { providersApi } from '@/lib/api';
import ProfessionalCard, { type Provider } from '@/components/professionals/ProfessionalCard';

const CATEGORY_LABEL: Record<string, string> = {
  agent: "Agents immobiliers",
  property_manager: "Gestionnaires de biens",
  agency: "Agences immobilières",
  hotel_booking: "Réservation – Hôtels",
  short_stay: "Réservation – Séjours à la nuit",
  event_space: "Gestion d'espaces évènementiels",
};

export default function CategoryProfessionalsScreen() {
  const params = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const category = params.category as Provider['category'];

  const { data = [], isLoading } = useQuery({
    queryKey: ['providers', { category }],
    queryFn: () => providersApi.list({ category }),
  });

  const title = CATEGORY_LABEL[category] || 'Professionnels';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerContent}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={8}
          >
            <ArrowLeft size={24} color="#0E2F26" strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Aucun prestataire dans cette catégorie.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 16 }]}
          columnWrapperStyle={styles.columnWrapper}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => (
            <View style={{ width: '48%' }}>
              <ProfessionalCard
                item={item}
                onPressProfile={(id) => router.push(`/professional/${id}`)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0E2F26',
    flex: 1,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 16,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
