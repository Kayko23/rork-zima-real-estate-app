import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight, MapPin, Globe, Search as SearchIcon } from 'lucide-react-native';

type Category = {
  key: string;
  title: string;
  subtitle: string;
  image: { uri: string };
  scope: 'property' | 'trips';
};

const PROPERTY_CATEGORIES: Category[] = [
  { key: 'residential', title: 'Résidentiel', subtitle: 'Appartements, maisons, villas', image: { uri: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1200&auto=format&fit=crop' }, scope: 'property' },
  { key: 'offices', title: 'Bureaux', subtitle: 'Espaces de travail & coworking', image: { uri: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop' }, scope: 'property' },
  { key: 'retail', title: 'Commerces & Retail', subtitle: 'Boutiques, magasins, centres…', image: { uri: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop' }, scope: 'property' },
  { key: 'land', title: 'Terrains', subtitle: 'Résidentiel, commercial, lotissements', image: { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop' }, scope: 'property' },
  { key: 'industrial', title: 'Industriel & Logistique', subtitle: 'Entrepôts, usines, ateliers', image: { uri: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop' }, scope: 'property' },
  { key: 'event', title: 'Événementiel', subtitle: 'Salles & espaces événementiels', image: { uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop' }, scope: 'property' },
];

const TRIPS_CATEGORIES: Category[] = [
  { key: 'hotels', title: 'Hôtels', subtitle: 'Chambres & suites', image: { uri: 'https://images.unsplash.com/photo-1559599189-95f32f16e3f2?q=80&w=1200&auto=format&fit=crop' }, scope: 'trips' },
  { key: 'daily-stays', title: 'Résidences journalières', subtitle: 'Studios & appartements', image: { uri: 'https://images.unsplash.com/photo-1505693330891-34c9c117f9d3?q=80&w=1200&auto=format&fit=crop' }, scope: 'trips' },
];

export default function Browse(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [country, setCountry] = useState<string>('Afrique');
  const [city, setCity] = useState<string>('Toutes les villes');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const paddingTop = insets.top + 8;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        console.log('[Browse] fetching counts for', country, city);
        const demo: Record<string, number> = {
          residential: 24,
          offices: 6,
          retail: 12,
          land: 9,
          industrial: 3,
          event: 4,
          hotels: 32,
          'daily-stays': 17,
        };
        if (mounted) setCounts(demo);
      } catch (e) {
        console.error('[Browse] counts error', e);
        if (mounted) setCounts({});
      }
    })();
    return () => { mounted = false; };
  }, [country, city]);

  const goPickCountry = () => {
    console.log('[Browse] pick country');
    router.push({ pathname: '/browse', params: { from: 'browse', pick: 'country' } });
  };
  const goPickCity = () => {
    console.log('[Browse] pick city');
    router.push({ pathname: '/browse', params: { from: 'browse', pick: 'city', country } });
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop, paddingBottom: 32 }} style={s.screen} testID="browse-screen">
      <View style={s.header}>
        <Text style={s.title}>Recherche par catégorie</Text>
        <Pressable style={s.search} onPress={() => router.push('/browse')} testID="browse-search">
          <SearchIcon size={18} color="#0F1F2F" />
          <Text numberOfLines={1} style={s.searchPh}>Rechercher un bien ou un séjour…</Text>
        </Pressable>
        <View style={s.filtersRow}>
          <Pressable style={s.pill} onPress={goPickCountry} testID="browse-country">
            <Globe size={16} color="#0F1F2F" />
            <Text numberOfLines={1} style={s.pillText}>{country}</Text>
          </Pressable>
          <Pressable style={s.pill} onPress={goPickCity} testID="browse-city">
            <MapPin size={16} color="#0F1F2F" />
            <Text numberOfLines={1} style={s.pillText}>{city}</Text>
          </Pressable>
        </View>
      </View>

      <Section title="Propriétés" note="Catégories clés">
        {PROPERTY_CATEGORIES.map((c) => (
          <CategoryRow
            key={c.key}
            category={c}
            count={counts[c.key] ?? 0}
            onPress={() => {
              console.log('[Browse] open property list', c.key, { country, city });
              router.push({ pathname: '/property/list', params: { category: c.key, country, city } });
            }}
          />
        ))}
      </Section>

      <Section title="Voyages" note="Hôtels & résidences">
        {TRIPS_CATEGORIES.map((c) => (
          <CategoryRow
            key={c.key}
            category={c}
            count={counts[c.key] ?? 0}
            onPress={() => {
              console.log('[Browse] open trips list', c.key, { country, city });
              router.push({ pathname: '/voyages/list', params: { category: c.key, country, city } });
            }}
          />
        ))}
      </Section>
    </ScrollView>
  );
}

function Section({ title, note, children }: React.PropsWithChildren<{ title: string; note?: string }>) {
  return (
    <View style={s.sectionWrap}>
      <Text style={s.sectionTitle}>{title}</Text>
      {note ? <Text style={s.sectionNote}>{note}</Text> : null}
      <View style={s.sectionBody}>
        {children}
      </View>
    </View>
  );
}

function CategoryRow({ category, count, onPress }: { category: Category; count: number; onPress: () => void }) {
  const label = useMemo(() => `${count} ${count > 1 ? 'biens' : 'bien'}`, [count]);
  return (
    <Pressable onPress={onPress} style={s.row} testID={`browse-row-${category.key}`} accessibilityRole="button">
      <Image source={category.image} style={s.thumb} resizeMode="cover" />
      <View style={s.rowInfo}>
        <Text style={s.rowTitle}>{category.title}</Text>
        <Text numberOfLines={1} style={s.rowSub}>{category.subtitle}</Text>
        <Text style={s.count}>{label}</Text>
      </View>
      <ChevronRight size={20} color="#7A8894" />
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: { backgroundColor: '#F3F6F7' },
  header: { paddingHorizontal: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '800' as const, color: '#0F1F2F' },
  search: {
    flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8,
    borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 12, height: 44,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  searchPh: { color: '#4A5A68', fontSize: 15, flex: 1 },
  filtersRow: { flexDirection: 'row' as const, gap: 10 },
  pill: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, backgroundColor: '#fff', paddingHorizontal: 12, height: 40, borderRadius: 20 },
  pillText: { color: '#0F1F2F', fontSize: 14, fontWeight: '600' as const, maxWidth: 200 },
  sectionWrap: { paddingHorizontal: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: '#0F1F2F' },
  sectionNote: { fontSize: 13, color: '#73808C', marginTop: 2 },
  sectionBody: { gap: 12, marginTop: 8 },
  row: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: '#fff', padding: 12, borderRadius: 16, gap: 12 },
  thumb: { width: 60, height: 60, borderRadius: 12 },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '700' as const, color: '#0F1F2F' },
  rowSub: { fontSize: 13, color: '#6A7682', marginTop: 2 },
  count: { fontSize: 13, color: '#1F2937', marginTop: 6, fontWeight: '700' as const },
});
