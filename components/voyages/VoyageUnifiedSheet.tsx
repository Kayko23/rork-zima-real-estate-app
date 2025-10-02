import React, { useState, useMemo } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { X, Calendar, MapPin, Star, ChevronDown } from "lucide-react-native";
import { VoyageQuery, VoyageFilters, Option } from "./helpers";
import { getCities, getCountries } from "./worlddata";
import { useVoyageFilters } from "@/components/voyages/filterContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

type Props = {
  visible: boolean;
  onClose: () => void;
  initialQuery?: VoyageQuery;
  initialFilters?: VoyageFilters;
  onSubmit: (q: VoyageQuery, f: VoyageFilters) => void;
};

export default function VoyageUnifiedSheet({ visible, onClose, initialQuery, initialFilters, onSubmit }: Props) {
  const [query, setQuery] = useState<VoyageQuery>(initialQuery || { type: "all" });
  const [filters, setFilters] = useState<VoyageFilters>(initialFilters || { priceMin: 0, priceMax: 1000000, ratingMin: 0, premiumOnly: false, amenities: [] });
  const [keyword, setKeyword] = useState("");
  const [expandedSection, setExpandedSection] = useState<string>("destination");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { setCountry, set } = useVoyageFilters();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const maxSheetHeight = useMemo(
    () => ({
      maxHeight: 720 - insets.top,
      paddingBottom: insets.bottom + tabBarHeight + 12,
    }),
    [insets.top, insets.bottom, tabBarHeight]
  );

  if (!visible) return null;

  const countries = getCountries(keyword);
  const cities = getCities(query.country?.value, keyword);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  const handleSubmit = () => {
    onSubmit(query, filters);
    onClose();
  };

  return (
    <View style={styles.backdrop} testID="voyage-unified-sheet">
      <Pressable style={{ flex: 1 }} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={[styles.sheet, maxSheetHeight]}
      >
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.title}>Recherche & Filtres</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <X size={22} color="#0B3B36" />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
        >
          <Section
            title="Destination"
            expanded={expandedSection === "destination"}
            onToggle={() => toggleSection("destination")}
          >
            <View style={styles.inputRow}>
              <MapPin size={18} color="#134E48" />
              <TextInput
                placeholder="Rechercher pays ou ville"
                value={keyword}
                onChangeText={setKeyword}
                style={styles.input}
              />
            </View>

            <FlatList
              data={query.country ? cities : countries}
              keyExtractor={(it) => it.value}
              style={{ maxHeight: 180, marginTop: 8 }}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    if (!query.country) {
                      setQuery({ ...query, country: item as Option, city: null });
                      setCountry((item as Option).label);
                    } else {
                      setQuery({ ...query, city: item as Option });
                      set({ destination: { country: query.country?.label, city: (item as Option).label } });
                    }
                  }}
                >
                  <Text style={styles.itemTxt}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={{ padding: 12, color: "#667" }}>Aucun résultat…</Text>}
            />
          </Section>

          <Section
            title="Dates"
            expanded={expandedSection === "dates"}
            onToggle={() => toggleSection("dates")}
          >
            <View style={styles.rowPills}>
              <Pressable
                style={styles.pill}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Calendar size={16} color="#0B3B36" />
                <Text style={styles.pillTxt}>{query.startDate ?? "Arrivée"}</Text>
              </Pressable>
              <Pressable
                style={styles.pill}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Calendar size={16} color="#0B3B36" />
                <Text style={styles.pillTxt}>{query.endDate ?? "Départ"}</Text>
              </Pressable>
            </View>
            {showStartDatePicker && (
              <DateTimePicker
                value={query.startDate ? new Date(query.startDate) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setQuery({ ...query, startDate: selectedDate.toISOString().slice(0, 10) });
                  }
                }}
              />
            )}
            {showEndDatePicker && (
              <DateTimePicker
                value={query.endDate ? new Date(query.endDate) : new Date(Date.now() + 86400000)}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                minimumDate={query.startDate ? new Date(query.startDate) : new Date()}
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setQuery({ ...query, endDate: selectedDate.toISOString().slice(0, 10) });
                  }
                }}
              />
            )}
          </Section>

          <Section
            title="Voyageurs"
            expanded={expandedSection === "voyageurs"}
            onToggle={() => toggleSection("voyageurs")}
          >
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setQuery({ ...query, guests: Math.max(1, (query.guests ?? 1) - 1) })}
              >
                <Text style={styles.stepTxt}>−</Text>
              </Pressable>
              <Text style={styles.stepValue}>{query.guests ?? 1} voyageur(s)</Text>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setQuery({ ...query, guests: Math.max(1, (query.guests ?? 1) + 1) })}
              >
                <Text style={styles.stepTxt}>＋</Text>
              </Pressable>
            </View>
          </Section>

          <Section
            title="Prix par nuit"
            expanded={expandedSection === "prix"}
            onToggle={() => toggleSection("prix")}
          >
            <Text style={styles.hint}>
              {filters.priceMin.toLocaleString()} – {filters.priceMax.toLocaleString()} FCFA
            </Text>
            <View style={styles.sliderRow}>
              <Pressable
                style={[styles.pill, styles.pillInline]}
                onPress={() => setFilters((prev) => ({ ...prev, priceMax: Math.max(10000, prev.priceMax - 5000) }))}
              >
                <Text style={styles.pillTxt}>- 5k</Text>
              </Pressable>
              <Pressable
                style={[styles.pill, styles.pillInline]}
                onPress={() => setFilters((prev) => ({ ...prev, priceMax: Math.min(200000, prev.priceMax + 5000) }))}
              >
                <Text style={styles.pillTxt}>+ 5k</Text>
              </Pressable>
            </View>
          </Section>

          <Section
            title="Note minimale"
            expanded={expandedSection === "note"}
            onToggle={() => toggleSection("note")}
          >
            <View style={styles.rowPills}>
              {[0, 3, 4, 4.5].map((n) => (
                <Pressable
                  key={n}
                  style={[styles.pill, filters.ratingMin === n && styles.pillOn]}
                  onPress={() => setFilters({ ...filters, ratingMin: n })}
                >
                  <Star size={14} color={filters.ratingMin === n ? "#fff" : "#0B3B36"} />
                  <Text style={[styles.pillTxt, filters.ratingMin === n && styles.pillOnTxt]}>{n === 0 ? "Tous" : `${n}+`}</Text>
                </Pressable>
              ))}
            </View>
          </Section>

          <Section
            title="Label"
            expanded={expandedSection === "label"}
            onToggle={() => toggleSection("label")}
          >
            <Pressable
              style={[styles.pill, filters.premiumOnly && styles.pillOn]}
              onPress={() => setFilters({ ...filters, premiumOnly: !filters.premiumOnly })}
            >
              <Text style={[styles.pillTxt, filters.premiumOnly && styles.pillOnTxt]}>Premium uniquement</Text>
            </Pressable>
          </Section>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
          <Pressable style={styles.cta} onPress={handleSubmit}>
            <Text style={styles.ctaTxt}>Voir les résultats</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Section({
  title,
  expanded,
  onToggle,
  children,
}: React.PropsWithChildren<{ title: string; expanded: boolean; onToggle: () => void }>) {
  return (
    <View style={styles.section}>
      <Pressable style={styles.sectionHeader} onPress={onToggle}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ChevronDown
          size={20}
          color="#0B3B36"
          style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
        />
      </Pressable>
      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,.35)", justifyContent: "flex-end" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: 720,
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E6E6",
  },
  title: { fontSize: 18, fontWeight: "800", color: "#0B3B36" },
  content: { padding: 16, gap: 4 },
  section: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F8FFFE",
    borderRadius: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0B3B36" },
  sectionContent: { marginTop: 8, paddingHorizontal: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E6EFEC",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 46,
    marginTop: 6,
  },
  input: { flex: 1, fontSize: 16 },
  item: { paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderColor: "#EEF3F1" },
  itemTxt: { fontSize: 15, color: "#0B3B36" },
  rowPills: { flexDirection: "row", gap: 10, marginTop: 8, flexWrap: "wrap" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6EFEC",
  },
  pillInline: {},
  pillOn: { backgroundColor: "#0B3B36", borderColor: "#0B3B36" },
  pillOnTxt: { color: "#fff" },
  pillTxt: { fontWeight: "700", color: "#0B3B36", fontSize: 14 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F4",
  },
  stepTxt: { fontSize: 20, fontWeight: "700" },
  stepValue: { fontSize: 15, fontWeight: "600" },
  hint: { fontSize: 14, color: "#374151", marginTop: 6 },
  sliderRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E6E6E6",
  },
  cta: { backgroundColor: "#0B6B53", height: 50, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  ctaTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
