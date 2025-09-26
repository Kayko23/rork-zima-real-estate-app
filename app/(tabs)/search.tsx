import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search as SearchIcon, ChevronRight } from 'lucide-react-native';
import SmartSearchBar from '@/components/search/SmartSearchBar';
import CountryPickerSheet from '@/components/search/CountryPickerSheet';
import CityPickerSheet from '@/components/search/CityPickerSheet';
import type { Country, City } from '@/components/search/types';
import { router } from 'expo-router';

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  image: string;
}

const PROPERTY_CATEGORIES: CategoryItem[] = [
  {
    id: 'residential',
    title: 'Résidentiel',
    subtitle: 'Appartements, maisons, villas',
    count: 24,
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=800',
  },
  {
    id: 'offices',
    title: 'Bureaux',
    subtitle: 'Espaces de travail & coworking',
    count: 6,
    image: 'https://images.unsplash.com/photo-1507209696998-3c532be9b2b1?q=80&w=800',
  },
  {
    id: 'retail',
    title: 'Commerces & Retail',
    subtitle: 'Boutiques, magasins, centres…',
    count: 12,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800',
  },
  {
    id: 'lands',
    title: 'Terrains',
    subtitle: 'Résidentiel, commercial, lotissements',
    count: 9,
    image: 'https://images.unsplash.com/photo-1543873190-6529fa1b3a17?q=80&w=800',
  },
  {
    id: 'industrial',
    title: 'Industriel & Logistique',
    subtitle: 'Entrepôts, usines, ateliers',
    count: 3,
    image: 'https://images.unsplash.com/photo-1567784177951-6fa58317e16b?q=80&w=800',
  },
  {
    id: 'event',
    title: 'Événementiel',
    subtitle: 'Salles & espaces évènementiels',
    count: 4,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800',
  },
];

const TRIP_CATEGORIES: CategoryItem[] = [
  {
    id: 'hotels',
    title: 'Hôtels',
    subtitle: 'Chambres & suites',
    count: 32,
    image: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=800',
  },
  {
    id: 'day-stays',
    title: 'Résidences journalières',
    subtitle: 'Studios & appartements',
    count: 17,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800',
  },
];

export default function SearchTab(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [activeDomain, setActiveDomain] = useState<'property' | 'trip'>('property');
  const [country, setCountry] = useState<Country | null>(null);
  const [city, setCity] = useState<City | null>(null);
  const [showCountry, setShowCountry] = useState<boolean>(false);
  const [showCity, setShowCity] = useState<boolean>(false);

  const headerBottom = insets.top + 12;

  const categories: CategoryItem[] = useMemo(
    () => (activeDomain === 'property' ? PROPERTY_CATEGORIES : TRIP_CATEGORIES),
    [activeDomain]
  );

  return (
    <View style={s.container} testID="search-tab">
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[s.screenPadding, s.screenTopPadding, { paddingTop: headerBottom }]}>
          <Text style={s.title}>Recherche par catégorie</Text>

          <SmartSearchBar
            placeholder="Rechercher un bien ou un séjour…"
            chips={[
              {
                key: 'country',
                label: country ? country.name : 'Pays',
                onPress: () => setShowCountry(true),
              },
              {
                key: 'city',
                label: city ? city.name : 'Toutes les villes',
                onPress: () => setShowCity(true),
                disabled: !country,
              },
            ]}
            leftIcon={<SearchIcon size={18} color="#111" />}
            onSubmit={(q) => router.push({ pathname: '/browse', params: { q, domain: activeDomain, country: country?.code ?? '', city: city?.name ?? '' } })}
          />

          <View style={s.segment}>
            <Pressable
              style={[s.segmentBtn, activeDomain === 'property' && s.segmentBtnActive]}
              onPress={() => setActiveDomain('property')}
              testID="segment-properties"
            >
              <Text style={[s.segmentTxt, activeDomain === 'property' && s.segmentTxtActive]}>Propriétés</Text>
            </Pressable>
            <Pressable
              style={[s.segmentBtn, activeDomain === 'trip' && s.segmentBtnActive]}
              onPress={() => setActiveDomain('trip')}
              testID="segment-trips"
            >
              <Text style={[s.segmentTxt, activeDomain === 'trip' && s.segmentTxtActive]}>Voyages</Text>
            </Pressable>
          </View>

          <Text style={s.sectionTitle}>{activeDomain === 'property' ? 'Propriétés' : 'Voyages'}</Text>
          <Text style={s.sectionSub}>{activeDomain === 'property' ? 'Catégories clés' : 'Hôtels & résidences'}</Text>

          <View style={s.catList}>
            {categories.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => {
                  console.log('[SearchTab] Open list', { domain: activeDomain, category: c.id, country: country?.code, city: city?.name });
                  router.push({
                    pathname: '/browse',
                    params: {
                      domain: activeDomain,
                      category: c.id,
                      country: country?.code ?? '',
                      city: city?.name ?? '',
                    },
                  });
                }}
                style={s.catCard}
                testID={`search-cat-${c.id}`}
                accessibilityRole="button"
              >
                <Image source={{ uri: c.image }} style={s.catImg} />
                <View style={s.catContent}>
                  <Text style={s.catTitle}>{c.title}</Text>
                  <Text style={s.catSub} numberOfLines={1}>
                    {c.subtitle}
                  </Text>
                  <Text style={s.catCount}>{c.count} biens</Text>
                </View>
                <ChevronRight color="#9AA1A9" />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <CountryPickerSheet
        visible={showCountry}
        onClose={() => setShowCountry(false)}
        onSelect={(c: Country) => {
          setCountry(c);
          setCity(null);
        }}
      />
      <CityPickerSheet
        visible={showCity}
        onClose={() => setShowCity(false)}
        countryCode={country?.code || null}
        onSelect={(v: City) => setCity(v)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F8' },
  screenPadding: { paddingHorizontal: 16 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.2,
    color: '#0B1D17',
    marginBottom: 12,
  },
  segment: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#E8EFF1',
    borderRadius: 14,
    padding: 4,
    marginTop: 14,
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentBtnActive: { backgroundColor: '#0F5C4D' },
  segmentTxt: { color: '#0F5C4D', fontWeight: '600' },
  segmentTxtActive: { color: 'white' },
  sectionTitle: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '800',
    color: '#0B1D17',
  },
  sectionSub: { color: '#5B6A73', marginTop: 2 },
  scrollContent: { paddingBottom: 28 },
  screenTopPadding: {},
  catList: { gap: 12, marginTop: 12 },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  catImg: { width: 64, height: 64, borderRadius: 14 },
  catTitle: { fontSize: 18, fontWeight: '700', color: '#0B1D17' },
  catSub: { color: '#6A7680', marginTop: 2 },
  catCount: { color: '#0F5C4D', marginTop: 6, fontWeight: '700' },
  catContent: { flex: 1 },
});
