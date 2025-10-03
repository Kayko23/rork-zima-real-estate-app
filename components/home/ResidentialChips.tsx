import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius } from '@/theme/tokens';

type ResidentialSubcategory = 
  | 'single_family'
  | 'gated_community'
  | 'multifamily'
  | 'flatshare'
  | 'student_private';

const chips: { label: string; value: ResidentialSubcategory }[] = [
  { label: 'Maisons individuelles', value: 'single_family' },
  { label: 'Cités résidentielles', value: 'gated_community' },
  { label: 'Immeubles & copro', value: 'multifamily' },
  { label: 'Colocation', value: 'flatshare' },
  { label: 'Logements étudiants', value: 'student_private' },
];

export default function ResidentialChips() {
  const router = useRouter();

  const handleSelect = (value: ResidentialSubcategory) => {
    router.push({
      pathname: '/(tabs)/properties',
      params: { category: 'residentiel', subcategory: value }
    } as any);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {chips.map((chip) => (
        <TouchableOpacity
          key={chip.value}
          onPress={() => handleSelect(chip.value)}
          style={styles.chip}
          activeOpacity={0.7}
        >
          <Text style={styles.chipText}>{chip.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  chipText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
