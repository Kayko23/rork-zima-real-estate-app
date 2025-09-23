import React, { useEffect } from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "@/hooks/useAppStore";

// Utilise l'animation GIF fournie
const GIF_SRC = { uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/gvkbtqv7ge5m1gg7zl5o5' };

interface SplashScreenProps {
  onComplete?: () => void;
  minDuration?: number;
  maxDuration?: number;
}

export default function SplashScreen({ onComplete, minDuration = 5000, maxDuration = 5000 }: SplashScreenProps) {
  const router = useRouter();
  const appStore = useApp();
  const language = appStore?.language || null;

  useEffect(() => {
    const t = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        // Si pas de callback onComplete, on gère la navigation ici
        if (!language) {
          router.replace("/(onboarding)/language");
        } else {
          router.replace("/(tabs)");
        }
      }
    }, maxDuration);
    return () => clearTimeout(t);
  }, [onComplete, maxDuration, language, router]);

  return (
    <View style={styles.screen}>
      {/* Carte avec coins arrondis et effet liquid glass */}
      <View style={styles.glassCard}>
        <Image
          source={GIF_SRC}
          resizeMode="contain"
          style={styles.gif}
          // Pour Android, forcer rendu hardware pour GIFs lourds
          fadeDuration={0}
        />
      </View>
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

    // "Liquid glass" look sur fond blanc : carte blanche translucide avec bords blancs
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.12,
        shadowRadius: 32,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: "0 16px 32px rgba(0,0,0,0.12)",
        backdropFilter: "blur(10px)",
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