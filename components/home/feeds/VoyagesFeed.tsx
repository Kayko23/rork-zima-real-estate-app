import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import LiquidGlassView from '@/components/ui/LiquidGlassView';
import VoyageSearchBar from '@/components/voyages/VoyageSearchBar';
import TravelFiltersSheet, { TravelFilters } from '@/components/travel/TravelFiltersSheet';
import VoyageCarousel from '@/components/voyages/VoyageCarousel';
import { VoyageQuery, VoyageFilters } from '@/components/voyages/helpers';
import { useVoyageApi } from '@/hooks/useVoyageApi';

export default function VoyagesFeed() {
  const [query, setQuery] = useState<VoyageQuery>({ type: 'all' });
  const [filters, setFilters] = useState<VoyageFilters>({ priceMin: 0, priceMax: 1000000, ratingMin: 0, premiumOnly: false });
  const [travelFilters, setTravelFilters] = useState<TravelFilters>({ country: undefined, city: undefined, checkIn: null, checkOut: null, guests: 1, priceMin: 10000, priceMax: 105000, ratingMin: undefined, amenities: [] });
  const [openUnified, setOpenUnified] = useState<boolean>(false);

  const { popular, recommended, daily, isLoading, isRefreshing, refetch, fetchNextPopular, fetchNextRecommended } = useVoyageApi({ query, filters });

  const onApplyUnified = useCallback((q: VoyageQuery, f: VoyageFilters) => {
    console.log('[VoyagesFeed] applyUnified', q, f);
    setQuery(q);
    setFilters(f);
    setOpenUnified(false);
    refetch();
  }, [refetch]);

  const sections = [
    { key: 'popular', title: 'Populaires près de vous', data: popular.items, onEndReached: fetchNextPopular },
    { key: 'recommended', title: 'Hôtels recommandés', data: recommended.items, onEndReached: fetchNextRecommended },
    { key: 'daily', title: 'Résidences à la journée', data: daily.items },
  ];

  const renderHeader = () => (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Voyages</Text>
        <Text style={styles.subtitle}>Découvrez des hébergements exceptionnels à travers l&apos;Afrique</Text>
      </View>

      <View style={styles.searchWrap}>
        <LiquidGlassView intensity={30} tint="light" style={styles.searchGlass}>
          <VoyageSearchBar value={query} onPress={() => setOpenUnified(true)} />
        </LiquidGlassView>
      </View>
    </View>
  );

  const renderSection = ({ item }: { item: typeof sections[0] }) => (
    <VoyageCarousel
      title={item.title}
      onSeeAll={() => router.push('/browse' as any)}
      data={item.data}
      loading={isLoading && item.data.length === 0}
      onEndReached={item.onEndReached}
    />
  );

  return (
    <View style={{ flex: 1 }} testID="voyages-feed">
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 116 }}
        ListHeaderComponent={renderHeader}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        removeClippedSubviews={true}
      />

      <TravelFiltersSheet
        visible={openUnified}
        initial={travelFilters}
        resultCount={(popular.items?.length ?? 0) + (recommended.items?.length ?? 0) + (daily.items?.length ?? 0)}
        onClose={() => setOpenUnified(false)}
        onApply={(f) => {
          setTravelFilters(f);
          setOpenUnified(false);
          // Optionally map into VoyageFilters/query to refetch API
          refetch();
        }}
        onReset={() => setTravelFilters({ country: undefined, city: undefined, checkIn: null, checkOut: null, guests: 1, priceMin: 10000, priceMax: 105000, ratingMin: undefined, amenities: [] })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0 },
  hero: { paddingHorizontal: 20, marginTop: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#0B3B36', letterSpacing: 0.3 },
  subtitle: { marginTop: 6, fontSize: 15, color: '#4B635F' },
  searchWrap: { paddingHorizontal: 16, marginTop: 12 },
  searchGlass: { borderRadius: 16, overflow: 'hidden', padding: 10, borderWidth: 1, borderColor: '#E6EFEC' },

});
