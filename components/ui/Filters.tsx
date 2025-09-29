import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, FlatList, ScrollView } from "react-native";
import { ChevronDown, MapPin, Globe, Filter } from "lucide-react-native";
import { COUNTRIES, CITIES } from "@/constants/countries";
import { GlassButton } from "./Glass";

export type FiltersState = {
  country: string | null;
  city: string | null;
  intent: "tous" | "à vendre" | "à louer";
};

export default function Filters({ onApply }: { onApply: (f: FiltersState) => void }) {
  const [f, setF] = useState<FiltersState>({ country: null, city: null, intent: "tous" });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
  };

  return (
    <>
      {/* Bouton compact pour ouvrir les filtres */}
      <Pressable style={s.filterButton} onPress={() => setShowFilters(true)}>
        <Filter size={18} color="#0F172A" />
        <Text style={s.filterButtonText}>Filtres</Text>
        {(f.country || f.city || f.intent !== "tous") && (
          <View style={s.filterBadge}>
            <Text style={s.filterBadgeText}>•</Text>
          </View>
        )}
        <ChevronDown size={16} color="#64748B" />
      </Pressable>

      {/* Modal des filtres */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.filterModal}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Filtres</Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <Text style={s.closeButton}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={s.modalContent} showsVerticalScrollIndicator={false}>
              {/* Filtres de localisation */}
              <View style={s.section}>
                <Text style={s.sectionLabel}>Localisation</Text>
                <View style={s.row}>
                  <Pressable style={s.modalPill} onPress={() => setShowCountryModal(true)}>
                    <Globe size={14} color="#64748B" />
                    <Text style={s.modalPillText}>{f.country || "Pays"}</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[s.modalPill, !f.country && s.disabled]} 
                    disabled={!f.country}
                    onPress={() => setShowCityModal(true)}
                  >
                    <MapPin size={14} color={f.country ? "#64748B" : "#CBD5E1"} />
                    <Text style={[s.modalPillText, !f.country && s.disabledText]}>
                      {f.city || "Ville"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Type de transaction */}
              <View style={s.section}>
                <Text style={s.sectionLabel}>Type de transaction</Text>
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
              </View>
              
              <View style={s.buttonContainer}>
                <GlassButton 
                  title="Appliquer" 
                  onPress={() => {
                    applyFilters();
                    setShowFilters(false);
                  }} 
                  style={s.applyButton} 
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Pays */}
      <Modal
        visible={showCountryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.pickerModal}>
            <Text style={s.pickerTitle}>Choisir un pays</Text>
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
          <View style={s.pickerModal}>
            <Text style={s.pickerTitle}>Choisir une ville</Text>
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
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 12,
    borderWidth: 1,
    borderColor: "rgba(230,232,235,0.8)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    flex: 1
  },
  filterBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#19715C"
  },
  filterBadgeText: {
    fontSize: 0
  },
  filterModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingTop: 20
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A"
  },
  closeButton: {
    fontSize: 18,
    color: "#64748B",
    padding: 4
  },
  modalContent: {
    flex: 1,
    padding: 20
  },
  buttonContainer: {
    paddingVertical: 20
  },
  section: {
    marginBottom: 24
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 12
  },
  modalPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flex: 1,
    marginRight: 8
  },
  modalPillText: {
    fontSize: 14,
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
  pickerModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingTop: 20
  },
  pickerTitle: {
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