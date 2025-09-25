import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Filter } from "lucide-react-native";

import VoyageSearchBar, { type VoyageQuery } from "@/components/voyages/VoyageSearchBar";
import { VoyageSearchSheet } from "@/components/voyages/VoyageSearchSheet";
import FilterSheet, { type TripsFilters } from "@/components/sheets/FilterSheet";
import VoyageCarousel from "@/components/voyages/VoyageCarousel";
import { usePopularHotels, useRecommendedHotels } from "@/hooks/useHotels";

export default function VoyagesTab() {
  const insets = useSafeAreaInsets();
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [q, setQ] = useState<VoyageQuery>({ guests: 1 });
  const [filters, setFilters] = useState<TripsFilters>({});

  const popular = usePopularHotels({
    city: q.destination,
    startDate: q.startDate,
    endDate: q.endDate,
    guests: q.guests,
  });

  const recommended = useRecommendedHotels({
    city: q.destination,
    startDate: q.startDate,
    endDate: q.endDate,
    guests: q.guests,
  });

  return (
    <ScrollView style={t.scroll} contentContainerStyle={[t.scrollContent, { paddingTop: insets.top + 8 }]} testID="voyage.screen">
      <View style={t.headerBox}>
        <Text style={t.h1}>Voyages</Text>
        <Text style={t.p}>Découvrez des hébergements exceptionnels à travers l&#39;Afrique</Text>
        <View style={t.searchWrap}>
          <VoyageSearchBar value={q} onOpen={() => setSearchOpen(true)} />
        </View>
        <Pressable onPress={() => setFilterOpen(true)} style={t.filters} testID="voyage.filters">
          <Filter size={18} color="#0B3B2E" />
          <Text style={t.filtersText}>Filtres</Text>
        </Pressable>
      </View>

      <VoyageCarousel
        title="Populaires près de vous"
        loading={popular.loading}
        data={popular.items}
        onEnd={popular.loadMore}
      />
      <VoyageCarousel
        title="Hôtels recommandés"
        loading={recommended.loading}
        data={recommended.items}
        onEnd={recommended.loadMore}
      />

      <VoyageSearchSheet
        visible={searchOpen}
        onClose={() => setSearchOpen(false)}
        initial={q}
        onSubmit={(next) => {
          setQ(next);
          popular.setQuery({ city: next.destination, startDate: next.startDate, endDate: next.endDate, guests: next.guests });
          recommended.setQuery({ city: next.destination, startDate: next.startDate, endDate: next.endDate, guests: next.guests });
        }}
      />
      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        value={filters}
        onChange={setFilters}
      />
    </ScrollView>
  );
}

const t = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24, paddingTop: 8 },
  headerBox: { paddingHorizontal: 16 },
  h1: { fontSize: 28, fontWeight: "900", color: "#0F172A" },
  p: { marginTop: 6, color: "#475569" },
  searchWrap: { marginTop: 10 },
  filters: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#ECFDF5", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  filtersText: { color: "#0B3B2E", fontWeight: "800" },
});
