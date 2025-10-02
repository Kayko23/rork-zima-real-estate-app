import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AMENITIES = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pool', label: 'Piscine' },
  { id: 'parking', label: 'Parking' },
  { id: 'ac', label: 'Climatisation' },
  { id: 'kitchen', label: 'Cuisine' },
  { id: 'security', label: 'Sécurité 24h' },
] as const;

type AmenityId = typeof AMENITIES[number]['id'];

const COUNTRIES: Record<string, string[]> = {
  Bénin: ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey', 'Bohicon', 'Ouidah'],
  'Burkina Faso': ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora'],
  "Côte d’Ivoire": ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro', 'Daloa', 'Korhogo'],
  'Guinée-Bissau': ['Bissau', 'Bafatá', 'Gabú'],
  Mali: ['Bamako', 'Sikasso', 'Mopti', 'Kayes', 'Ségou'],
  Niger: ['Niamey', 'Zinder', 'Maradi', 'Agadez', 'Tahoua'],
  Sénégal: ['Dakar', 'Thiès', "Saint-Louis", 'Ziguinchor', 'Kaolack', 'Mbour'],
  Togo: ['Lomé', 'Sokodé', 'Kara'],
  Cameroun: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua'],
  Gabon: ['Libreville', 'Port-Gentil', 'Franceville'],
  Congo: ['Brazzaville', 'Pointe-Noire', 'Dolisie'],
  RCA: ['Bangui', 'Bimbo', 'Berbérati'],
  Tchad: ['N’Djamena', 'Moundou', 'Sarh'],
  'Guinée Équatoriale': ['Malabo', 'Bata'],
};

export type TravelFilters = {
  country?: string;
  city?: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  guests: number;
  priceMin: number;
  priceMax: number;
  ratingMin?: number; // 0..5
  amenities: AmenityId[];
};

type Props = {
  visible: boolean;
  initial: TravelFilters;
  resultCount: number;
  onClose: () => void;
  onApply: (f: TravelFilters) => void;
  onReset?: () => void;
  presetKey?: string;
};

