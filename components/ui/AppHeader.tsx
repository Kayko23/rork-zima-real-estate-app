import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        {/* Logo Zima temporaire en texte */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Zi</Text>
        </View>
        {/* Placeholder d'actions à droite (facultatif) */}
        <View style={styles.placeholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
  },
  inner: {
    height: 56,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: Platform.OS === "web" ? 0 : StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E8EB",
  },
  logoContainer: {
    backgroundColor: "#19715C",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  placeholder: {
    width: 24,
    height: 24,
  },
});