import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import LiquidGlassView from '@/components/ui/LiquidGlassView';
import VoyageSearchBar from '@/components/voyages/VoyageSearchBar';
import VoyageSearchSheet from '@/components/voyages/VoyageSearchSheet';
import TripsFilterSheet from '@/components/sheets/TripsFilterSheet';
import VoyageCarousel from '@/components/voyages/VoyageCarousel';
import { VoyageQuery, VoyageFilters } from '@/components/voyages/helpers';
import { useVoyageApi } from '@/hooks/useVoyageApi';

export default function VoyagesFeed() {
  const [query, setQuery] = useState<VoyageQuery>({ type: 'all' });
  const [filters, setFilters] = useState<VoyageFilters>({ priceMin: 0, priceMax: 1000000, ratingMin: 0, premiumOnly: false });
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openFilters, setOpenFilters] = useState<boolean>(false);

  const { popular, recommended, daily, isLoading, isRefreshing, refetch, fetchNextPopular, fetchNextRecommended } = useVoyageApi({ query, filters });

  const onApplySearch = useCallback((q: VoyageQuery) => {
    console.log('[VoyagesFeed] applySearch', q);
    setQuery(q);
    setOpenSearch(false);
    refetch();
  }, [refetch]);

  const onApplyFilters = useCallback((f: VoyageFilters) => {
    console.log('[VoyagesFeed] applyFilters', f);
    setFilters(f);
    setOpenFilters(false);
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
          <VoyageSearchBar value={query} onPress={() => setOpenSearch(true)} />
        </LiquidGlassView>
      </View>

      <TouchableOpacity style={styles.filtersBtn} onPress={() => setOpenFilters(true)} activeOpacity={0.8} testID="voyages-open-filters">
        <Filter size={18} color="#134E48" />
        <Text style={styles.filtersTxt}>Filtres</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSection = ({ item }: { item: typeof sections[0] }) => (
    <VoyageCarousel
      title={item.title}
      onSeeAll={() => router.push('/browse?title='+encodeURIComponent(item.title)+'&kind=voyages')}
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
      />

      <VoyageSearchSheet visible={openSearch} initial={query} onClose={() => setOpenSearch(false)} onSubmit={onApplySearch} />
      <TripsFilterSheet visible={openFilters} onClose={() => setOpenFilters(false)} />
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
  filtersBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginTop: 10, marginLeft: 18, paddingVertical: 6 },
  filtersTxt: { color: '#134E48', fontWeight: '700' },
});
