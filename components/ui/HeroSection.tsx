import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

export default function HeroSection() {
  return (
    <>
      {/* Carte verte */}
      <View style={styles.hero}>
        {/* Logo temporaire en texte */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>zima</Text>
          <Text style={styles.brandSubtext}>l&apos;Afrique à portée de main</Text>
        </View>
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
  brandContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  brandText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  brandSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 2,
  },
  heading: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 26,
    marginTop: 8,
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