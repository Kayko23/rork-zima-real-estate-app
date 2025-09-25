import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export type VoyageCategory = 'all' | 'hotel' | 'residence' | 'daily';

export function VoyageCategoryPills({ selected, onSelect }: { selected: VoyageCategory; onSelect: (t: VoyageCategory) => void }) {
  return (
    <View style={s.row} testID="voyage-category-pills">
      {(['all', 'hotel', 'residence', 'daily'] as const).map((t) => (
        <Pressable key={t} onPress={() => onSelect(t)} style={[s.chip, selected === t && s.active]} testID={`cat-${t}`}>
          <Text style={[s.txt, selected === t && s.txtActive]}>
            {t === 'all' ? 'Tous' : t === 'hotel' ? 'Hôtels' : t === 'residence' ? 'Résidences' : 'Journaliers'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' as const },
  chip: { height: 34, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: '#E6F5F0', borderWidth: 1, borderColor: '#0E5A46' },
  txt: { fontWeight: '700', color: '#334155' },
  txtActive: { color: '#0E5A46' },
});
