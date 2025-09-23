import React from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        {/* Icône "Zi" (pas le gif) */}
        <Image
          source={require("@/assets/images/customcolor_icon_transparent_background.png")}
          style={styles.logoMark}
          resizeMode="contain"
        />
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
  logoMark: {
    height: 24,
    width: 56, // ratio large pour bien voir le "Zi"
  },
  placeholder: {
    width: 24,
    height: 24,
  },
});