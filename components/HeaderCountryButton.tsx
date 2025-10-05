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
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  flag: {
    fontSize: 20,
  },
});
