import React, { useState } from 'react';
import { ScrollView, Text, Pressable, StyleSheet, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, ShieldCheck, Building2, Users, GraduationCap } from 'lucide-react-native';

type ResidentialSubcategory = 
  | 'single_family'
  | 'gated_community'
  | 'multifamily'
  | 'flatshare'
  | 'student_private';

const chips: { label: string; value: ResidentialSubcategory; icon: any }[] = [
  { label: 'Maisons individuelles', value: 'single_family', icon: Home },
  { label: 'Cités résidentielles', value: 'gated_community', icon: ShieldCheck },
  { label: 'Immeubles & copro', value: 'multifamily', icon: Building2 },
  { label: 'Colocation', value: 'flatshare', icon: Users },
  { label: 'Logements étudiants', value: 'student_private', icon: GraduationCap },
];

export default function ResidentialChips() {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState<ResidentialSubcategory | null>(null);

  const handleSelect = (value: ResidentialSubcategory) => {
    setActiveKey(value);
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
      {chips.map((chip) => {
        const Icon = chip.icon;
        const isActive = activeKey === chip.value;
        const bg = isActive ? '#0b3d2f' : 'rgba(255,255,255,0.82)';
        const fg = isActive ? '#ffffff' : '#0b3d2f';
        const ring = isActive ? 'rgba(11,61,47,0.42)' : 'rgba(11,61,47,0.18)';
        
        return (
          <Pressable
            key={chip.value}
            onPress={() => handleSelect(chip.value)}
            android_ripple={{ color: 'rgba(11,61,47,0.08)', borderless: false }}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: bg,
                borderColor: ring,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={chip.label}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(11,61,47,0.06)',
                  borderColor: isActive ? 'rgba(255,255,255,0.35)' : 'rgba(11,61,47,0.12)',
                },
              ]}
            >
              <Icon size={16} color={fg} strokeWidth={2.5} />
            </View>
            <Text numberOfLines={1} style={[styles.chipText, { color: fg }]}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    gap: 10,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipText: {
    fontWeight: '800',
    fontSize: 14,
  },
});
