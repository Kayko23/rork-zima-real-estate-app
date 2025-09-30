import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import InsetBottomSheet from '@/components/sheets/InsetBottomSheet';
import { useFiltersStore } from '@/stores/useFiltersStore';

import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react-native';

type Props = {
  sheetRef: React.RefObject<BottomSheet | null>;
  onApply?: () => void;
};

const PROPERTY_FEATURES = [
  { id: 'wifi', label: 'Wifi' },
  { id: 'piscine', label: 'Piscine' },
  { id: 'clim', label: 'Climatisation' },
  { id: 'parking', label: 'Parking' },
  { id: 'jardin', label: 'Jardin' },
  { id: 'balcon', label: 'Balcon' },
  { id: 'ascenseur', label: 'Ascenseur' },
  { id: 'securite', label: 'Sécurité 24/7' },
];

export default function PropertyFiltersSheet({ sheetRef, onApply }: Props) {
  const qClient = useQueryClient();
  const { property, setProperty, resetProperty } = useFiltersStore();



  function apply() {
    sheetRef.current?.close();
    qClient.invalidateQueries({ queryKey: ['properties'] });
    onApply?.();
  }

  function reset() {
    resetProperty();
    sheetRef.current?.close();
    qClient.invalidateQueries({ queryKey: ['properties'] });
  }

  function toggleFeature(id: string) {
    const features = property.features ?? [];
    if (features.includes(id)) {
      setProperty({ features: features.filter(f => f !== id) });
    } else {
      setProperty({ features: [...features, id] });
    }
  }

  return (
    <InsetBottomSheet ref={sheetRef} snapPoints={['75%', '90%']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <View style={s.header}>
          <Text style={s.title}>Filtres Propriétés</Text>
          <Pressable onPress={() => sheetRef.current?.close()} style={s.close}>
            <X size={24} color="#111" />
          </Pressable>
        </View>

        <View style={s.section}>
          <Text style={s.label}>Type de transaction</Text>
          <View style={s.chips}>
            <Pressable 
              style={[s.chip, property.type === 'sale' && s.chipActive]}
              onPress={() => setProperty({ type: 'sale' })}>
              <Text style={[s.chipText, property.type === 'sale' && s.chipTextActive]}>
                Vente
              </Text>
            </Pressable>
            <Pressable 
              style={[s.chip, property.type === 'rent' && s.chipActive]}
              onPress={() => setProperty({ type: 'rent' })}>
              <Text style={[s.chipText, property.type === 'rent' && s.chipTextActive]}>
                Location
              </Text>
            </Pressable>
          </View>
        </View>

        {property.type === 'rent' && (
          <View style={s.section}>
            <Text style={s.label}>Période</Text>
            <View style={s.chips}>
              <Pressable 
                style={[s.chip, property.period === 'monthly' && s.chipActive]}
                onPress={() => setProperty({ period: 'monthly' })}>
                <Text style={[s.chipText, property.period === 'monthly' && s.chipTextActive]}>
                  Mensuel
                </Text>
              </Pressable>
              <Pressable 
                style={[s.chip, property.period === 'daily' && s.chipActive]}
                onPress={() => setProperty({ period: 'daily' })}>
                <Text style={[s.chipText, property.period === 'daily' && s.chipTextActive]}>
                  Journalier
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={s.section}>
          <Text style={s.label}>Équipements</Text>
          <View style={s.chips}>
            {PROPERTY_FEATURES.map(feat => (
              <Pressable 
                key={feat.id}
                style={[s.chip, property.features?.includes(feat.id) && s.chipActive]}
                onPress={() => toggleFeature(feat.id)}>
                <Text style={[s.chipText, property.features?.includes(feat.id) && s.chipTextActive]}>
                  {feat.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={s.actions}>
          <Pressable style={s.btnSecondary} onPress={reset}>
            <Text style={s.btnSecondaryText}>Réinitialiser</Text>
          </Pressable>
          <Pressable style={s.btnPrimary} onPress={apply}>
            <Text style={s.btnPrimaryText}>Voir les résultats</Text>
          </Pressable>
        </View>
      </ScrollView>
    </InsetBottomSheet>
  );
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#111',
  },
  close: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111',
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F5F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#163E2E10',
    borderColor: '#163E2E',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  chipTextActive: {
    color: '#163E2E',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F3F5F6',
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111',
  },
  btnPrimary: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#163E2E',
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
