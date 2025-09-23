import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Platform, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/hooks/useAppStore";
import LiquidGlassView from "@/components/ui/LiquidGlassView";

export default function SplashScreen() {
  const router = useRouter();
  const { language } = useApp();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (!language) {
        router.replace("/(onboarding)/language");
      } else {
        router.replace("/(tabs)/home");
      }
    }, 4000); // 4 secondes comme demandé

    return () => clearTimeout(timer);
  }, [router, language, scaleAnim, opacityAnim]);

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View 
        style={[
          styles.animatedContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }
        ]}
      >
        <LiquidGlassView style={styles.glassCard}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Zi</Text>
            <Text style={styles.brandText}>zima</Text>
            <Text style={styles.tagline}>l&apos;Afrique à portée de main</Text>
          </View>
        </LiquidGlassView>
      </Animated.View>
    </SafeAreaView>
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
  animatedContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#19715C",
    letterSpacing: -2,
  },
  brandText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#19715C",
    marginTop: -8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 12,
    textAlign: "center",
    fontWeight: "500",
  },
});