import React, { useEffect } from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import LiquidGlassView from "@/components/ui/LiquidGlassView";

// Utilise un des GIFs fournis
const GIF_SRC = { uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/iiq26c5ie8hzc056gkj5z' };

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/(tabs)"); // page d'accueil après 5s
    }, 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.screen}>
      {/* Carte vitrée + coins arrondis */}
      <LiquidGlassView style={styles.glassCard}>
        <Image
          source={GIF_SRC}
          resizeMode="contain"
          style={styles.gif}
          // Pour Android, forcer rendu hardware pour GIFs lourds
          fadeDuration={0}
        />
      </LiquidGlassView>
    </View>
  );
}

const CARD_RADIUS = 20;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF", // fond blanc demandé
    paddingTop: Platform.select({ ios: 0, android: 0 }),
    alignItems: "center",
    justifyContent: "center",
  },
  glassCard: {
    width: "68%",
    maxWidth: 320,
    aspectRatio: 1.2, // garde une belle carte même si le GIF change de ratio
    borderRadius: CARD_RADIUS,
    overflow: "hidden",

    // "Liquid glass" look sur fond blanc : carte blanche translucide + ombre douce
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(230,232,235,0.9)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  gif: {
    flex: 1,
    width: "100%",
    height: "100%",
    // arrondis conservés par overflow:hidden sur le container
    // Important pour éviter les angles carrés du GIF
  },
});