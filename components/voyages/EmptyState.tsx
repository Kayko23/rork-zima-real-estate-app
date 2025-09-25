import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Binoculars } from 'lucide-react-native';

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <View style={s.wrap} testID="empty-state">
      <Binoculars size={48} />
      <Text style={s.t}>Aucun résultat</Text>
      <Text style={s.s}>Essayez d’ajuster les filtres ou changez de destination.</Text>
      <Pressable style={s.cta} onPress={onReset} testID="btn-reset">
        <Text style={s.ctaTxt}>Réinitialiser</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8, padding: 24 },
  t: { fontWeight: '900', fontSize: 18 },
  s: { textAlign: 'center', color: '#6B7280' },
  cta: { marginTop: 8, paddingHorizontal: 16, height: 44, borderRadius: 12, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  ctaTxt: { color: '#fff', fontWeight: '800' },
});
