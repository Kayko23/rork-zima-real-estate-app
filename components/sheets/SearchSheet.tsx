import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet from '@/components/BottomSheet';
import type { Section, TripsSearch } from '@/lib/search-types';

type Props = {
  section: Section;
  initial?: Partial<TripsSearch>;
  onApply: (values: Partial<TripsSearch>) => void;
  visible: boolean;
  onClose: () => void;
};

export default function SearchSheet({ section, initial, onApply, visible, onClose }: Props) {
  const [destination, setDestination] = useState<string>(initial?.destination ?? '');
  const [startDate, setStartDate] = useState<string>(initial?.startDate ?? '');
  const [endDate, setEndDate] = useState<string>(initial?.endDate ?? '');
  const [guests, setGuests] = useState<string>(String(initial?.guests ?? 1));
  const isTrips = useMemo(() => section === 'trips', [section]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={s.header} testID="searchSheet.header">
        <Text style={s.title}>Recherche</Text>
      </View>
      {isTrips && (
        <View style={s.group} testID="searchSheet.trips">
          <Text style={s.label}>Destination</Text>
          <TextInput
            placeholder="Ville, pays…"
            value={destination}
            onChangeText={setDestination}
            style={s.input}
            testID="searchSheet.destination"
          />
          <View style={s.row}>
            <View style={s.col}>
              <Text style={s.label}>Arrivée</Text>
              <TextInput
                placeholder="AAAA-MM-JJ"
                value={startDate}
                onChangeText={setStartDate}
                style={s.input}
                testID="searchSheet.startDate"
              />
            </View>
            <View style={s.col}>
              <Text style={s.label}>Départ</Text>
              <TextInput
                placeholder="AAAA-MM-JJ"
                value={endDate}
                onChangeText={setEndDate}
                style={s.input}
                testID="searchSheet.endDate"
              />
            </View>
          </View>
          <View style={s.mt12}>
            <Text style={s.label}>Voyageurs</Text>
            <TextInput
              keyboardType="number-pad"
              value={guests}
              onChangeText={setGuests}
              style={s.input}
              testID="searchSheet.guests"
            />
          </View>
        </View>
      )}
      <View style={s.footer} testID="searchSheet.footer">
        <TouchableOpacity
          style={[s.btn, s.btnGhost]}
          onPress={() => {
            setDestination('');
            setStartDate('');
            setEndDate('');
            setGuests('1');
          }}
          testID="searchSheet.reset"
        >
          <Text style={[s.btnTxt, { color: '#111827' }]}>Réinitialiser</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.btn, s.btnPrimary]}
          onPress={() => {
            try {
              onApply({
                destination: destination || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                guests: Number(guests || '1'),
              });
              onClose();
            } catch (e) {
              console.log('SearchSheet apply error', e);
            }
          }}
          testID="searchSheet.apply"
        >
          <Text style={[s.btnTxt, { color: '#fff' }]}>Appliquer</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontWeight: '800', fontSize: 18, color: '#0B1220' },
  group: { paddingHorizontal: 16, paddingTop: 4 },
  label: { fontWeight: '700', marginBottom: 6, color: '#111827' },
  input: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 12, fontWeight: '600', color: '#111827' },
  row: { flexDirection: 'row', gap: 12, marginTop: 12 },
  col: { flex: 1 },
  footer: { padding: 16, flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnGhost: { backgroundColor: '#E5E7EB' },
  btnPrimary: { backgroundColor: '#0F5132' },
  btnTxt: { fontWeight: '800' },
  mt12: { marginTop: 12 },
});