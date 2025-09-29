import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from "react-native";
import { ChevronDown, Filter, X } from "lucide-react-native";
import { ALL_TARGET_COUNTRIES } from "@/data/regions";

export type ProfessionalFiltersState = {
  country: string | null;
  category: string | null;
};

const PROFESSIONAL_CATEGORIES = [
  "Agent immobilier",
  "Agence immobilière", 
  "Gestionnaire de biens",
  "Réservation hôtel",
  "Réservation résidence",
  "Gestionnaire d'espace évènementiel",
  "Architecte",
  "Décorateur d'intérieur",
  "Constructeur",
  "Promoteur immobilier",
  "Expert immobilier",
  "Notaire",
  "Avocat immobilier",
  "Courtier en crédit",
  "Assurance habitation",
  "Déménageur",
  "Nettoyage",
  "Sécurité",
  "Jardinage",
  "Plombier",
  "Électricien",
  "Peintre",
  "Carreleur",
  "Menuisier"
];

export default function ProfessionalFilters({ 
  onApply 
}: { 
  onApply: (f: ProfessionalFiltersState) => void 
}) {
  const [filters, setFilters] = useState<ProfessionalFiltersState>({ 
    country: null, 
    category: null 
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleCountryChange = (country: string | null) => {
    setFilters({ ...filters, country });
  };

  const handleCategoryChange = (category: string | null) => {
    setFilters({ ...filters, category });
  };

  const applyFilters = () => {
    onApply(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({ country: null, category: null });
  };

  const hasActiveFilters = filters.country || filters.category;

  return (
    <>
      {/* Bouton pour ouvrir les filtres */}
      <Pressable style={s.filterButton} onPress={() => setShowFilters(true)}>
        <Filter size={18} color="#0F172A" />
        <Text style={s.filterButtonText}>Filtres</Text>
        {hasActiveFilters && (
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
              <Text style={s.modalTitle}>Filtres Professionnels</Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <X size={22} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView 
              style={s.modalContent} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.scrollContent}
            >
              {/* Pays UEMOA / CEDEAO / CEMAC */}
              <View style={s.section}>
                <Text style={s.sectionLabel}>Pays UEMOA / CEDEAO / CEMAC</Text>
                <View style={s.chipsContainer}>
                  <Pressable 
                    style={[s.chip, !filters.country && s.chipActive]}
                    onPress={() => handleCountryChange(null)}
                  >
                    <Text style={[s.chipText, !filters.country && s.chipTextActive]}>
                      Tous les pays
                    </Text>
                  </Pressable>
                  {ALL_TARGET_COUNTRIES.map((country) => (
                    <Pressable
                      key={country}
                      style={[s.chip, filters.country === country && s.chipActive]}
                      onPress={() => handleCountryChange(country)}
                    >
                      <Text style={[s.chipText, filters.country === country && s.chipTextActive]}>
                        {country}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Catégorie de service */}
              <View style={s.section}>
                <Text style={s.sectionLabel}>Catégorie de service</Text>
                <View style={s.chipsContainer}>
                  <Pressable 
                    style={[s.chip, !filters.category && s.chipActive]}
                    onPress={() => handleCategoryChange(null)}
                  >
                    <Text style={[s.chipText, !filters.category && s.chipTextActive]}>
                      Toutes les catégories
                    </Text>
                  </Pressable>
                  {PROFESSIONAL_CATEGORIES.map((category) => (
                    <Pressable
                      key={category}
                      style={[s.chip, filters.category === category && s.chipActive]}
                      onPress={() => handleCategoryChange(category)}
                    >
                      <Text style={[s.chipText, filters.category === category && s.chipTextActive]}>
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={s.footer}>
              <Pressable style={s.resetButton} onPress={resetFilters}>
                <Text style={s.resetButtonText}>Réinitialiser</Text>
              </Pressable>
              <Pressable style={s.applyButton} onPress={applyFilters}>
                <Text style={s.applyButtonText}>Appliquer les filtres</Text>
              </Pressable>
            </View>
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end"
  },
  filterModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
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
  modalContent: {
    flex: 1,
    paddingHorizontal: 20
  },
  scrollContent: {
    paddingBottom: 20
  },
  section: {
    marginBottom: 32
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8
  },
  chipActive: {
    backgroundColor: "#19715C",
    borderColor: "#19715C"
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151"
  },
  chipTextActive: {
    color: "#FFFFFF"
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9"
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center"
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151"
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#19715C",
    alignItems: "center"
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF"
  }
});