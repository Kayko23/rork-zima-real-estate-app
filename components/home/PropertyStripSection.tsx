import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import SubcatPills, { Pill } from './SubcatPills';
import PropertyCard, { PropertyItem } from '@/components/cards/PropertyCard';
import { colors } from '@/theme/tokens';

export default function PropertyStripSection({
  title,
  pills,
  items,
  initialSubcatKey,
  onSeeAll,
  onOpenItem,
}: {
  title: string;
  pills: Pill[];
  items: PropertyItem[];
  initialSubcatKey: string;
  onSeeAll: (activeSubcatKey: string) => void;
  onOpenItem: (item: PropertyItem) => void;
}) {
  const [activeKey, setActiveKey] = useState<string>(initialSubcatKey);

  const filtered = useMemo(
    () => items.filter((i) => (i as any).subcategory === activeKey),
    [items, activeKey]
  );

  const handleChange = useCallback((k: string) => setActiveKey(k), []);

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => onSeeAll(activeKey)}>
          <Text style={styles.seeAll}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <SubcatPills data={pills} activeKey={activeKey} onChange={handleChange} />

      <FlatList
        horizontal
        data={filtered}
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
        initialNumToRender={6}
        windowSize={5}
        removeClippedSubviews
        renderItem={({ item }) => (
          <View style={{ width: 300 }}>
            <PropertyCard item={item} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>Aucun résultat</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 32, marginBottom: 16 },
  headerRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 22, fontWeight: '800' as const, color: colors.text },
  seeAll: { fontSize: 14, textDecorationLine: 'underline', color: colors.primary, fontWeight: '700' as const },
  emptyContainer: { paddingHorizontal: 16, paddingVertical: 40 },
  empty: { paddingHorizontal: 16, color: colors.sub, paddingVertical: 12 },
});
