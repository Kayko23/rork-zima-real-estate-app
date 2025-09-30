import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import InsetBottomSheet from '@/components/sheets/InsetBottomSheet';
import { useFiltersStore } from '@/stores/useFiltersStore';
import { useQueryClient } from '@tanstack/react-query';
import { X, CheckCircle2, Award } from 'lucide-react-native';
import type { ProService } from '@/lib/filters/types';

type Props = {
  sheetRef: React.RefObject<BottomSheet>;
  onApply?: () => void;
};

const PRO_SERVICES: { id: ProService; label: string }[] = [
  { id: 'agent', label: 'Agent immobilier' },
  { id: 'agency', label: 'Agence immobilière' },
  { id: 'property_management', label: 'Gestionnaire de biens' },
  { id: 'hotel_booking', label: 'Réservation hôtel' },
  { id: 'residence_booking', label: 'Réservation résidence' },
  { id: 'event_space_management', label: "Gestionnaire d'espace évènementiel" },
];

export default function ProFiltersSheet({ sheetRef, onApply }: Props) {
  const qClient = useQueryClient();
  const { pro, setPro, resetPro } = useFiltersStore();

  function apply() {
    sheetRef.current?.close();
    qClient.invalidateQueries({ queryKey: ['professionals'] });
    onApply?.();
  }

  function reset() {
    resetPro();
    sheetRef.current?.close();
    qClient.invalidateQueries({ queryKey: ['professionals'] });
  }

  function toggleService(id: ProService) {
    const services = pro.services ?? [];
    if (services.includes(id)) {
      setPro({ services: services.filter(s => s !== id) });
    } else {
      setPro({ services: [...services, id] });
    }
  }

  return (
    <InsetBottomSheet ref={sheetRef} snapPoints={['75%', '90%']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <View style={s.header}>
          <Text style={s.title}>Filtres Professionnels</Text>
          <Pressable onPress={() => sheetRef.current?.close()} style={s.close}>
            <X size={24} color="#111" />
          </Pressable>
        </View>

        <View style={s.section}>
          <Text style={s.label}>Catégorie de service</Text>
          <View style={s.chips}>
            {PRO_SERVICES.map(service => (
              <Pressable 
                key={service.id}
                style={[s.chip, pro.services?.includes(service.id) && s.chipActive]}
                onPress={() => toggleService(service.id)}>
                <Text style={[s.chipText, pro.services?.includes(service.id) && s.chipTextActive]}>
                  {service.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.label}>Badges</Text>
          <View style={s.chips}>
            <Pressable 
              style={[s.chip, pro.verified && s.chipActive]}
              onPress={() => setPro({ verified: !pro.verified })}>
              <CheckCircle2 
                size={16} 
                color={pro.verified ? '#163E2E' : '#6B7280'} 
              />
              <Text style={[s.chipText, pro.verified && s.chipTextActive]}>
                Vérifié
              </Text>
            </Pressable>
            <Pressable 
              style={[s.chip, pro.premium && s.chipActive]}
              onPress={() => setPro({ premium: !pro.premium })}>
              <Award 
                size={16} 
                color={pro.premium ? '#163E2E' : '#6B7280'} 
              />
              <Text style={[s.chipText, pro.premium && s.chipTextActive]}>
                Premium
              </Text>
            </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
