import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '@/hooks/useSettings';

export default function ActiveCountryBadge() {
  const { country, allowAllCountries } = useSettings();
  const router = useRouter();

  const handlePress = useCallback(() => {
    console.log('[ActiveCountryBadge] Press – navigate to /country/select');
    router.push('/country/select');
  }, [router]);

  if (!country || allowAllCountries) {
    return null;
  }

  return (
    <Pressable
      onPress={handlePress}
      testID="active-country-badge"
      style={({ pressed }) => [
        styles.badge,
        { opacity: pressed ? 0.85 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Pays actif ${country.flag} ${country.name_fr}`}
    >
      <View style={styles.dot} />
      <Text style={styles.text}>Pays actif</Text>
      <Text style={styles.flagText}>{country.flag}</Text>
      <Text style={styles.countryName}>{country.name_fr}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E8F1EE',
    borderWidth: 1,
    borderColor: '#CBE3DB',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0B6B53',
  },
  text: {
    color: '#0B6B53',
    fontWeight: '800',
    fontSize: 12,
  },
  flagText: {
    fontSize: 14,
  },
  countryName: {
    color: '#0B6B53',
    fontWeight: '700',
    fontSize: 12,
  },
});