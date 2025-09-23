import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

export default function HeroSection() {
  return (
    <>
      {/* Carte verte */}
      <View style={styles.hero}>
        <Text style={styles.brandText}>Zima</Text>
        <Text style={styles.heading}>
          Trouvez votre propriété idéale partout en Afrique
        </Text>

        {/* Décors ronds (optionnel) */}
        <View style={[styles.bubble, { top: 20, left: 18, opacity: 0.14, width: 72, height: 72 }]} />
        <View style={[styles.bubble, { top: 24, right: 22, opacity: 0.2, width: 120, height: 120 }]} />
      </View>

      {/* Boutons (hors de la carte) */}
      <View style={styles.chipsRow}>
        <View style={[styles.chip, styles.chipPrimary]}>
          <Text style={[styles.chipText, styles.chipTextPrimary]}>🏠  Biens immobiliers</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>💼  Services</Text>
        </View>
      </View>
    </>
  );
}

const GREEN = "#19715C";

const styles = StyleSheet.create({
  hero: {
    backgroundColor: GREEN,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  brandText: {
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  heading: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 26,
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  chipsRow: {
    marginTop: -12, // effet "sortie de carte"
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  chip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: { elevation: 3 },
      web: { boxShadow: "0 8px 16px rgba(0,0,0,0.06)" } as any,
    }),
  },
  chipText: { color: "#0F172A", fontWeight: "600" },
  chipPrimary: { borderWidth: 2, borderColor: GREEN },
  chipTextPrimary: { color: GREEN },
});