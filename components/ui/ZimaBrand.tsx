import React from "react";
import { Text, StyleSheet, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function ZimaBrand({ onPress }: { onPress?: () => void }) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(tabs)/home');
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.wrap} hitSlop={10} accessibilityRole="button" accessibilityLabel="Zima - Accueil" testID="brand-logo">
      <Text style={styles.wordmark}>ZIMA</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  wordmark: {
    textAlign: "center",
    fontSize: 38,
    letterSpacing: 3,
    fontWeight: "900",
    color: "#0B1720",
    ...Platform.select({
      ios: { textShadowColor: "rgba(0,0,0,0.06)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
      android: {},
      web: {},
    }),
  },
});