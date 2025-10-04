import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { X, ChevronDown } from 'lucide-react-native';
import BottomSheet from '@/components/ui/BottomSheet';
import { colors as themeColors } from '@/theme/tokens';

export type Range = { min?: number; max?: number };
export type Option = { label: string; value: string | number };

export type BaseDestination = { country?: string; city?: string };

export type FilterCommon = {
  destination?: BaseDestination;
  budget?: Range;
  ratingMin?: number;
  amenities?: string[];
};

export type PropertyFilters = FilterCommon & {
  transaction?: 'sale' | 'rent';
  category?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  livingrooms?: number;
  surfaceMin?: number;
  furnished?: boolean;
  titleDeed?: boolean;
};

export type TripFilters = FilterCommon & {
  checkIn?: string | null;
  checkOut?: string | null;
  guests?: number;
  sort?: 'recent' | 'priceAsc' | 'priceDesc';
};

export type VehicleFilters = FilterCommon & {
  intent?: 'vip' | 'rent' | 'sale' | 'driver';
  brand?: string;
  model?: string;
  year?: Range;
  fuel?: 'essence' | 'diesel' | 'hybride' | 'electrique';
  gearbox?: 'auto' | 'manuelle';
  seats?: number;
  withDriver?: boolean;
  pricePerDay?: Range;
  companyId?: string;
  startDate?: string | null;
  endDate?: string | null;
};

type Props =
  | { kind: 'property'; open: boolean; initial: PropertyFilters; onClose: () => void; onReset: () => void; onApply: (values: PropertyFilters) => void }
  | { kind: 'trip'; open: boolean; initial: TripFilters; onClose: () => void; onReset: () => void; onApply: (values: TripFilters) => void }
  | { kind: 'vehicle'; open: boolean; initial: VehicleFilters; onClose: () => void; onReset: () => void; onApply: (values: VehicleFilters) => void };

const ui = { headerH: 56, pillPadH: 10, pillPadW: 14 } as const;

const gray700 = '#4B5563' as const;
const gray900 = '#111827' as const;
const gray300 = '#D1D5DB' as const;
const gray200 = '#E5E7EB' as const;
const emerald800 = themeColors.primary as string;
const emerald700 = '#0B6B53' as const;

const Pill = React.memo(function Pill({ children, onPress, active, testID }: { children: React.ReactNode; onPress?: () => void; active?: boolean; testID?: string }) {
  return (
    <Pressable accessibilityRole="button" testID={testID} onPress={onPress} style={[styles.pill, active && styles.pillActive]}> 
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text>
    </Pressable>
  );
});

function useOpenKey() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = useCallback((key: string) => setOpenKey((k) => (k === key ? null : key)), []);
  const close = useCallback(() => setOpenKey(null), []);
  const isOpen = useCallback((key: string) => openKey === key, [openKey]);
  return { openKey, toggle, close, isOpen };
}

type SelectFieldProps<T extends string | number> = {
  testID?: string;
  placeholder: string;
  value?: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
  fieldKey: string;
  openKey: { isOpen: (key: string) => boolean; toggle: (key: string) => void; close: () => void };
};

