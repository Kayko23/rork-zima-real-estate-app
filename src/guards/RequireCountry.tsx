import React, { memo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '@/hooks/useSettings';

function RequireCountryInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { country, allowAllCountries } = useSettings();

  const goSelect = useCallback(() => {
    try {
      console.log('[RequireCountry] Navigating to /country/select');
      router.push('/country/select');
    } catch (e) {
      console.log('[RequireCountry] Navigation error', e);
    }
  }, [router]);

  if (allowAllCountries || country?.code) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container} testID="requireCountry-guard">
      <Text style={styles.title} testID="requireCountry-title">Choisissez un pays</Text>
      <Text style={styles.subtitle} testID="requireCountry-subtitle">
        Sélectionnez un pays pour voir des résultats pertinents.
      </Text>
      <Pressable onPress={goSelect} style={styles.cta} testID="requireCountry-cta">
        <Text style={styles.ctaText}>Sélectionner</Text>
      </Pressable>
    </View>
  );
}

export default memo(RequireCountryInner);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { opacity: 0.7, textAlign: 'center', marginBottom: 20 },
  cta: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#0E5A43', borderRadius: 12 },
  ctaText: { color: '#fff', fontWeight: '700' },
});
