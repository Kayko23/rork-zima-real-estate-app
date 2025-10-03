import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Store, Utensils, Warehouse } from 'lucide-react-native';
import { COMMERCIAL_SUBS, CommercialSubKey } from '@/constants/commercial';

type Props = {
  value?: CommercialSubKey;
  onChange: (key: CommercialSubKey) => void;
};

const iconMap = {
  store: Store,
  utensils: Utensils,
  warehouse: Warehouse,
};

export default function CommercialSubPicker({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Type de commerce</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {COMMERCIAL_SUBS.map((item) => {
          const isActive = value === item.key;
          const IconComponent = iconMap[item.icon as keyof typeof iconMap];

          return (
            <Pressable
              key={item.key}
              onPress={() => onChange(item.key)}
              style={[styles.chip, isActive && styles.chipActive]}
              testID={`commercial-sub-${item.key}`}
            >
              <View
                style={[
                  styles.iconCircle,
                  isActive ? styles.iconCircleActive : styles.iconCircleInactive,
                ]}
              >
                <IconComponent
                  size={16}
                  color={isActive ? '#fff' : '#0b3d2f'}
                />
              </View>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    color: '#1f2937',
  },
  scrollContent: {
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(11,61,47,0.18)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  chipActive: {
    backgroundColor: '#0b3d2f',
    borderColor: 'rgba(11,61,47,0.42)',
  },
  chipText: {
    color: '#0b3d2f',
    fontWeight: '800',
    fontSize: 15,
  },
  chipTextActive: {
    color: '#ffffff',
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconCircleActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.35)',
  },
  iconCircleInactive: {
    backgroundColor: 'rgba(11,61,47,0.06)',
    borderColor: 'rgba(11,61,47,0.12)',
  },
});
