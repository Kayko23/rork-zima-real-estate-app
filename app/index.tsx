import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/hooks/useSession";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    let mounted = true;
    
    const navigate = () => {
      if (!mounted) return;
      
      if (isAuthenticated) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(onboarding)/splash");
      }
    };

    if (!isLoading) {
      navigate();
    } else {
      // Very short timeout to prevent hydration issues
      const timer = setTimeout(() => {
        if (mounted) {
          navigate();
        }
      }, 500);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
    
    return () => {
      mounted = false;
    };
  }, [router, isAuthenticated, isLoading]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#0B3C2F" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});