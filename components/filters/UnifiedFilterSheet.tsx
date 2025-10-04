import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { X } from 'lucide-react-native';
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

const ui = {
  headerH: 56,
  pillPadH: 10,
  pillPadW: 14,
};

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

export default function UnifiedFilterSheet(props: Props) {
  const { open, onClose, onReset, kind } = props as { open: boolean; onClose: () => void; onReset: () => void; kind: 'property' | 'trip' | 'vehicle' };
  const [local, setLocal] = useState<any>(props.initial);

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
            <View style={styles.pillWrap}>
              {['residential', 'hotel', 'events', 'land', 'commercial', 'office'].map((c) => (
                <Pill key={c} active={local.category === c} onPress={() => setLocal((p: any) => ({ ...p, category: c }))}>
                  {labelCategory(c)}
                </Pill>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Type</Text>
            <View style={styles.pillWrap}>
              {['villa', 'maison', 'appartement', 'studio', 'boutique', 'magasin', 'entrepot', 'bureau'].map((t) => (
                <Pill key={t} active={local.type === t} onPress={() => setLocal((p: any) => ({ ...p, type: t }))}>
                  {labelType(t)}
                </Pill>
              ))}
            </View>

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
            <View style={styles.pillWrap}>
              {[
                { k: 'recent', l: 'Plus récents' },
                { k: 'priceAsc', l: 'Prix ↑' },
                { k: 'priceDesc', l: 'Prix ↓' },
              ].map((o) => (
                <Pill key={o.k} active={local?.sort === o.k} onPress={() => setLocal((p: any) => ({ ...p, sort: o.k }))}>
                  {o.l}
                </Pill>
              ))}
            </View>
          </View>
        )}

        {kind === 'vehicle' && (
          <View>
            <Text style={styles.sectionTitle}>Intention</Text>
            <View style={styles.pillWrap}>
              {[
                { k: 'vip', l: 'VIP avec chauffeur' },
                { k: 'rent', l: 'Location' },
                { k: 'sale', l: 'Vente' },
                { k: 'driver', l: 'Chauffeurs Pro' },
              ].map((o) => (
                <Pill key={o.k} active={local?.intent === o.k} onPress={() => setLocal((p: any) => ({ ...p, intent: o.k }))}>
                  {o.l}
                </Pill>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Véhicule</Text>
            <View style={styles.pillWrap}>
              <Pill active={!!local?.brand} onPress={() => console.log('open brand picker')}>{local?.brand || 'Marque'}</Pill>
              <Pill active={!!local?.model} onPress={() => console.log('open model picker')}>{local?.model || 'Modèle'}</Pill>
              <Pill onPress={() => setLocal((p: any) => ({ ...p, seats: step(p.seats, 1, 2, 20) }))}>{`Places ${local?.seats ?? 2}+`}</Pill>
              <Pill active={!!local?.fuel} onPress={() => toggleEnum(setLocal, 'fuel', ['essence', 'diesel', 'hybride', 'electrique'], local?.fuel)}>
                {local?.fuel ? cap(local.fuel) : 'Carburant'}
              </Pill>
              <Pill active={!!local?.gearbox} onPress={() => toggleEnum(setLocal, 'gearbox', ['auto', 'manuelle'], local?.gearbox)}>
                {local?.gearbox ? (local?.gearbox === 'auto' ? 'Auto' : 'Manuelle') : 'Boîte'}
              </Pill>
              <Pill active={!!local?.withDriver} onPress={() => setLocal((p: any) => ({ ...p, withDriver: !p.withDriver }))}>Avec chauffeur</Pill>
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
        <View style={styles.pillWrap}>
          {[0, 3, 3.5, 4, 4.5, 5].map((n) => (
            <Pill key={String(n)} active={(local?.ratingMin ?? 0) === n} onPress={() => setLocal((p: any) => ({ ...p, ratingMin: n }))}>
              {n === 0 ? 'Tous' : `${n}+`}
            </Pill>
          ))}
        </View>

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
  content: { paddingHorizontal: 16, paddingBottom: 8 },
  sectionTitle: { marginTop: 16, marginBottom: 8, fontSize: 16, fontWeight: '700', color: gray900 },
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: ui.pillPadW, paddingVertical: ui.pillPadH, borderRadius: 999, borderWidth: 1, borderColor: gray300, backgroundColor: '#fff' },
  pillActive: { backgroundColor: themeColors.primarySoft, borderColor: emerald800 },
  pillText: { color: gray700, fontWeight: '600' },
  pillTextActive: { color: emerald800 },
  footer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: gray200 },
  cta: { backgroundColor: emerald800, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

function step(current: number | undefined, amount: number, min: number, max: number) {
  const v = (current ?? min) + amount;
  return v > max ? min : v;
}
function cycle(n?: number) { return typeof n === 'number' ? (n + 1 > 6 ? 0 : n + 1) : 1; }
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function fmt(n?: number) { return n != null ? `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)} XOF` : '— — —'; }
function toggleEnum(set: React.Dispatch<any>, key: string, values: string[], cur?: string) {
  const idx = values.indexOf(cur || '');
  const next = values[(idx + 1) % values.length];
  set((p: any) => ({ ...p, [key]: next }));
}
function labelCategory(c: string) {
  const map: Record<string, string> = { residential: 'Résidentiel', hotel: 'Hôtel', events: 'Espaces événementiels', land: 'Terrains', commercial: 'Commerces', office: 'Bureaux' };
  return map[c] || c;
}
function labelType(t: string) {
  const map: Record<string, string> = { villa: 'Villa', maison: 'Maison', appartement: 'Appartement', studio: 'Studio', boutique: 'Boutique', magasin: 'Magasin', entrepot: 'Entrepôt', bureau: 'Bureau' };
  return map[t] || t;
}
