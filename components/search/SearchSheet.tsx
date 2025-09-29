import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import BottomSheet from '../BottomSheet';
import CityPicker from '../CityPicker';
import DateRangeSheet from '../DateRangeSheet';
import { CalendarDays, Users, MapPin, X } from 'lucide-react-native';
import { ALL_TARGET_COUNTRIES } from '@/data/regions';

type Mode = 'biens' | 'services' | 'voyages';

export type SearchSheetValue =
  | { mode: 'biens'; where?: string; dates?: string; guests?: number }
  | { mode: 'services'; where?: string; category?: string }
  | { mode: 'voyages'; destination?: string; dates?: string; guests?: number };

type Props = {
  open: boolean;
  mode: Mode;
  initial?: Partial<SearchSheetValue>;
  onClose: () => void;
  onApply: (v: SearchSheetValue) => void;
};

const PRO_CATEGORIES = [
  'Agent immobilier',
  'Agence immobilière',
  'Gestionnaire de biens',
  'Réservation hôtel',
  'Réservation résidence',
  'Gestionnaire d\'espace évènementiel',
];

export default function SearchSheet({ open, mode, initial, onClose, onApply }: Props) {
  const [where, setWhere] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [dates, setDates] = useState<string | undefined>(undefined);
  const [guests, setGuests] = useState<number>(mode === 'voyages' ? 2 : 1);
  const [dateOpen, setDateOpen] = useState(false);

  const allCountries = useMemo(() => {
    return ALL_TARGET_COUNTRIES;
  }, []);

  const isCountry = ALL_TARGET_COUNTRIES.includes(where);

  const submit = () => {
    if (mode === 'biens') {
      onApply({ mode, where: where || undefined, dates, guests });
    } else if (mode === 'services') {
      onApply({ mode, where: where || undefined, category });
    } else {
      onApply({ mode, destination: where || undefined, dates, guests });
    }
    onClose();
  };

  return (
    <>
      <BottomSheet visible={open} onClose={onClose}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Où ?</Text>

          {/* Champ principal */}
          <View style={styles.inputRow}>
            <MapPin size={18} color="#475569" />
            <TextInput
              style={styles.input}
              placeholder={mode === 'services' ? 'Rechercher une ville ou un pays' : 'Rechercher une destination'}
              placeholderTextColor="#475569"
              value={where}
              onChangeText={setWhere}
            />
            {!!where && (
              <Pressable onPress={() => setWhere('')}>
                <X size={18} color="#475569" />
              </Pressable>
            )}
          </View>

          {/* CityPicker si un pays est sélectionné */}
          {isCountry && (
            <View style={styles.cityPickerContainer}>
              <CityPicker
                country={where}
                onSelect={(city) => setWhere(`${city}, ${where}`)}
              />
            </View>
          )}

          {/* Suggestions rapides pays régionaux */}
          <Text style={styles.section}>Pays UEMOA / CEDEAO / CEMAC</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalChips}
          >
            {allCountries.map((c) => (
              <Pressable key={c} onPress={() => setWhere(c)} style={[styles.chip, where === c && styles.chipActive]}>
                <Text style={[styles.chipTxt, where === c && styles.chipTxtActive]}>{c}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Lignes spécifiques par mode */}
          {mode !== 'services' && (
            <>
              <Text style={styles.section}>Dates</Text>
              <Pressable onPress={() => setDateOpen(true)} style={styles.rowBtn}>
                <CalendarDays size={18} color="#475569" />
                <Text style={styles.rowBtnTxt}>{dates ?? 'Ajouter des dates'}</Text>
              </Pressable>

              <Text style={styles.section}>Voyageurs</Text>
              <View style={styles.guestControls}>
                <Pressable 
                  onPress={() => setGuests(Math.max(1, (guests ?? 1) - 1))} 
                  style={[styles.guestBtn, (guests ?? 1) <= 1 && styles.guestBtnDisabled]}
                  disabled={(guests ?? 1) <= 1}
                >
                  <Text style={[styles.guestBtnText, (guests ?? 1) <= 1 && styles.guestBtnTextDisabled]}>−</Text>
                </Pressable>
                <View style={styles.guestDisplay}>
                  <Users size={18} color="#475569" />
                  <Text style={styles.guestText}>{guests} voyageur{(guests ?? 1) > 1 ? 's' : ''}</Text>
                </View>
                <Pressable 
                  onPress={() => setGuests((guests ?? 1) + 1)} 
                  style={styles.guestBtn}
                >
                  <Text style={styles.guestBtnText}>+</Text>
                </Pressable>
              </View>
            </>
          )}

          {mode === 'services' && (
            <>
              <Text style={styles.section}>Catégorie de service</Text>
              <View style={styles.chips}>
                {PRO_CATEGORIES.map((c) => (
                  <Pressable key={c} onPress={() => setCategory(c)}
                    style={[styles.chip, category === c && styles.chipActive]}>
                    <Text style={[styles.chipTxt, category === c && styles.chipTxtActive]}>{c}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable onPress={() => { setWhere(''); setCategory(undefined); setDates(undefined); setGuests(mode === 'voyages' ? 2 : 1); }} >
              <Text style={styles.clear}>Tout effacer</Text>
            </Pressable>
            <Pressable onPress={submit} style={styles.searchBtn}>
              <Text style={styles.searchTxt}>Rechercher</Text>
            </Pressable>
          </View>
        </ScrollView>
      </BottomSheet>

      <DateRangeSheet
        visible={dateOpen}
        onClose={() => setDateOpen(false)}
        onSubmit={(label) => setDates(label)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '900', marginHorizontal: 20, marginTop: 4, color: '#0F172A' },
  section: { fontSize: 14, fontWeight: '800', marginHorizontal: 20, marginTop: 18, color: '#0F172A' },
  inputRow: {
    marginHorizontal: 20, marginTop: 10,
    borderWidth: 1, borderColor: '#E6E8EC', borderRadius: 16,
    paddingHorizontal: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff',
  },
  input: { flex: 1, fontWeight: '700', color: '#0F172A' },
  cityPickerContainer: { marginHorizontal: 20, marginTop: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 20, marginTop: 10 },
  horizontalChips: { paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#F4F6F8', borderWidth: 1, borderColor: '#E6E8EC' },
  chipActive: { backgroundColor: '#E9F4F1', borderColor: '#0E5A46' },
  chipTxt: { color: '#475569', fontWeight: '700' },
  chipTxtActive: { color: '#0E5A46' },
  rowBtn: { marginHorizontal: 20, marginTop: 10, borderRadius: 16, borderWidth: 1, borderColor: '#E6E8EC', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowBtnTxt: { fontWeight: '700', color: '#475569' },
  actions: { marginHorizontal: 20, marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clear: { textDecorationLine: 'underline', fontWeight: '800', color: '#0F172A' },
  searchBtn: { backgroundColor: '#FF2D55', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999 },
  searchTxt: { color: '#fff', fontWeight: '900' },
  guestControls: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 10, gap: 12 },
  guestBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F4F6F8', borderWidth: 1, borderColor: '#E6E8EC', alignItems: 'center', justifyContent: 'center' },
  guestBtnDisabled: { opacity: 0.5 },
  guestBtnText: { fontSize: 18, fontWeight: '700', color: '#475569' },
  guestBtnTextDisabled: { color: '#CBD5E1' },
  guestDisplay: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F4F6F8', borderRadius: 12, borderWidth: 1, borderColor: '#E6E8EC' },
  guestText: { fontWeight: '700', color: '#475569' },
});