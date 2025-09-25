import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { colors as theme } from '@/theme/tokens';

export type VoyageFilters = {
  priceMin?: number;
  priceMax?: number;
  types?: Array<'hotel' | 'residence' | 'daily'>;
  amenities?: string[];
};

export function VoyageFilterSheet({
  visible,
  onClose,
  initial,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  initial?: VoyageFilters;
  onApply: (f: VoyageFilters) => void;
}) {
  const [f, setF] = useState<VoyageFilters>(initial || { priceMin: 10, priceMax: 500, types: [], amenities: [] });
  if (!visible) return null;

  const toggle = (list: keyof VoyageFilters, value: string) => {
    setF((prev) => {
      const cur = new Set(((prev[list] as string[]) ?? []) as string[]);
      if (cur.has(value)) cur.delete(value); else cur.add(value);
      return { ...prev, [list]: Array.from(cur) };
    });
  };

  return (
    <View style={fs.backdrop} testID="voyage-filter-sheet">
      <View style={fs.sheet}>
        <View style={fs.header}>
          <Text style={fs.title}>Filtres</Text>
          <Pressable onPress={onClose} accessibilityRole="button" testID="close-filter-sheet">
            <X />
          </Pressable>
        </View>

        <Text style={fs.h}>Prix / nuit ou jour</Text>
        <Text style={fs.sub}>Min: ${f.priceMin} — Max: ${f.priceMax}</Text>

        <Text style={fs.h}>Type d’hébergement</Text>
        <View style={fs.chips}>
          {(['hotel', 'residence', 'daily'] as const).map((t) => (
            <Pressable key={t} onPress={() => toggle('types', t)} style={[fs.chip, (f.types || []).includes(t) && fs.chipActive]} testID={`chip-type-${t}`}>
              <Text style={[fs.chipTxt, (f.types || []).includes(t) && fs.chipTxtActive]}>
                {t === 'hotel' ? 'Hôtels' : t === 'residence' ? 'Résidences' : 'Journaliers'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={fs.h}>Équipements</Text>
        <View style={fs.chips}>
          {['wifi', 'piscine', 'parking', 'petit-dej', 'clim'].map((a) => (
            <Pressable key={a} onPress={() => toggle('amenities', a)} style={[fs.chip, (f.amenities || []).includes(a) && fs.chipActive]} testID={`chip-amenity-${a}`}>
              <Text style={[fs.chipTxt, (f.amenities || []).includes(a) && fs.chipTxtActive]}>{a}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={fs.cta} onPress={() => { onApply(f); onClose(); }} testID="btn-apply-filters">
          <Text style={fs.ctaTxt}>Afficher les résultats</Text>
        </Pressable>
      </View>
    </View>
  );
}

const fs = StyleSheet.create({
  backdrop: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  h: { fontWeight: '800', marginTop: 6 },
  sub: { color: '#475569' },
  chips: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 8, marginTop: 6 },
  chip: { height: 34, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: '#E6F5F0', borderWidth: 1, borderColor: theme.primary },
  chipTxt: { fontWeight: '700', color: '#334155' },
  chipTxtActive: { color: theme.primary },
  cta: { marginTop: 8, height: 48, borderRadius: 12, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' },
  ctaTxt: { color: '#fff', fontWeight: '800' },
});
