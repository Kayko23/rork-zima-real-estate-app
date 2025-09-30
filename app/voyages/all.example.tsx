import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Screen from '@/components/layout/Screen';
import UnifiedSearchBar from '@/components/search/UnifiedSearchBar';
import TripFiltersSheet from '@/components/filters/TripFiltersSheet';
import PropertyFiltersSheet from '@/components/filters/PropertyFiltersSheet';
import { useFiltersStore } from '@/stores/useFiltersStore';
import { useQuery } from '@tanstack/react-query';
import VoyageCard from '@/components/voyages/VoyageCard';

export default function AllVoyagesExample() {
  const tripSheetRef = useRef<BottomSheet>(null);
  const propertySheetRef = useRef<BottomSheet>(null);
  const [mode, setMode] = useState<'property' | 'trip'>('trip');
  
  const { trip, property } = useFiltersStore();
  
  const tripsQuery = useQuery({ 
    queryKey: ['trips', trip], 
    queryFn: async () => {
      return [];
    },
    enabled: mode === 'trip',
  });
  
  const propertiesQuery = useQuery({ 
    queryKey: ['properties', property], 
    queryFn: async () => {
      return [];
    },
    enabled: mode === 'property',
  });

  function openFilters() {
    if (mode === 'trip') {
      tripSheetRef.current?.snapToIndex(1);
    } else {
      propertySheetRef.current?.snapToIndex(1);
    }
  }

  const data = mode === 'trip' ? tripsQuery.data : propertiesQuery.data;
  const filters = mode === 'trip' ? trip : property;

  return (
    <Screen>
      <View style={s.container}>
        <UnifiedSearchBar
          countryLabel={filters.country || 'Pays'}
          cityLabel={filters.city || 'Ville'}
          onPressCountry={openFilters}
          onPressCity={openFilters}
          mode={mode}
          onChangeMode={setMode}
        />

        <FlatList
          data={data ?? []}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => <VoyageCard trip={item} />}
          contentContainerStyle={s.list}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyText}>Aucun résultat</Text>
            </View>
          }
        />

        <TripFiltersSheet sheetRef={tripSheetRef} />
        <PropertyFiltersSheet sheetRef={propertySheetRef} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7F5',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
