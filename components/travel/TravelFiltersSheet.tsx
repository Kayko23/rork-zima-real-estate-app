import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

export type TravelFilters = {
  country?: string;
  city?: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  guests: number;
  priceMin: number;
  priceMax: number;
  ratingMin?: number;
  amenities: string[];
};

type Props = {
  visible: boolean;
  initial: TravelFilters;
  resultCount: number;
  onClose: () => void;
  onApply: (f: TravelFilters) => void;
  onReset?: () => void;
  bottomExtra?: number;
};

export default function TravelFiltersSheet({
  visible,
  initial,
  resultCount,
  onClose,
  onApply,
  onReset,
  bottomExtra,
}: Props) {
  const insets = useSafeAreaInsets();
  const [f, setF] = useState<TravelFilters>(initial);

  const maxSheetHeight = useMemo(
    () => ({
      maxHeight: styles.sheetBase.maxHeight - insets.top,
      paddingBottom: (bottomExtra ?? 60) + insets.bottom + 12,
    }),
    [insets.top, insets.bottom, bottomExtra]
  );

  const setGuests = (delta: number) =>
    setF((s) => ({ ...s, guests: Math.max(1, s.guests + delta) }));

  const toggleAmenity = (id: string) =>
    setF((s) => ({
      ...s,
      amenities: s.amenities.includes(id)
        ? s.amenities.filter((x) => x !== id)
        : [...s.amenities, id],
    }));

  const setPriceMin = (v: number) =>
    setF((s) => ({ ...s, priceMin: Math.min(v, s.priceMax) }));
  const setPriceMax = (v: number) =>
    setF((s) => ({ ...s, priceMax: Math.max(v, s.priceMin) }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} testID="filters-backdrop" />

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={[styles.sheetBase, maxSheetHeight]}
      >
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}> 
          <Text style={styles.headerTitle}>Filtres</Text>
          <Pressable
            onPress={() => {
              onReset?.();
              setF(initial);
            }}
            hitSlop={10}
          >
            <Text style={styles.reset}>Réinitialiser</Text>
          </Pressable>
          <Pressable onPress={onClose} hitSlop={12} style={styles.close}>
            <Text style={styles.closeTxt}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator
          scrollIndicatorInsets={{ top: 8, bottom: (bottomExtra ?? 60) + insets.bottom + 64 }}
          keyboardShouldPersistTaps="handled"
        >
          <Section title="Destination">
            <Row>
              <Pill onPress={() => { console.log('open country picker'); }}>
                {f.country ?? 'Choisir un pays'}
              </Pill>
              <Pill onPress={() => { console.log('open city picker'); }}>
                {f.city ?? 'Choisir une ville'}
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
              <Stepper value={f.guests} onMinus={() => setGuests(-1)} onPlus={() => setGuests(1)} />
            </Row>
          </Section>

          <Section title="Prix par nuit">
            <Text style={styles.hint}>
              {formatMoney(f.priceMin)} – {formatMoney(f.priceMax)}
            </Text>
            <View style={{ marginTop: 8 }}>
              <Slider
                value={f.priceMin}
                min={0}
                max={2_000_000}
                step={1_000}
                onChange={setPriceMin}
              />
              <Slider
                value={f.priceMax}
                min={0}
                max={2_000_000}
                step={1_000}
                onChange={setPriceMax}
              />
              <Text style={styles.sliderHelp}>Glisse d’abord le minimum puis le maximum.</Text>
            </View>
          </Section>

          <Section title="Note minimale">
            <Row wrap>
              {[0, 3, 3.5, 4, 4.5, 5].map((n) => (
                <Chip
                  key={String(n)}
                  selected={f.ratingMin === n || (n === 0 && !f.ratingMin)}
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
                  selected={f.amenities.includes(a.id)}
                  onPress={() => toggleAmenity(a.id)}
                />
              ))}
            </Row>
          </Section>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}> 
          <Pressable
            style={styles.cta}
            onPress={() => onApply(f)}
            testID="filters-apply"
          >
            <Text style={styles.ctaTxt}>Voir les résultats ({resultCount})</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ children, wrap = false }: React.PropsWithChildren<{ wrap?: boolean }>) {
  return <View style={[styles.row, wrap && { flexWrap: 'wrap' }]}>{children}</View>;
}

