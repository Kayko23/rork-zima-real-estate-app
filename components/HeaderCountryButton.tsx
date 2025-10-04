import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '@/hooks/useSettings';
import { COUNTRIES } from '@/data/countries';

export default function HeaderCountryButton() {
  const { country } = useSettings();
  const router = useRouter();

  const flag = useMemo(() => {
    if (country?.code) {
      const c = COUNTRIES.find((x) => x.code === country.code);
      return c?.flag ?? '🌍';
    }
    return '🌍';
  }, [country?.code]);

  return (
    <Pressable
      testID="header-country-button"
      accessibilityRole="button"
      onPress={() => router.push('/country/select' as const)}
      style={styles.button}
    >
      <Text style={styles.flag}>{flag}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#ffffffaa',
  },
  flag: {
    fontSize: 18,
  },
});
