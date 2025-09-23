import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ZimaBrand() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.wordmark}>ZIMA</Text>
    </View>
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