export default function TravelFiltersSheet({
  visible,
  initial,
  resultCount,
  onClose,
  onApply,
  onReset,
  presetKey = 'zima/travel/lastFilters',
}: Props) {
  const insets = useSafeAreaInsets();
  const [f, setF] = useState<TravelFilters>(initial);
  const [openCountry, setOpenCountry] = useState<boolean>(false);
  const [openCity, setOpenCity] = useState<boolean>(false);
  const [searchCountry, setSearchCountry] = useState<string>('');
  const [searchCity, setSearchCity] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(presetKey);
        if (raw) {
          const parsed = JSON.parse(raw) as TravelFilters;
          setF(parsed);
        }
      } catch (e) {
        console.log('[TravelFiltersSheet] preset load error', e);
      }
    })();
  }, [presetKey]);

  useEffect(() => {
    AsyncStorage.setItem(presetKey, JSON.stringify(f)).catch((e) =>
      console.log('[TravelFiltersSheet] preset save error', e),
    );
  }, [f, presetKey]);

  useEffect(() => {
    if (visible) setF((prev) => ({ ...prev, ...initial }));
  }, [visible, initial]);

  const countries = useMemo(() => {
    const all = Object.keys(COUNTRIES);
    return searchCountry
      ? all.filter((c) => c.toLowerCase().includes(searchCountry.toLowerCase()))
      : all;
  }, [searchCountry]);

  const cities = useMemo(() => {
    const list = f.country ? COUNTRIES[f.country] ?? [] : [];
    return searchCity
      ? list.filter((c) => c.toLowerCase().includes(searchCity.toLowerCase()))
      : list;
  }, [f.country, searchCity]);

  const setGuests = (delta: number) =>
    setF((s) => ({ ...s, guests: Math.max(1, (s.guests ?? 1) + delta) }));

  const toggleAmenity = (id: AmenityId) =>
    setF((s) => ({
      ...s,
      amenities: (s.amenities ?? []).includes(id)
        ? (s.amenities ?? []).filter((x) => x !== id)
        : ([...(s.amenities ?? []), id] as AmenityId[]),
    }));

  const setPriceMin = (v: string) => setF((s) => ({ ...s, priceMin: clampNum(v, 0, s.priceMax ?? 2_000_000) }));
  const setPriceMax = (v: string) => setF((s) => ({ ...s, priceMax: clampNum(v, s.priceMin ?? 0, 2_000_000) }));

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.flex}
      >
        <Pressable testID="backdrop" style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Filtres Voyages</Text>
            <Pressable testID="resetButton" onPress={() => { onReset?.(); setF(initial); }}>
              <Text style={styles.resetText}>Réinitialiser</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator>
            <Section title="Destination">
              <Row>
                <Pill onPress={() => { setOpenCountry(true); setSearchCountry(''); }}>
                  <Text>{f.country ?? 'Choisir un pays'}</Text>
                </Pill>
                <Pill onPress={() => f.country && setOpenCity(true)} disabled={!f.country}>
                  <Text>
                    {f.city ?? (f.country ? 'Choisir une ville' : 'Sélectionnez un pays d’abord')}
                  </Text>
                </Pill>
              </Row>
            </Section>

            <Section title="Dates">
              <Row>
                <DateField
                  label="Arrivée"
                  value={f.checkIn ?? null}
                  onChange={(d) => setF((s) => ({ ...s, checkIn: d }))}
                />
                <DateField
                  label="Départ"
                  value={f.checkOut ?? null}
                  onChange={(d) => setF((s) => ({ ...s, checkOut: d }))}
                />
              </Row>
            </Section>

            <Section title="Voyageurs">
              <Row>
                <Stepper value={f.guests ?? 1} onMinus={() => setGuests(-1)} onPlus={() => setGuests(1)} />
              </Row>
            </Section>

            <Section title="Budget (par nuit)">
              <Row>
                <Input
                  label="Min"
                  keyboardType="numeric"
                  value={String(f.priceMin ?? '')}
                  onChangeText={setPriceMin}
                  placeholder="0"
                />
                <Input
                  label="Max"
                  keyboardType="numeric"
                  value={String(f.priceMax ?? '')}
                  onChangeText={setPriceMax}
                  placeholder="2 000 000"
                />
              </Row>
              <Text style={styles.hint}>{fmt(f.priceMin ?? 0)} – {fmt(f.priceMax ?? 0)}</Text>
            </Section>

            <Section title="Note minimale">
              <Row wrap>
                {[0, 3, 3.5, 4, 4.5, 5].map((n) => (
                  <Chip
                    key={String(n)}
                    selected={(f.ratingMin ?? 0) === n || (n === 0 && f.ratingMin === undefined)}
                    onPress={() => setF((s) => ({ ...s, ratingMin: n === 0 ? undefined : n }))}
                    label={n === 0 ? 'Tous' : `${n}+`}
                  />
                ))}
              </Row>
            </Section>

            <Section title="Équipements">
              <Row wrap>
                {AMENITIES.map((a) => (
                  <Chip
                    key={a.id}
                    label={a.label}
                    selected={(f.amenities ?? []).includes(a.id)}
                    onPress={() => toggleAmenity(a.id)}
                  />
                ))}
              </Row>
            </Section>
          </ScrollView>

          <Pressable
            testID="applyButton"
            onPress={() => onApply(f)}
            style={styles.applyBtn}
          >
            <Text style={styles.applyTxt}>Voir les résultats ({resultCount})</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={openCountry} transparent animationType="slide">
        <View style={styles.modalWrap}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 12 }]}>
            <Text style={styles.modalTitle}>Choisir un pays</Text>
            <TextInput
              value={searchCountry}
              onChangeText={setSearchCountry}
              placeholder="Rechercher un pays…"
              style={styles.search}
            />
            <ScrollView contentContainerStyle={styles.pickerList}>
              {countries.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => {
                    setF((s) => ({ ...s, country: c, city: undefined }));
                    setOpenCountry(false);
                  }}
                  style={styles.pickerRow}
                >
                  <Text>{c}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setOpenCountry(false)} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={openCity} transparent animationType="slide">
        <View style={styles.modalWrap}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 12 }]}>
            <Text style={styles.modalTitle}>{f.country ? `Villes — ${f.country}` : 'Choisir un pays'}</Text>
            <TextInput
              value={searchCity}
              onChangeText={setSearchCity}
              placeholder="Rechercher une ville…"
              style={styles.search}
            />
            <ScrollView contentContainerStyle={styles.pickerList}>
              {cities.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => {
                    setF((s) => ({ ...s, city: c }));
                    setOpenCity(false);
                  }}
                  style={styles.pickerRow}
                >
                  <Text>{c}</Text>
                </Pressable>
              ))}
              {cities.length === 0 && (
                <Text style={styles.emptyCity}>Aucune ville. Sélectionnez un pays.</Text>
              )}
            </ScrollView>
            <Pressable onPress={() => setOpenCity(false)} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ children, wrap = false }: React.PropsWithChildren<{ wrap?: boolean }>) {
  return <View style={[styles.row, wrap ? styles.rowWrap : null]}>{children}</View>;
}