function Pill({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.pill} testID="pill">
      <Text style={styles.pillTxt}>{children}</Text>
    </Pressable>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]} testID={`chip-${label}`}>
      <Text style={[styles.chipTxt, selected && styles.chipTxtSelected]}>{label}</Text>
    </Pressable>
  );
}

function Stepper({ value, onMinus, onPlus }: { value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <View style={styles.stepper}>
      <Pressable onPress={onMinus} style={styles.stepBtn} testID="stepper-minus"><Text style={styles.stepTxt}>−</Text></Pressable>
      <Text style={styles.stepValue}>{value} voyageur(s)</Text>
      <Pressable onPress={onPlus} style={styles.stepBtn} testID="stepper-plus"><Text style={styles.stepTxt}>＋</Text></Pressable>
    </View>
  );
}

function DateField({ label, value, onChange }: { label: string; value: Date | null | undefined; onChange: (d: Date) => void; }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={() => setOpen(true)} style={styles.dateField} testID={`date-${label}`}>
        <Text style={styles.dateLabel}>{label}</Text>
        <Text style={styles.dateValue}>{value ? value.toLocaleDateString() : 'Choisir'}</Text>
      </Pressable>
      {open && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, d) => { setOpen(false); if (d) onChange(d); }}
        />
      )}
    </View>
  );
}

function Slider({ value, min, max, step, onChange }: { value: number; min: number; max: number; step?: number; onChange: (v: number) => void; }) {
  return (
    <View style={styles.sliderRow}>
      <Pressable onPress={() => onChange(Math.max(min, value - (step ?? 1)))} style={styles.sliderBtn} testID="slider-dec"><Text>◀︎</Text></Pressable>
      <Text style={styles.sliderValue}>{formatMoney(value)}</Text>
      <Pressable onPress={() => onChange(Math.min(max, value + (step ?? 1)))} style={styles.sliderBtn} testID="slider-inc"><Text>▶︎</Text></Pressable>
    </View>
  );
}

const AMENITIES = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pool', label: 'Piscine' },
  { id: 'parking', label: 'Parking' },
  { id: 'ac', label: 'Climatisation' },
  { id: 'kitchen', label: 'Cuisine' },
  { id: 'security', label: 'Sécurité 24h' },
];

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetBase: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    maxHeight: 720,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  reset: { position: 'absolute', right: 44, top: '50%', marginTop: -10, color: '#0B6B53', fontWeight: '600' },
  close: { position: 'absolute', right: 12, top: '50%', marginTop: -14, padding: 6 },
  closeTxt: { fontSize: 18 },
  content: { padding: 16, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10 },
  pill: { flex: 1, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: '#D9D9D9' },
  pillTxt: { fontSize: 15 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#DADADA', marginRight: 10, marginBottom: 10 },
  chipSelected: { backgroundColor: '#0B6B53', borderColor: '#0B6B53' },
  chipTxt: { fontSize: 14, color: '#222' },
  chipTxtSelected: { color: '#fff', fontWeight: '600' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F4' },
  stepTxt: { fontSize: 20, fontWeight: '700' },
  stepValue: { fontSize: 15, fontWeight: '600' },
  dateField: { padding: 12, borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 12 },
  dateLabel: { fontSize: 12, color: '#6B7280' },
  dateValue: { fontSize: 15, marginTop: 2, fontWeight: '600' },
  hint: { fontSize: 14, color: '#374151' },
  sliderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F7F7F7', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 },
  sliderBtn: { padding: 8 },
  sliderValue: { fontWeight: '700' },
  sliderHelp: { marginTop: 6, color: '#6B7280', fontSize: 12 },
  footer: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E6E6',
  },
  cta: { backgroundColor: '#0B6B53', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  ctaTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

function formatMoney(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n);
}
