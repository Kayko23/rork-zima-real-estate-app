import React from "react";
import { View, Text, StyleSheet, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";

const GREEN = "#19715C";

export default function HeroSection() {
  const router = useRouter();

  return (
    <>
      {/* Carte verte avec logo intégré */}
      <View style={styles.hero}>
        {/* Décors ronds en arrière-plan */}
        <View style={[styles.bubble, { top: 20, left: 20, width: 60, height: 60, opacity: 0.1 }]} />
        <View style={[styles.bubble, { top: 30, right: 15, width: 100, height: 100, opacity: 0.15 }]} />
        
        {/* Logo ZIMA en texte stylisé */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>zi</Text>
            <View style={styles.logoUnderline} />
          </View>
          <Text style={styles.brandText}>zima</Text>
          <Text style={styles.tagline}>Trouvez la qualité des services</Text>
        </View>

        <Text style={styles.heading}>
          Trouvez votre propriété idéale partout{"\n"}en Afrique
        </Text>
      </View>

      {/* Chips en dessous de la carte */}
      <View style={styles.chipsRow}>
        <Pressable 
          style={[styles.chip, styles.chipPrimary]} 
          onPress={() => router.push("/(tabs)/categories")}
        >
          <Text style={[styles.chipText, styles.chipTextPrimary]}>🏠  Biens immobiliers</Text>
        </Pressable>
        <Pressable 
          style={styles.chip} 
          onPress={() => router.push("/services")}
        >
          <Text style={styles.chipText}>💼  Services</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: GREEN,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    overflow: "hidden",
    position: "relative",
    minHeight: 180,
  },
  
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  
  /* Logo ZIMA stylisé */
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
    zIndex: 3,
  },
  logoWrap: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    fontStyle: "italic",
  },
  logoUnderline: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  brandText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  tagline: {
    fontSize: 11,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 2,
    fontStyle: "italic",
  },
  
  heading: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 24,
    zIndex: 2,
  },
  
  chipsRow: {
    marginTop: -12,
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