function Pill({ children, onPress, disabled }: { children: React.ReactNode; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.pill, disabled ? styles.pillDisabled : null]}>
      {children}
    </Pressable>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected ? styles.chipSelected : null]}>
      <Text style={[styles.chipTxt, selected ? styles.chipTxtSelected : null]}>{label}</Text>
    </Pressable>
  );
}

function Stepper({ value, onMinus, onPlus }: { value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <View style={styles.stepperRow}>
      <BtnSquare onPress={onMinus}>−</BtnSquare>
      <Text style={styles.stepperValue}>{value} voyageur(s)</Text>
      <BtnSquare onPress={onPlus}>＋</BtnSquare>
    </View>
  );
}

function BtnSquare({ onPress, children }: { onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} style={styles.btnSquare}>
      <Text style={styles.btnSquareTxt}>{children}</Text>
    </Pressable>
  );
}

function Input(
  props: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  },
) {
  const { label, ...rest } = props;
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput {...rest} style={styles.input} />
    </View>
  );
}

function DateField({ label, value, onChange }: { label: string; value: Date | null; onChange: (d: Date) => void }) {
  const [open, setOpen] = useState<boolean>(false);
  const onPickerChange = (_: DateTimePickerEvent, d?: Date) => {
    setOpen(false);
    if (d) onChange(d);
  };
  return (
    <View style={styles.dateFieldWrap}>
      <Pressable onPress={() => setOpen(true)} style={styles.dateFieldPress}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text style={styles.dateValue}>{value ? value.toLocaleDateString() : 'Choisir'}</Text>
      </Pressable>
      {open && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onPickerChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    maxHeight: '85%',
  },
  handleWrap: { alignItems: 'center', marginBottom: 8 },
  handle: { width: 44, height: 5, backgroundColor: '#E6E8EB', borderRadius: 3 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headerTitle: { fontWeight: '800', fontSize: 18, flex: 1 },
  resetText: { color: '#0B6B53', fontWeight: '700' },
  scrollContent: { paddingBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10 },
  rowWrap: { flexWrap: 'wrap' as const },
  pill: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#fff',
  },
  pillDisabled: { opacity: 0.6, borderColor: '#EEE' },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DADADA',
    backgroundColor: '#fff',
  },
  chipSelected: { borderColor: '#0B6B53', backgroundColor: '#0B6B53' },
  chipTxt: { color: '#111827' },
  chipTxtSelected: { color: '#fff', fontWeight: '700' as const },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepperValue: { fontSize: 15, fontWeight: '600', minWidth: 120, textAlign: 'center' as const },
  btnSquare: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F4',
  },
  btnSquareTxt: { fontSize: 20, fontWeight: '700' },
  inputWrap: { flex: 1 },
  inputLabel: { fontSize: 12, color: '#6B7280' },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
  },
  dateFieldWrap: { flex: 1 },
  dateFieldPress: { borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 12, padding: 12 },
  dateValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  hint: { color: '#6B7280', marginTop: 6 },
  applyBtn: { backgroundColor: '#0B6B53', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  applyTxt: { color: '#fff', fontWeight: '800' as const },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalTitle: { fontWeight: '800', fontSize: 16, marginBottom: 8 },
  search: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  pickerList: { paddingBottom: 12 },
  pickerRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  closeBtn: { marginTop: 10, alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#0B6B53' },
  closeTxt: { color: '#fff', fontWeight: '800' as const },
  emptyCity: { color: '#6B7280', paddingVertical: 12 },
});

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);
const clampNum = (raw: string, min: number, max: number) =>
  Math.max(min, Math.min(max, Number(raw.replace(/[^\d]/g, '')) || 0));
