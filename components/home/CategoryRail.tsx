import React, { memo } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/theme/tokens';

type Chip = { label: string; value: string; icon?: React.ReactNode };

type CategoryRailProps<T> = {
  title: string;
  subcategories?: Chip[];
  queryKey: (string | number | undefined)[];
  queryFn: () => Promise<T[]>;
  renderItem: (item: T) => React.ReactElement;
  onSeeAll: () => void;
  onPickSubcategory?: (chip: Chip) => void;
};

const { width } = Dimensions.get('window');
const CARD_W = Math.min(280, Math.round(width * 0.72));
const SPACING = 16;

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.h2}>{title}</Text>
      <Pressable onPress={onSeeAll} hitSlop={8} style={styles.seeAll}>
        <Text style={styles.seeAllText}>Voir tout</Text>
        <ChevronRight size={16} color={colors.primary} />
      </Pressable>
    </View>
  );
}

function ChipsRow({
  chips,
  onPress,
}: {
  chips: Chip[];
  onPress?: (c: Chip) => void;
}) {
  if (!chips?.length) return null;
  return (
    <FlatList
      horizontal
      data={chips}
      keyExtractor={(c) => c.value}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: SPACING }}
      renderItem={({ item }) => (
        <Pressable onPress={() => onPress?.(item)} style={styles.chip}>
          {item.icon}
          <Text style={styles.chipText}>{item.label}</Text>
        </Pressable>
      )}
    />
  );
}

function Rail<T>({
  title,
  subcategories,
  queryKey,
  queryFn,
  renderItem,
  onSeeAll,
  onPickSubcategory,
}: CategoryRailProps<T>) {
  const { data = [], isLoading, isError } = useQuery({ 
    queryKey, 
    queryFn,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <View style={styles.section}>
        <SectionHeader title={title} onSeeAll={onSeeAll} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.section}>
        <SectionHeader title={title} onSeeAll={onSeeAll} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Erreur de chargement</Text>
        </View>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.section}>
        <SectionHeader title={title} onSeeAll={onSeeAll} />
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>Aucun résultat</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <SectionHeader title={title} onSeeAll={onSeeAll} />
      <ChipsRow chips={subcategories ?? []} onPress={onPickSubcategory} />

      <FlatList
        horizontal
        data={data}
        keyExtractor={(_, i) => `${queryKey.join('-')}-${i}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
        renderItem={({ item }) => (
          <View style={{ width: CARD_W }}>{renderItem(item)}</View>
        )}
      />
    </View>
  );
}

export default memo(Rail) as typeof Rail;

const styles = StyleSheet.create({
  section: { gap: 12, marginTop: 18 },
  header: {
    paddingHorizontal: SPACING,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h2: { fontSize: 22, fontWeight: '800', color: colors.text },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { fontWeight: '700', color: colors.primary, fontSize: 14 },
  chip: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: '#F8FAFC',
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  chipText: { fontWeight: '700', color: colors.sub, fontSize: 13 },
  loadingContainer: {
    paddingHorizontal: SPACING,
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: { color: colors.sub, fontSize: 14 },
  errorText: { color: colors.danger, fontSize: 14 },
  emptyText: { color: colors.sub, fontSize: 14, fontStyle: 'italic' },
});
