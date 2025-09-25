import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeHeader from "@/components/home/HomeHeader";
import { VoyageSearchBar, VoyageQuery } from "@/components/voyages/VoyageSearchBar";
import { VoyageCarousel } from "@/components/voyages/VoyageCarousel";
import { mockVoyages } from "@/components/voyages/helpers";
import { Filter, ArrowRight } from "lucide-react-native";
import { useApp } from "@/hooks/useAppStore";
import SearchSheet from "@/components/sheets/SearchSheet";
import FilterSheet from "@/components/sheets/FilterSheet";
import type { TripsSearch, TripsFilters } from "@/lib/search-types";

export default function VoyagesScreen() {
  const insets = useSafeAreaInsets();
  const [q] = useState<VoyageQuery>(() => ({ type: "all" }));
  const [search, setSearch] = useState<Partial<TripsSearch>>({});
  const [filters, setFilters] = useState<Partial<TripsFilters>>({});
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const { setHomeTab } = useApp();

  const handleItemPress = (item: any) => {
    console.log("Opening voyage detail:", item.id);
    // TODO: Navigate to voyage detail page
  };

  const handleViewAll = (category: string) => {
    if (!category?.trim()) return;
    console.log("View all for category:", category.trim());
    // TODO: Navigate to search results with category filter
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <Stack.Screen
        options={{
          title: "Voyages",
          headerShown: false,
        }}
      />
      
      {/* Header avec logo et navigation */}
      <View style={styles.headerContainer}>
        <HomeHeader active="voyages" onChange={setHomeTab} />
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Voyages</Text>
            <Text style={styles.subtitle}>
              Découvrez des hébergements exceptionnels à travers l&apos;Afrique
            </Text>
          </View>

        <View style={styles.searchSection}>
          <VoyageSearchBar query={q} onPress={() => setIsSearchOpen(true)} />
          <View style={styles.filterRow}>
            <Pressable style={styles.filterButton} onPress={() => setIsFilterOpen(true)} testID="voyages.filterButton">
              <Filter size={16} color="#374151" />
              <Text style={styles.filterText}>Filtres</Text>
            </Pressable>
          </View>
        </View>

        {/* Popular Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Populaires près de vous</Text>
            <Pressable
              style={styles.viewAllButton}
              onPress={() => handleViewAll("popular")}
            >
              <Text style={styles.viewAllText}>Voir tout</Text>
              <ArrowRight size={16} color="#6B7280" />
            </Pressable>
          </View>
          <VoyageCarousel data={mockVoyages.slice(0, 4)} onPressItem={handleItemPress} />
        </View>

        {/* Hotels Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hôtels recommandés</Text>
            <Pressable
              style={styles.viewAllButton}
              onPress={() => handleViewAll("hotels")}
            >
              <Text style={styles.viewAllText}>Voir tout</Text>
              <ArrowRight size={16} color="#6B7280" />
            </Pressable>
          </View>
          <VoyageCarousel
            data={mockVoyages.filter((v) => v.type === "hotel")}
            onPressItem={handleItemPress}
          />
        </View>

        {/* Daily Rentals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Locations journalières</Text>
            <Pressable
              style={styles.viewAllButton}
              onPress={() => handleViewAll("daily")}
            >
              <Text style={styles.viewAllText}>Voir tout</Text>
              <ArrowRight size={16} color="#6B7280" />
            </Pressable>
          </View>
          <VoyageCarousel
            data={mockVoyages.filter((v) => v.type === "daily")}
            onPressItem={handleItemPress}
          />
        </View>

        {/* Residences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Résidences</Text>
            <Pressable
              style={styles.viewAllButton}
              onPress={() => handleViewAll("residences")}
            >
              <Text style={styles.viewAllText}>Voir tout</Text>
              <ArrowRight size={16} color="#6B7280" />
            </Pressable>
          </View>
          <VoyageCarousel
            data={mockVoyages.filter((v) => v.type === "residence")}
            onPressItem={handleItemPress}
          />
        </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      <SearchSheet
        visible={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        section="trips"
        initial={search}
        onApply={(v) => {
          console.log('Search applied:', v);
          setSearch(v);
        }}
      />
      <FilterSheet
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initial={filters}
        onApply={(v) => {
          console.log('Filters applied:', v);
          setFilters(v);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerContainer: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  scrollView: {
    flex: 1,
  },
  content: {
    backgroundColor: "#F9FAFB",
  },
  pageContent: {
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 22,
  },
  searchSection: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3F4F6",
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    justifyContent: "center",
  },
  filterText: {
    fontWeight: "800",
    color: "#374151",
    fontSize: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "900",
    fontSize: 20,
    color: "#1F2937",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontWeight: "700",
    color: "#6B7280",
    fontSize: 14,
  },
  bottomSpacer: {
    height: 40,
  },
});