import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Colors from "@/constants/colors";
import { BLOCS, VILLES, FilterState } from "@/constants/regions";

type FiltersProps = {
  onChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
};

export default function Filters({ onChange, initialFilters = {} }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    bloc: "TOUS",
    pays: null,
    ville: null,
    type: "tous",
    ...initialFilters,
  });

  const paysOptions = useMemo(() => {
    if (filters.bloc === "UEMOA") return BLOCS.UEMOA;
    if (filters.bloc === "CEMAC") return BLOCS.CEMAC;
    // TOUS = UEMOA + CEMAC
    return Array.from(new Set([...BLOCS.UEMOA, ...BLOCS.CEMAC])).sort();
  }, [filters.bloc]);

  const villesOptions = useMemo(() => {
    if (!filters.pays) return [];
    return (VILLES[filters.pays] ?? []).sort((a, b) => {
      if (!a || !b) return 0;
      return a.localeCompare(b, "fr");
    });
  }, [filters.pays]);

  function updateFilters(updates: Partial<FilterState>) {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onChange(newFilters);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtres</Text>

      {/* Bloc (UEMOA/CEMAC/TOUS) */}
      <View style={styles.row}>
        {(["TOUS", "UEMOA", "CEMAC"] as const).map((bloc) => (
          <Pressable
            key={bloc}
            onPress={() => updateFilters({ bloc, pays: null, ville: null })}
            style={[styles.pill, filters.bloc === bloc && styles.pillActive]}
            testID={`bloc-${bloc}`}
          >
            <Text style={[styles.pillText, filters.bloc === bloc && styles.pillTextActive]}>
              {bloc}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Pays */}
      <Text style={styles.label}>Pays</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={filters.pays}
          onValueChange={(value: string | null) => updateFilters({ pays: value || null, ville: null })}
          style={styles.picker}
          testID="pays-picker"
        >
          <Picker.Item label="Sélectionner un pays" value={null} />
          {paysOptions.map((pays) => (
            <Picker.Item key={pays} label={pays} value={pays} />
          ))}
        </Picker>
      </View>

      {/* Ville (dépend du pays) */}
      <Text style={styles.label}>Ville</Text>
      <View style={styles.pickerContainer}>
        <Picker
          enabled={!!filters.pays}
          selectedValue={filters.ville}
          onValueChange={(value: string | null) => updateFilters({ ville: value || null })}
          style={[styles.picker, !filters.pays && styles.pickerDisabled]}
          testID="ville-picker"
        >
          <Picker.Item
            label={filters.pays ? "Sélectionner une ville" : "Choisissez d'abord un pays"}
            value={null}
          />
          {villesOptions.map((ville) => (
            <Picker.Item key={ville} label={ville} value={ville} />
          ))}
        </Picker>
      </View>

      {/* Type rapide */}
      <Text style={styles.label}>Type de transaction</Text>
      <View style={styles.row}>
        {(["tous", "à vendre", "à louer"] as const).map((type) => (
          <Pressable
            key={type}
            onPress={() => updateFilters({ type })}
            style={[styles.pill, filters.type === type && styles.pillActive]}
            testID={`type-${type}`}
          >
            <Text style={[styles.pillText, filters.type === type && styles.pillTextActive]}>
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* CTA appliquer */}
      <Pressable style={styles.applyButton} onPress={() => onChange(filters)} testID="apply-filters">
        <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 16,
    color: "#0F172A",
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    color: "#475569",
    fontWeight: "600",
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E6E8EB",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
  },
  picker: {
    height: 50,
  },
  pickerDisabled: {
    opacity: 0.5,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillActive: {
    backgroundColor: Colors.primary + "22",
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  pillText: {
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 14,
  },
  pillTextActive: {
    color: Colors.primary,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});