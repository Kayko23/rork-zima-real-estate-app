import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet from '@/components/BottomSheet';
import type { TripsFilters } from '@/lib/search-types';

type Props = {
  initial?: Partial<TripsFilters>;
  onApply: (values: Partial<TripsFilters>) => void;
  visible: boolean;
  onClose: () => void;
};

export default function FilterSheet({ initial, onApply, visible, onClose }: Props) {
  const [priceMin, setPriceMin] = useState<number>(initial?.priceMin ?? 0);
  const [priceMax, setPriceMax] = useState<number>(initial?.priceMax ?? 300000);
  const [ratingMin, setRatingMin] = useState<number>(initial?.ratingMin ?? 0);
  const [hasPool, setHasPool] = useState<boolean>(!!initial?.hasPool);
  const [hasWifi, setHasWifi] = useState<boolean>(!!initial?.hasWifi);
  const [breakfast, setBreakfast] = useState<boolean>(!!initial?.breakfast);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={s.header} testID="filterSheet.header">
        <Text style={s.title}>Filtres</Text>
      </View>
      <View style={s.group}>
        <Text style={s.section}>Prix par nuit</Text>
        <Text style={s.hint}>{priceMin.toLocaleString()} FCFA — {priceMax.toLocaleString()} FCFA</Text>
        <Row label="Min" right={<Stepper value={priceMin} onChange={setPriceMin} step={5000} />} />
        <Row label="Max" right={<Stepper value={priceMax} onChange={setPriceMax} step={5000} />} />
      </View>
      <View style={s.group}>
        <Text style={s.section}>Note minimale</Text>
        <Row label="≥" right={<Stepper value={ratingMin} onChange={setRatingMin} step={0.1} min={0} max={5} />} />
      </View>
      <View style={s.group}>
        <Text style={s.section}>Équipements</Text>
        <Row label="Piscine" right={<Switch value={hasPool} onValueChange={setHasPool} />} />
        <Row label="Wi-Fi" right={<Switch value={hasWifi} onValueChange={setHasWifi} />} />
        <Row label="Petit-déjeuner" right={<Switch value={breakfast} onValueChange={setBreakfast} />} />
      </View>
      <View style={s.footer} testID="filterSheet.footer">
        <TouchableOpacity
          style={[s.btn, s.btnGhost]}
          onPress={() => {
            setPriceMin(0);
            setPriceMax(300000);
            setRatingMin(0);
            setHasPool(false);
            setHasWifi(false);
            setBreakfast(false);
          }}
          testID="filterSheet.reset"
        >
          <Text style={[s.btnTxt, { color: '#111827' }]}>Effacer tout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.btn, s.btnPrimary]}
          onPress={() => {
            try {
              onApply({ priceMin, priceMax, ratingMin, hasPool, hasWifi, breakfast });
              onClose();
            } catch (e) {
              console.log('FilterSheet apply error', e);
            }
          }}
          testID="filterSheet.apply"
        >
          <Text style={[s.btnTxt, { color: '#fff' }]}>Voir les résultats</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

function Row({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
      <Text style={{ fontWeight: '700', color: '#111827' }}>{label}</Text>
      {right}
    </View>
  );
}

function Stepper({ value, onChange, step = 1, min = 0, max = Number.MAX_SAFE_INTEGER }:
  { value: number; onChange: (v:number)=>void; step?: number; min?: number; max?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <TouchableOpacity onPress={() => onChange(Math.max(min, +(value - step).toFixed(2)))}
        style={{ backgroundColor: '#E5E7EB', width: 36, height: 36, borderRadius: 10, alignItems:'center', justifyContent:'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '800' }}>–</Text>
      </TouchableOpacity>
      <Text style={{ width: 86, textAlign: 'center', fontWeight: '700' }}>{value}</Text>
      <TouchableOpacity onPress={() => onChange(Math.min(max, +(value + step).toFixed(2)))}
        style={{ backgroundColor: '#0F5132', width: 36, height: 36, borderRadius: 10, alignItems:'center', justifyContent:'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color:'#fff' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontWeight: '800', fontSize: 18, color: '#0B1220' },
  group: { paddingHorizontal: 16, paddingVertical: 8 },
  section: { fontWeight: '800', marginBottom: 6, color: '#0B1220' },
  hint: { color: '#6B7280', marginBottom: 6, fontWeight: '600' },
  footer: { padding: 16, flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnGhost: { backgroundColor: '#E5E7EB' },
  btnPrimary: { backgroundColor: '#0F5132' },
  btnTxt: { fontWeight: '800' },
});