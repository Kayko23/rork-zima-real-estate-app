import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
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
    <Pressable onPress={handlePress} style={styles.wrap}>
      <Text style={styles.wordmark}>ZIMA</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 12,       // un peu d'air en haut
    paddingHorizontal: 16,
    alignItems: "center",
  },
  wordmark: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 34,
    letterSpacing: 2,
    fontWeight: "800",
    color: "#1B4F45",   // vert sombre Zima
  },
});