import React, { useState } from 'react';
import { ScrollView, Text, Pressable, StyleSheet, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Car, FerrisWheel, Crown, ShoppingCart } from 'lucide-react-native';

export type VehicleSubcategory = 'vip' | 'driver' | 'rent' | 'sale';

const chips: { label: string; value: VehicleSubcategory; icon: any }[] = [
  { label: 'VIP', value: 'vip', icon: Crown },
  { label: 'Chauffeurs', value: 'driver', icon: FerrisWheel },
  { label: 'Location', value: 'rent', icon: Car },
  { label: 'Vente', value: 'sale', icon: ShoppingCart },
];

export default function VehiclesChips() {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState<VehicleSubcategory | null>(null);

  const handleSelect = (value: VehicleSubcategory) => {
    setActiveKey(value);
    router.push(`/vehicles?type=${value}` as any);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      testID="vehicles-chips-scroll"
    >
      {chips.map((chip) => {
        const Icon = chip.icon;
        const isActive = activeKey === chip.value;

        return (
          <Pressable
            key={chip.value}
            onPress={() => handleSelect(chip.value)}
            android_ripple={{ color: 'rgba(11,61,47,0.08)', borderless: false }}
            style={({ pressed }) => [
              styles.chip,
              isActive && styles.chipActive,
              {
                transform: [{ scale: pressed ? 0.96 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={chip.label}
            testID={`vehicles-chip-${chip.value}`}
          >
            {isActive && <View style={styles.activeGlow} />}
            <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
              <Icon size={18} color={isActive ? '#fff' : '#0E4D3A'} strokeWidth={2.5} />
            </View>
            <Text numberOfLines={1} style={[styles.chipText, isActive && styles.chipTextActive]}>
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
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8F5F1',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0E4D3A',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chipActive: {
    backgroundColor: '#0E4D3A',
    borderColor: '#0E4D3A',
    ...Platform.select({
      ios: {
        shadowColor: '#0E4D3A',
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  activeGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9F6',
    borderWidth: 1.5,
    borderColor: '#D4EDE4',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  chipText: {
    fontWeight: '700',
    fontSize: 15,
    color: '#0E4D3A',
    letterSpacing: 0.2,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
