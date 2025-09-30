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
    let timer: NodeJS.Timeout;
    
    const navigate = () => {
      if (!mounted) return;
      
      try {
        if (isAuthenticated) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(onboarding)/splash");
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };

    if (!isLoading) {
      // Small delay to ensure everything is ready
      timer = setTimeout(navigate, 100);
    } else {
      // Set a timeout to prevent infinite loading
      timer = setTimeout(() => {
        if (mounted) {
          console.warn('Navigation timeout, proceeding with default route');
          navigate();
        }
      }, 1500);
    }
    
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
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