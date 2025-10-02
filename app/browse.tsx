import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContentInsets } from "@/hooks/useContentInsets";
import PropertyCard from "@/components/ui/PropertyCard";
import BackButton from "@/components/ui/BackButton";
import Filters, { FiltersState } from "@/components/ui/Filters";
import { mockProperties } from "@/constants/data";
import Colors from "@/constants/colors";

export default function BrowseScreen() {
  const { top, bottom } = useContentInsets();
  const router = useRouter();
  const { title = "Tous les biens", kind = "all" } = useLocalSearchParams<{
    title?: string;
    kind?: string;
  }>();
  
  const [filters, setFilters] = useState<FiltersState>({
    country: null,
    city: null,
    intent: "tous",
  });

  const filteredData = useMemo(() => {
    let data = mockProperties;

    // Filter by kind (category)
    switch (kind) {
      case "premium":
        data = data.filter((item) => item.isPremium);
        break;
      case "nouveautes":
        data = data.slice(0, 6); // Most recent items
        break;
      case "residence":
        data = data.filter((item) => 
          ["Villa", "Maison", "Appartement", "Penthouse", "Studio"].includes(item.category)
        );
        break;
      case "terrain":
        data = data.filter((item) => item.category === "Terrain");
        break;
      case "immeuble":
        data = data.filter((item) => item.category === "Immeuble");
        break;
      case "bureaux":
        data = data.filter((item) => item.category === "Bureau");
        break;
      case "commerces":
        data = data.filter((item) => item.category === "Commerce");
        break;
      case "voyages":
        data = data.filter((item) =>
          item.category === "Hotel" ||
          (item.features || []).some(f => {
            const feature = String(f).toLowerCase().trim();
            return ["hotel","daily","nightly","jour","nuit","location courte durée"].includes(feature);
          })
        );
        break;
      default:
        // Show all
        break;
    }

    // Apply location filters
    if (filters.country) {
      data = data.filter((item) => item.location.country === filters.country);
    }
    if (filters.city) {
      data = data.filter((item) => item.location.city === filters.city);
    }

    // Apply transaction type filter
    if (filters.intent !== "tous") {
      const typeMap = {
        "à vendre": "sale",
        "à louer": "rent",
      };
      data = data.filter((item) => item.type === typeMap[filters.intent as keyof typeof typeMap]);
    }

    return data;
  }, [kind, filters]);

  const handlePropertyPress = (propertyId: string) => {
    console.log("Property pressed:", propertyId);
    router.push({
      pathname: "/property/[id]",
      params: { id: propertyId }
    });
  };

  const handleToggleFavorite = (propertyId: string) => {
    console.log("Toggle favorite:", propertyId);
    // TODO: Implement favorite toggle
  };

  const renderProperty = ({ item }: { item: any }) => (
    <PropertyCard
      property={item}
      onPress={() => handlePropertyPress(item.id)}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
      width={undefined} // Full width for list view
    />
  );

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: top + 8 }]}>
        <BackButton />
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {filteredData.length} bien{filteredData.length > 1 ? "s" : ""} trouvé{filteredData.length > 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      <Filters onApply={setFilters} />

      <FlatList
        data={filteredData}
        renderItem={renderProperty}
        keyExtractor={(item) => `browse-${item.id}`}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom + 16 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucun bien trouvé</Text>
            <Text style={styles.emptySubtitle}>
              Essayez de modifier vos critères de recherche
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  headerContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E6E8EB",
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#0F172A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500" as const,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});