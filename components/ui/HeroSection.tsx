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
        {/* Décors ronds (derrière le logo) */}
        <View style={[styles.bubble, { top: 18, left: 16, width: 72, height: 72, opacity: 0.14 }]} />
        <View style={[styles.bubble, { top: 24, right: 18, width: 120, height: 120, opacity: 0.20 }]} />
        
        {/* LOGO CENTRÉ, AU-DESSUS DES DÉCORS */}
        <View style={styles.logoWrap}>
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0cg32vjm033aidki3duv3' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.heading}>
          Trouvez votre propriété idéale partout en Afrique
        </Text>
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
    paddingTop: 18,
    paddingBottom: 24,
    overflow: "hidden",
    position: "relative",
  },
  
  /* ---- CENTRAGE DU LOGO ---- */
  logoWrap: {
    alignItems: "center",          // centre horizontal
    justifyContent: "center",
    marginBottom: 10,
    zIndex: 3,                      // passe au-dessus des bulles
  },
  logo: {
    width: "70%",                   // largeur fluide
    height: 36,                     // hauteur fixe pour un bon rendu
    maxWidth: 200,                  // limite la taille sur grands écrans
  },
  heading: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 24,
    zIndex: 2,                      // au-dessus des bulles, sous le logo
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    zIndex: 1,                      // derrière le logo et le texte
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