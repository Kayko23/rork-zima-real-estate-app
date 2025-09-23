import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useApp } from "@/hooks/useAppStore";

// Utilise l'animation GIF fournie
const GIF_SRC = { uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/czyibo169zdm0kxik7zdr' };

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
        // Après le callback, on navigue selon la langue
        setTimeout(() => {
          if (!language) {
            router.replace("/(onboarding)/language");
          } else {
            router.replace("/(tabs)");
          }
        }, 100);
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
          contentFit="contain"
          style={styles.gif}
          transition={0}
          cachePolicy="none"
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
    backgroundColor: "rgba(255,255,255,0.90)",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 40,
      },
      android: {
        elevation: 15,
      },
      web: {
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        backdropFilter: "blur(12px)",
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