function SelectField<T extends string | number>({ testID, placeholder, value, onChange, options, fieldKey, openKey }: SelectFieldProps<T>) {
  const selected = options.find((o) => o.value === value)?.label ?? placeholder;
  const opened = openKey.isOpen(fieldKey);
  return (
    <View style={{ width: '100%' }}>
      <Pressable
        accessibilityRole="button"
        onPress={() => openKey.toggle(fieldKey)}
        testID={testID}
        style={[styles.selectTrigger, opened && styles.selectTriggerOpen]}
      >
        <Text style={[styles.pillText, value != null && styles.pillTextActive]} numberOfLines={1}>{selected}</Text>
        <ChevronDown size={18} color={value != null ? emerald800 : gray700} />
      </Pressable>
      {opened && (
        <View style={styles.selectList} testID={`${testID}-list`}>
          {options.map((opt) => (
            <Pressable
              key={String(opt.value)}
              onPress={() => {
                onChange(opt.value);
                openKey.close();
              }}
              style={styles.selectItem}
              accessibilityRole="button"
            >
              <Text style={[styles.selectItemText, value === opt.value && styles.selectItemTextActive]} numberOfLines={1}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function UnifiedFilterSheet(props: Props) {
  const { open, onClose, onReset, kind } = props as { open: boolean; onClose: () => void; onReset: () => void; kind: 'property' | 'trip' | 'vehicle' };
  const [local, setLocal] = useState<any>(props.initial);
  const openKey = useOpenKey();

  useEffect(() => {
    if (open) setLocal(props.initial);
  }, [open, props.initial]);

  const title = useMemo(() => (kind === 'property' ? 'Filtres Propriétés' : kind === 'trip' ? 'Filtres Voyages' : 'Filtres Véhicules'), [kind]);

  const apply = useCallback(() => {
    try {
      (props as any).onApply(local);
    } catch (e) {
      console.error('[UnifiedFilterSheet] apply error', e);
    }
  }, [local, props]);

  return (
    <BottomSheet visible={open} onClose={onClose} maxHeight={0.92}>
      <View style={styles.header} testID="ufs-header">
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>{title}</Text>
        <Pressable accessibilityLabel="Fermer" onPress={onClose} testID="ufs-close">
          <X color={gray700} size={22} />
        </Pressable>
      </View>

      <View style={styles.resetRow}>
        <Pressable onPress={onReset} testID="ufs-reset">
          <Text style={styles.resetText}>Réinitialiser</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={Platform.OS !== 'web'}>
        <Text style={styles.sectionTitle}>Destination</Text>
        <View style={styles.pillWrap}>
          <Pill active={!!local?.destination?.country} onPress={() => console.log('open country picker')} testID="ufs-country">
            {local?.destination?.country || 'Choisir le pays'}
          </Pill>
          <Pill active={!!local?.destination?.city} onPress={() => console.log('open city picker')} testID="ufs-city">
            {local?.destination?.city || 'Ville'}
          </Pill>
        </View>

        {kind === 'property' && (
          <View>
            <Text style={styles.sectionTitle}>Transaction</Text>
            <View style={styles.pillWrap}>
              {(['rent', 'sale'] as const).map((v) => (
                <Pill key={v} active={local.transaction === v} onPress={() => setLocal((p: any) => ({ ...p, transaction: v }))}>
                  {v === 'rent' ? 'À louer' : 'À vendre'}
                </Pill>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Catégorie</Text>
            <SelectField
              testID="ufs-category"
              placeholder="Sélectionner la catégorie"
              value={local.category}
              onChange={(v) => setLocal((p: any) => ({ ...p, category: v }))}
              options={[
                { label: 'Résidentiel', value: 'residential' },
                { label: 'Hôtel', value: 'hotel' },
                { label: "Espaces événementiels", value: 'events' },
                { label: 'Terrains', value: 'land' },
                { label: 'Commerces', value: 'commercial' },
                { label: 'Bureaux', value: 'office' },
              ]}
              fieldKey="category"
              openKey={openKey}
            />

            <Text style={styles.sectionTitle}>Type</Text>
            <SelectField
              testID="ufs-type"
              placeholder="Sélectionner le type"
              value={local.type}
              onChange={(v) => setLocal((p: any) => ({ ...p, type: v }))}
              options={[
                { label: 'Villa', value: 'villa' },
                { label: 'Maison', value: 'maison' },
                { label: 'Appartement', value: 'appartement' },
                { label: 'Studio', value: 'studio' },
                { label: 'Boutique', value: 'boutique' },
                { label: 'Magasin', value: 'magasin' },
                { label: 'Entrepôt', value: 'entrepot' },
                { label: 'Bureau', value: 'bureau' },
              ]}
              fieldKey="type"
              openKey={openKey}
            />

            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            <View style={styles.pillWrap}>
              <Pill onPress={() => setLocal((p: any) => ({ ...p, bedrooms: cycle(p.bedrooms) }))}>{`Chambres ${local?.bedrooms ?? 0}+`}</Pill>
              <Pill onPress={() => setLocal((p: any) => ({ ...p, bathrooms: cycle(p.bathrooms) }))}>{`SDB ${local?.bathrooms ?? 0}+`}</Pill>
              <Pill onPress={() => setLocal((p: any) => ({ ...p, livingrooms: cycle(p.livingrooms) }))}>{`Salons ${local?.livingrooms ?? 0}+`}</Pill>
              <Pill onPress={() => setLocal((p: any) => ({ ...p, surfaceMin: step(p.surfaceMin, 20, 0, 300) }))}>{`Surface ≥ ${local?.surfaceMin ?? 0} m²`}</Pill>
              <Pill active={!!local?.furnished} onPress={() => setLocal((p: any) => ({ ...p, furnished: !p.furnished }))}>Meublé</Pill>
              <Pill active={!!local?.titleDeed} onPress={() => setLocal((p: any) => ({ ...p, titleDeed: !p.titleDeed }))}>Titre foncier</Pill>
            </View>
          </View>
        )}

        {kind === 'trip' && (
          <View>
            <Text style={styles.sectionTitle}>Dates</Text>
            <View style={styles.pillWrap}>
              <Pill active={!!local?.checkIn} onPress={() => console.log('open checkIn')}>{local?.checkIn || 'Arrivée'}</Pill>
              <Pill active={!!local?.checkOut} onPress={() => console.log('open checkOut')}>{local?.checkOut || 'Départ'}</Pill>
            </View>

            <Text style={styles.sectionTitle}>Voyageurs</Text>
            <View style={styles.pillWrap}>
              <Pill onPress={() => setLocal((p: any) => ({ ...p, guests: Math.max(1, (p.guests ?? 1) - 1) }))}>−</Pill>
              <Pill>{`${local?.guests ?? 1} voyageur(s)`}</Pill>
              <Pill onPress={() => setLocal((p: any) => ({ ...p, guests: (p.guests ?? 1) + 1 }))}>＋</Pill>
            </View>

            <Text style={styles.sectionTitle}>Tri</Text>
            <SelectField
              testID="ufs-sort"
              placeholder="Choisir le tri"
              value={local.sort}
              onChange={(v) => setLocal((p: any) => ({ ...p, sort: v }))}
              options={[
                { label: 'Plus récents', value: 'recent' },
                { label: 'Prix ↑', value: 'priceAsc' },
                { label: 'Prix ↓', value: 'priceDesc' },
              ]}
              fieldKey="sort"
              openKey={openKey}
            />
          </View>
        )}

        {kind === 'vehicle' && (
          <View>
            <Text style={styles.sectionTitle}>Intention</Text>
            <SelectField
              testID="ufs-intent"
              placeholder="Choisir l'intention"
              value={local.intent}
              onChange={(v) => setLocal((p: any) => ({ ...p, intent: v }))}
              options={[
                { label: 'VIP avec chauffeur', value: 'vip' },
                { label: 'Location', value: 'rent' },
                { label: 'Vente', value: 'sale' },
                { label: 'Chauffeurs Pro', value: 'driver' },
              ]}
              fieldKey="intent"
              openKey={openKey}
            />

            <Text style={styles.sectionTitle}>Véhicule</Text>
            <View style={{ gap: 8 }}>
              <SelectField
                testID="ufs-brand"
                placeholder="Marque"
                value={local.brand}
                onChange={(v) => setLocal((p: any) => ({ ...p, brand: v }))}
                options={getBrandsOptions()}
                fieldKey="brand"
                openKey={openKey}
              />
              <SelectField
                testID="ufs-model"
                placeholder="Modèle"
                value={local.model}
                onChange={(v) => setLocal((p: any) => ({ ...p, model: v }))}
                options={getModelsOptions(local.brand)}
                fieldKey="model"
                openKey={openKey}
              />
            </View>

            <View style={styles.pillWrap}>
              <Pill onPress={() => setLocal((p: any) => ({ ...p, seats: step(p.seats, 1, 2, 20) }))}>{`Places ${local?.seats ?? 2}+`}</Pill>
            </View>

            <Text style={styles.sectionTitle}>Motorisation</Text>
            <SelectField
              testID="ufs-fuel"
              placeholder="Carburant"
              value={local.fuel}
              onChange={(v) => setLocal((p: any) => ({ ...p, fuel: v }))}
              options={[
                { label: 'Essence', value: 'essence' },
                { label: 'Diesel', value: 'diesel' },
                { label: 'Hybride', value: 'hybride' },
                { label: 'Électrique', value: 'electrique' },
              ]}
              fieldKey="fuel"
              openKey={openKey}
            />

            <Text style={styles.sectionTitle}>Boîte</Text>
            <View style={styles.pillWrap}>
              {(['auto', 'manuelle'] as const).map((g) => (
                <Pill key={g} active={local?.gearbox === g} onPress={() => setLocal((p: any) => ({ ...p, gearbox: g }))}>
                  {g === 'auto' ? 'Auto' : 'Manuelle'}
                </Pill>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Période (location)</Text>
            <View style={styles.pillWrap}>
              <Pill active={!!local?.startDate} onPress={() => console.log('open startDate')}>{local?.startDate || 'Début'}</Pill>
              <Pill active={!!local?.endDate} onPress={() => console.log('open endDate')}>{local?.endDate || 'Fin'}</Pill>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Budget</Text>
        <View style={styles.pillWrap}>
          <Pill onPress={() => setLocal((p: any) => ({ ...p, budget: { ...p.budget, min: step(p?.budget?.min, 5000, 0, 100000000) } }))}>{`Min ${fmt(local?.budget?.min)}`}</Pill>
          <Pill onPress={() => setLocal((p: any) => ({ ...p, budget: { ...p.budget, max: step(p?.budget?.max, 5000, 0, 100000000) } }))}>{`Max ${fmt(local?.budget?.max)}`}</Pill>
        </View>

        <Text style={styles.sectionTitle}>Note minimale</Text>
        <SelectField
          testID="ufs-rating"
          placeholder="Tous"
          value={typeof local?.ratingMin === 'number' ? (local.ratingMin as number) : 0}
          onChange={(v) => setLocal((p: any) => ({ ...p, ratingMin: v }))}
          options={[0, 3, 3.5, 4, 4.5, 5].map((n) => ({ label: n === 0 ? 'Tous' : `${n}+`, value: n }))}
          fieldKey="ratingMin"
          openKey={openKey}
        />

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.cta} onPress={apply} testID="ufs-apply">
          <Text style={styles.ctaText}>Voir les résultats</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { height: ui.headerH, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: gray900 },
  resetRow: { paddingHorizontal: 16, paddingBottom: 8 },
  resetText: { color: emerald700, fontWeight: '600' },
  content: { paddingHorizontal: 16, paddingBottom: 8, rowGap: 8 },
  sectionTitle: { marginTop: 16, marginBottom: 8, fontSize: 16, fontWeight: '700', color: gray900 },
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: ui.pillPadW, paddingVertical: ui.pillPadH, borderRadius: 999, borderWidth: 1, borderColor: gray300, backgroundColor: '#fff' },
  pillActive: { backgroundColor: themeColors.primarySoft, borderColor: emerald800 },
  pillText: { color: gray700, fontWeight: '600' },
  pillTextActive: { color: emerald800 },
  footer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: gray200 },
  cta: { backgroundColor: emerald800, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  selectTrigger: {
    paddingHorizontal: ui.pillPadW,
    paddingVertical: ui.pillPadH,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: gray300,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectTriggerOpen: { borderColor: emerald800, backgroundColor: themeColors.primarySoft },
  selectList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: gray300,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: gray200 },
  selectItemText: { color: gray700, fontWeight: '600' },
  selectItemTextActive: { color: emerald800 },
});

function step(current: number | undefined, amount: number, min: number, max: number) {
  const v = (current ?? min) + amount;
  return v > max ? min : v;
}
function cycle(n?: number) { return typeof n === 'number' ? (n + 1 > 6 ? 0 : n + 1) : 1; }
function fmt(n?: number) { return n != null ? `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)} XOF` : '— — —'; }
function getBrandsOptions(): { label: string; value: string }[] {
  return [
    { label: 'Toyota', value: 'Toyota' },
    { label: 'Hyundai', value: 'Hyundai' },
    { label: 'Kia', value: 'Kia' },
    { label: 'Mercedes', value: 'Mercedes' },
    { label: 'BMW', value: 'BMW' },
    { label: 'Audi', value: 'Audi' },
  ];
}
function getModelsOptions(brand?: string): { label: string; value: string }[] {
  switch (brand) {
    case 'Toyota':
      return [
        { label: 'Corolla', value: 'Corolla' },
        { label: 'RAV4', value: 'RAV4' },
        { label: 'Prado', value: 'Prado' },
      ];
    case 'Hyundai':
      return [
        { label: 'i10', value: 'i10' },
        { label: 'i20', value: 'i20' },
        { label: 'Tucson', value: 'Tucson' },
      ];
    case 'Kia':
      return [
        { label: 'Picanto', value: 'Picanto' },
        { label: 'Sportage', value: 'Sportage' },
      ];
    default:
      return [];
  }
}
