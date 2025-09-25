import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { VoyageSearchBar, VoyageQuery } from '@/components/voyages/VoyageSearchBar';
import { VoyageSearchSheet } from '@/components/voyages/VoyageSearchSheet';
import { VoyageFilterSheet, VoyageFilters } from '@/components/voyages/VoyageFilterSheet';
import { VoyageCarousel } from '@/components/voyages/VoyageCarousel';
import { mockVoyages } from '@/components/voyages/helpers';
import { router, Stack } from 'expo-router';
import { colors as theme } from '@/theme/tokens';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VoyageCategoryPills } from '@/components/voyages/VoyageCategoryPills';

export default function VoyagesScreen() {
  const [q, setQ] = useState<VoyageQuery>({ type: 'all' });
  const [f, setF] = useState<VoyageFilters>({});
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ title: 'Voyages' }} />
      <ScrollView contentContainerStyle={[s.content, { paddingTop: insets.top }]}>
        <Text style={s.h1}>Voyages</Text>
        <Text style={s.sub}>Découvrez des hébergements exceptionnels à travers l’Afrique</Text>

        <VoyageSearchBar query={q} onPress={() => setOpenSearch(true)} />
        <VoyageCategoryPills selected={q.type ?? 'all'} onSelect={(t: 'all' | 'hotel' | 'residence' | 'daily')=> setQ(prev=>({ ...prev, type: t }))} />
        <View style={s.actionsRow}>
          <Pressable onPress={() => setOpenFilters(true)} style={s.chipBtn} testID="btn-open-filters">
            <Text style={s.chipTxt}>Filtres</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/voyages-search')} style={s.darkBtn} testID="btn-see-all">
            <Text style={s.darkBtnTxt}>Voir tout</Text>
          </Pressable>
        </View>

        <Text style={s.sectionTitle}>Populaires près de vous</Text>
        <VoyageCarousel data={mockVoyages} onPressItem={() => {}} />

        <Text style={s.sectionTitle}>Hôtels recommandés</Text>
        <VoyageCarousel data={mockVoyages.filter((v) => v.type === 'hotel')} onPressItem={() => {}} />

        <Text style={s.sectionTitle}>Résidences journalières</Text>
        <VoyageCarousel data={mockVoyages.filter((v) => v.type !== 'hotel')} onPressItem={() => {}} />

        <VoyageSearchSheet visible={openSearch} initial={q} onClose={() => setOpenSearch(false)} onSubmit={setQ} />
        <VoyageFilterSheet visible={openFilters} initial={f} onClose={() => setOpenFilters(false)} onApply={setF} />
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  h1: { fontSize: 26, fontWeight: '900', color: theme.text },
  sub: { color: '#6B7280' },
  actionsRow: { flexDirection: 'row', gap: 8 },
  chipBtn: { backgroundColor: '#F3F4F6', height: 36, paddingHorizontal: 12, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  chipTxt: { fontWeight: '800' },
  darkBtn: { backgroundColor: '#111827', height: 36, paddingHorizontal: 12, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  darkBtnTxt: { fontWeight: '800', color: '#fff' },
  sectionTitle: { fontWeight: '900', fontSize: 20 },
});
