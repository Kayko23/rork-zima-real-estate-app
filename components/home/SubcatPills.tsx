import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme/tokens';

export type Pill = { key: string; label: string };

export default function SubcatPills({
  data,
  activeKey,
  onChange,
  contentContainerStyle,
}: {
  data: Pill[];
  activeKey: string;
  onChange: (key: string) => void;
  contentContainerStyle?: ViewStyle;
}) {
  if (!data?.length) return null;

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(i) => i.key}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[{ paddingHorizontal: 16, gap: 10, paddingVertical: 8 }, contentContainerStyle]}
      renderItem={({ item }) => {
        const active = item.key === activeKey;
        return (
          <TouchableOpacity
            onPress={() => onChange(item.key)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: '#fff',
  },
  pillActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 14,
    color: colors.sub,
    fontWeight: '600' as const,
  },
  pillTextActive: {
    fontWeight: '700' as const,
    color: colors.primary,
  },
});
