import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Always start with splash screen
    const timer = setTimeout(() => {
      router.replace("/(onboarding)/splash");
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});