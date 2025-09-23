import React, { useEffect } from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "@/hooks/useAppStore";
import LiquidGlassView from "@/components/ui/LiquidGlassView";

const GIF_SRC = require("@/assets/images/animation_sync_Default_r2f0nc64b.gif");

export default function SplashScreen() {
  const router = useRouter();
  const { language } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!language) {
        router.replace("/(onboarding)/language");
      } else {
        router.replace("/home");
      }
    }, 4000); // 4 secondes comme demandé

    return () => clearTimeout(timer);
  }, [router, language]);

  return (
    <View style={styles.screen}>
      <LiquidGlassView style={styles.glassCard}>
        <Image
          source={GIF_SRC}
          resizeMode="contain"
          style={styles.gif}
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
    backgroundColor: "#FFFFFF", // fond blanc
    alignItems: "center",
    justifyContent: "center",
  },
  glassCard: {
    width: "68%",
    maxWidth: 320,
    aspectRatio: 1.2,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    // Bords blancs comme demandé
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 2,
    borderColor: "#FFFFFF",
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
  },
});