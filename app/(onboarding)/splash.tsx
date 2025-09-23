import React, { useEffect } from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/hooks/useAppStore";

// Use the GIF from the URL
const GIF_SRC = { uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/iiq26c5ie8hzc056gkj5z' };

export default function SplashScreen() {
  const router = useRouter();
  const { language, hasCompletedOnboarding, isInitialized } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only proceed if store is initialized
      if (!isInitialized) {
        console.log('Store not yet initialized, waiting...');
        return;
      }
      
      console.log('Splash complete, checking onboarding status');
      console.log('Language:', language);
      console.log('Has completed onboarding:', hasCompletedOnboarding);
      
      if (!language || !hasCompletedOnboarding) {
        console.log('Redirecting to language selection');
        router.replace("/(onboarding)/language");
      } else {
        console.log('Redirecting to main app');
        router.replace("/(tabs)/home");
      }
    }, 4000); // 4 seconds as requested
    
    return () => clearTimeout(timer);
  }, [router, language, hasCompletedOnboarding, isInitialized]);

  // If store is initialized but we're still in splash duration, continue showing splash
  useEffect(() => {
    if (isInitialized) {
      // Check immediately if we should skip splash (for returning users)
      const quickCheck = setTimeout(() => {
        if (language && hasCompletedOnboarding) {
          console.log('Returning user detected, skipping to main app');
          router.replace("/(tabs)/home");
        }
      }, 1000); // Quick check after 1 second for returning users
      
      return () => clearTimeout(quickCheck);
    }
  }, [isInitialized, language, hasCompletedOnboarding, router]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.glassCard}>
        <Image
          source={GIF_SRC}
          resizeMode="contain"
          style={styles.gif}
          fadeDuration={0}
        />
      </View>
    </SafeAreaView>
  );
}

const CARD_RADIUS = 20;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  glassCard: {
    width: "68%",
    maxWidth: 320,
    aspectRatio: 1.2,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
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