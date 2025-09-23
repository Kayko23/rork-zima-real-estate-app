import React from "react";
import { View, Text, Image, StyleSheet, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";

const GREEN = "#19715C";

export default function HeroSection() {
  const router = useRouter();

  return (
    <>
      {/* Carte verte (sans barre supérieure) */}
      <View style={styles.hero}>
        {/* Logo complet blanc au centre */}
        <Image
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/alk0nnhulsb6t76wytqya' }}
          style={styles.brand}
          resizeMode="contain"
        />

        <Text style={styles.heading}>
          Trouvez votre propriété idéale partout en Afrique
        </Text>

        {/* Décors ronds (optionnels) */}
        <View style={[styles.bubble, { top: 18, left: 16, width: 72, height: 72, opacity: 0.14 }]} />
        <View style={[styles.bubble, { top: 24, right: 18, width: 120, height: 120, opacity: 0.20 }]} />
      </View>

      {/* Boutons en dehors de la carte */}
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
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
  },
  brand: {
    alignSelf: "center",
    height: 48,
    width: 200,
    marginBottom: 16,
    backgroundColor: "transparent",
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