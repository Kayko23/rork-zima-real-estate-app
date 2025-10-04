import React, { useEffect, useState } from 'react';
import { Modal, Pressable, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { VehicleKind } from '@/types/vehicle';

export type VehicleFilters = {
  kind?: VehicleKind | undefined;
  premium?: boolean | undefined; // true=premium, false=standard, undefined=all
};

type Props = {
  visible: boolean;
  initial: VehicleFilters;
  onClose: () => void;
  onApply: (f: VehicleFilters) => void;
  resultCount: number;
  presetKey?: string;
};

export default function VehicleFiltersSheet({ visible, initial, onClose, onApply, resultCount }: Props) {
  const insets = useSafeAreaInsets();
  const [f, setF] = useState<VehicleFilters>(initial);

  useEffect(() => { if (visible) setF(initial); }, [visible, initial]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.select({ ios:'padding', android:undefined })} style={styles.flex1}>
        <Pressable testID="vehicle-filters-backdrop" style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.handleWrap}><View style={styles.handle} /></View>
          <Text style={styles.headerTitle}>Filtres Véhicules</Text>

          <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
            <Section title="Type">
              <Row>
                {[
                  { k: undefined, label: 'Tous' },
                  { k: 'vip' as const, label: 'VIP (avec chauffeur)' },
                  { k: 'rent' as const, label: 'À louer' },
                  { k: 'sale' as const, label: 'En vente' },
                  { k: 'driver' as const, label: 'Chauffeurs Pro' },
                ].map((it) => (
                  <Chip key={String(it.k ?? 'all')} selected={f.kind === it.k} label={it.label} onPress={() => setF((s) => ({ ...s, kind: it.k }))} />
                ))}
              </Row>
            </Section>

            <Section title="Gamme">
              <Row>
                <Chip selected={f.premium === undefined} label="Tous" onPress={() => setF((s) => ({ ...s, premium: undefined }))} />
                <Chip selected={f.premium === true} label="Premium" onPress={() => setF((s) => ({ ...s, premium: true }))} />
                <Chip selected={f.premium === false} label="Standard" onPress={() => setF((s) => ({ ...s, premium: false }))} />
              </Row>
            </Section>
          </ScrollView>

          <Pressable testID="vehicle-filters-apply" onPress={() => onApply(f)} style={styles.applyBtn}>
            <Text style={styles.applyTxt}>Voir les résultats ({resultCount})</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Section({ title, children }:{ title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: '800', marginBottom: 8 }}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ children }:{ children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{children}</View>;
}

function Chip({ label, selected, onPress }:{ label: string; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: selected ? '#0B6B53' : '#DADADA', backgroundColor: selected ? '#0B6B53' : '#fff' }}>
      <Text style={{ color: selected ? '#fff' : '#111827', fontWeight: selected ? '700' : '400' }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 12, paddingHorizontal: 16, maxHeight: '86%' as unknown as number },
  handleWrap: { alignItems: 'center', marginBottom: 8 },
  handle: { width: 44, height: 5, backgroundColor: '#E6E8EB', borderRadius: 3 },
  headerTitle: { fontWeight: '800', fontSize: 18, marginBottom: 8 },
  scrollInner: { paddingBottom: 16 },
  applyBtn: { backgroundColor: '#0B6B53', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  applyTxt: { color: '#fff', fontWeight: '800' },
});
