import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import InsetBottomSheet from '@/components/sheets/InsetBottomSheet';
import { useFiltersStore } from '@/stores/useFiltersStore';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react-native';

type Props = {
  sheetRef: React.RefObject<BottomSheet>;
  onApply?: () => void;
};

const TRIP_AMENITIES = [
  { id: 'wifi', label: 'Wifi' },
  { id: 'breakfast', label: 'Petit-déjeuner' },
  { id: 'parking', label: 'Parking' },
  { id: 'pool', label: 'Piscine' },
  { id: 'gym', label: 'Salle de sport' },
  { id: 'spa', label: 'Spa' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'free_cancellation', label: 'Annulation gratuite' },
];

export default function TripFiltersSheet({ sheetRef, onApply }: Props) {
  const qClient = useQueryClient();
  const { trip, setTrip, resetTrip } = useFiltersStore();

  function apply() {
    sheetRef.current?.close();
    qClient.invalidateQueries({ queryKey: ['trips'] });
    onApply?.();
  }

  function reset() {
    resetTrip();
    sheetRef.current?.close();
    qClient.invalidateQueries({ queryKey: ['trips'] });
  }

  function toggleAmenity(id: string) {
    const amenities = trip.amenities ?? [];
    if (amenities.includes(id)) {
      setTrip({ amenities: amenities.filter(a => a !== id) });
    } else {
      setTrip({ amenities: [...amenities, id] });
    }
  }

  return (
    <InsetBottomSheet ref={sheetRef} snapPoints={['75%', '90%']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <View style={s.header}>
          <Text style={s.title}>Filtres Voyages</Text>
          <Pressable onPress={() => sheetRef.current?.close()} style={s.close}>
            <X size={24} color="#111" />
          </Pressable>
        </View>

        <View style={s.section}>
          <Text style={s.label}>Catégorie</Text>
          <View style={s.chips}>
            <Pressable 
              style={[s.chip, trip.category === 'hotel' && s.chipActive]}
              onPress={() => setTrip({ category: 'hotel' })}>
              <Text style={[s.chipText, trip.category === 'hotel' && s.chipTextActive]}>
                Hôtels
              </Text>
            </Pressable>
            <Pressable 
              style={[s.chip, trip.category === 'residence' && s.chipActive]}
              onPress={() => setTrip({ category: 'residence' })}>
              <Text style={[s.chipText, trip.category === 'residence' && s.chipTextActive]}>
                Résidences
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.label}>Note minimale</Text>
          <View style={s.chips}>
            {[3, 4, 5].map(rating => (
              <Pressable 
                key={rating}
                style={[s.chip, trip.ratingMin === rating && s.chipActive]}
                onPress={() => setTrip({ ratingMin: rating })}>
                <Text style={[s.chipText, trip.ratingMin === rating && s.chipTextActive]}>
                  {rating}+ ⭐
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.label}>Services & Équipements</Text>
          <View style={s.chips}>
            {TRIP_AMENITIES.map(amenity => (
              <Pressable 
                key={amenity.id}
                style={[s.chip, trip.amenities?.includes(amenity.id) && s.chipActive]}
                onPress={() => toggleAmenity(amenity.id)}>
                <Text style={[s.chipText, trip.amenities?.includes(amenity.id) && s.chipTextActive]}>
                  {amenity.label}
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
