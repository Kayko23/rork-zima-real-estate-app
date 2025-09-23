import React from "react";
import { View, StyleSheet } from "react-native";
import SplashScreen from "@/components/ui/SplashScreen";

export default function Index() {
  return (
    <View style={styles.container}>
      <SplashScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});