import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, FlatList } from "react-native";
import { ChevronDown, MapPin, Globe, Filter } from "lucide-react-native";
import { COUNTRIES, CITIES } from "@/constants/countries";
import { GlassCard, GlassButton } from "./Glass";

export type FiltersState = {
  country: string | null;
  city: string | null;
  intent: "tous" | "à vendre" | "à louer";
};

export default function Filters({ onApply }: { onApply: (f: FiltersState) => void }) {
  const [f, setF] = useState<FiltersState>({ country: null, city: null, intent: "tous" });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const cities = useMemo(() => (f.country ? (CITIES[f.country] ?? []) : []), [f.country]);

  const handleCountryChange = (value: string | null) => {
    setF({ ...f, country: value || null, city: null });
    setShowCountryModal(false);
  };

  const handleCityChange = (value: string | null) => {
    setF({ ...f, city: value || null });
    setShowCityModal(false);
  };

  const handleIntentChange = (intent: "tous" | "à vendre" | "à louer") => {
    setF({ ...f, intent });
  };

  const applyFilters = () => {
    onApply(f);
    setIsExpanded(false);
  };

  return (
    <>
      <GlassCard style={s.compactWrap}>
        {/* Header avec bouton d'expansion */}
        <Pressable style={s.header} onPress={() => setIsExpanded(!isExpanded)}>
          <View style={s.headerLeft}>
            <Filter size={18} color="#0F172A" />
            <Text style={s.headerTitle}>Filtres</Text>
            {(f.country || f.city || f.intent !== "tous") && (
              <View style={s.badge}>
                <Text style={s.badgeText}>•</Text>
              </View>
            )}
          </View>
          <ChevronDown 
            size={20} 
            color="#64748B" 
            style={[s.chevron, isExpanded && s.chevronRotated]} 
          />
        </Pressable>

        {/* Filtres rapides (toujours visibles) */}
        <View style={s.quickFilters}>
          <Pressable style={s.quickFilter} onPress={() => setShowCountryModal(true)}>
            <Globe size={14} color="#64748B" />
            <Text style={s.quickFilterText} numberOfLines={1}>
              {f.country || "Pays"}
            </Text>
          </Pressable>
          
          <Pressable 
            style={[s.quickFilter, !f.country && s.disabled]} 
            disabled={!f.country}
            onPress={() => setShowCityModal(true)}
          >
            <MapPin size={14} color={f.country ? "#64748B" : "#CBD5E1"} />
            <Text style={[s.quickFilterText, !f.country && s.disabledText]} numberOfLines={1}>
              {f.city || "Ville"}
            </Text>
          </Pressable>
        </View>

        {/* Filtres étendus */}
        {isExpanded && (
          <View style={s.expandedContent}>
            <View style={s.row}>
              {(["tous","à vendre","à louer"] as const).map(t => (
                <Pressable 
                  key={t} 
                  onPress={() => handleIntentChange(t)}
                  style={[s.pill, f.intent === t && s.pillActive]}
                >
                  <Text style={[s.pillText, f.intent === t && s.pillTextActive]}>
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
            
            <GlassButton 
              title="Appliquer" 
              onPress={applyFilters} 
              style={s.applyButton} 
            />
          </View>
        )}
      </GlassCard>

      {/* Modal Pays */}
      <Modal
        visible={showCountryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Choisir un pays</Text>
            <FlatList
              data={[{ label: "Tous les pays", value: null }, ...COUNTRIES.map(c => ({ label: c, value: c }))]}
              keyExtractor={(item) => item.value || "all"}
              renderItem={({ item }) => (
                <Pressable
                  style={[s.modalItem, f.country === item.value && s.modalItemSelected]}
                  onPress={() => handleCountryChange(item.value)}
                >
                  <Text style={[s.modalItemText, f.country === item.value && s.modalItemTextSelected]}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Ville */}
      <Modal
        visible={showCityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCityModal(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Choisir une ville</Text>
            <FlatList
              data={[{ label: "Toutes les villes", value: null }, ...cities.map(c => ({ label: c, value: c }))]}
              keyExtractor={(item) => item.value || "all"}
              renderItem={({ item }) => (
                <Pressable
                  style={[s.modalItem, f.city === item.value && s.modalItemSelected]}
                  onPress={() => handleCityChange(item.value)}
                >
                  <Text style={[s.modalItemText, f.city === item.value && s.modalItemTextSelected]}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  compactWrap: { 
    margin: 12, 
    padding: 0,
    overflow: "hidden"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(230,232,235,0.5)"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  headerTitle: { 
    fontWeight: "700", 
    fontSize: 16, 
    color: "#0F172A" 
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#19715C"
  },
  badgeText: {
    fontSize: 0
  },
  chevron: {
    transform: [{ rotate: "0deg" }]
  },
  chevronRotated: {
    transform: [{ rotate: "180deg" }]
  },
  quickFilters: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    paddingTop: 8
  },
  quickFilter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(230,232,235,0.8)"
  },
  quickFilterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    flex: 1
  },
  disabled: {
    opacity: 0.5
  },
  disabledText: {
    color: "#CBD5E1"
  },
  expandedContent: {
    padding: 12,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(230,232,235,0.5)"
  },
  row: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 8, 
    marginBottom: 12 
  },
  pill: { 
    paddingVertical: 8, 
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "rgba(230,232,235,0.8)"
  },
  pillActive: { 
    backgroundColor: "rgba(25,113,92,0.15)", 
    borderColor: "#19715C", 
    borderWidth: 1.5 
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B"
  },
  pillTextActive: {
    color: "#19715C"
  },
  applyButton: { 
    marginTop: 4 
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingTop: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 20
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9"
  },
  modalItemSelected: {
    backgroundColor: "rgba(25,113,92,0.08)"
  },
  modalItemText: {
    fontSize: 16,
    color: "#374151"
  },
  modalItemTextSelected: {
    color: "#19715C",
    fontWeight: "600"
  }
});