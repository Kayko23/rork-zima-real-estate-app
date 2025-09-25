import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { X, Calendar, Users, MapPin } from 'lucide-react-native';
import { colors as theme } from '@/theme/tokens';
import type { VoyageQuery } from './VoyageSearchBar';

export function VoyageSearchSheet({
  visible,
  onClose,
  initial,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  initial?: VoyageQuery;
  onSubmit: (q: VoyageQuery) => void;
}) {
  const [q, setQ] = useState<VoyageQuery>(initial || { type: 'all' });
  if (!visible) return null;

  return (
    <View style={m.backdrop} testID="voyage-search-sheet">
      <View style={m.sheet}>
        <View style={m.header}>
          <Text style={m.title}>Où voulez-vous aller ?</Text>
          <Pressable onPress={onClose} accessibilityRole="button" testID="close-search-sheet">
            <X />
          </Pressable>
        </View>

        <Text style={m.label}>Destination</Text>
        <View style={m.row}>
          <MapPin size={18} />
          <TextInput
            placeholder="Rechercher une ville / hôtel"
            style={m.input}
            value={q.destination?.label ?? ''}
            onChangeText={(t) => setQ((prev) => ({ ...prev, destination: { label: t } }))}
            testID="input-destination"
          />
        </View>

        <Text style={m.label}>Dates</Text>
        <View style={m.twoCols}>
          <Pressable style={[m.row, m.flex1]} onPress={() => {}} testID="btn-date-from">
            <Calendar size={18} />
            <Text style={m.placeholder}>{q.dateFrom ? q.dateFrom : 'Arrivée'}</Text>
          </Pressable>
          <Pressable style={[m.row, m.flex1]} onPress={() => {}} testID="btn-date-to">
            <Calendar size={18} />
            <Text style={m.placeholder}>{q.dateTo ? q.dateTo : 'Départ'}</Text>
          </Pressable>
        </View>

        <Text style={m.label}>Voyageurs</Text>
        <View style={m.row}>
          <Users size={18} />
          <TextInput
            keyboardType="number-pad"
            placeholder="Nombre"
            style={m.input}
            value={q.guests ? String(q.guests) : ''}
            onChangeText={(t) => setQ((prev) => ({ ...prev, guests: Number(t || '0') }))}
            testID="input-guests"
          />
        </View>

        <View style={m.chipsRow}>
          {(['all', 'hotel', 'residence', 'daily'] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setQ((prev) => ({ ...prev, type: t }))}
              style={[m.chip, q.type === t && m.chipActive]}
              testID={`chip-type-${t}`}
            >
              <Text style={[m.chipTxt, q.type === t && m.chipTxtActive]}>
                {t === 'all' ? 'Tous' : t === 'hotel' ? 'Hôtels' : t === 'residence' ? 'Résidences' : 'Journaliers'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={m.cta} onPress={() => { onSubmit(q); onClose(); }} testID="btn-submit-search">
          <Text style={m.ctaTxt}>Rechercher</Text>
        </Pressable>
      </View>
    </View>
  );
}

const m = StyleSheet.create({
  backdrop: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  label: { marginTop: 4, fontWeight: '800', color: theme.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, height: 48 },
  input: { flex: 1 },
  placeholder: { color: '#475569', fontWeight: '700' },
  chip: { height: 36, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: '#E6F5F0', borderWidth: 1, borderColor: '#0E5A46' },
  chipTxt: { fontWeight: '700', color: '#334155' },
  chipTxtActive: { color: '#0E5A46' },
  twoCols: { flexDirection: 'row', gap: 8 },
  flex1: { flex: 1 },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  cta: { marginTop: 10, height: 48, borderRadius: 12, backgroundColor: '#0E5A46', alignItems: 'center', justifyContent: 'center' },
  ctaTxt: { color: '#fff', fontWeight: '800' },
});
