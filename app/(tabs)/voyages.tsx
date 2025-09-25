import React, { useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Users, Calendar, Filter } from 'lucide-react-native';
import HomeHeader from '@/components/home/HomeHeader';
import { useApp } from '@/hooks/useAppStore';
import SearchSheet from '@/components/sheets/SearchSheet';
import FilterSheet from '@/components/sheets/FilterSheet';
import type { TripsSearch, TripsFilters } from '@/lib/search-types';

interface CardItem {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: { uri: string };
}

const demoPopular: CardItem[] = [
  {
    id: '1',
    title: 'Studio cosy proche plage',
    city: 'Dakar',
    country: 'Sénégal',
    price: 45000,
    rating: 4.8,
    reviews: 67,
    badge: 'Top',
    image: { uri: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format' },
  },
  {
    id: '2',
    title: 'Chambre Deluxe - Hotel Ivoire',
    city: 'Abidjan',
    country: "Côte d'Ivoire",
    price: 75000,
    rating: 4.6,
    reviews: 120,
    badge: 'Premium',
    image: { uri: 'https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=1200&auto=format' },
  },
];

export default function VoyagesScreen() {
  const insets = useSafeAreaInsets();
  const { setHomeTab } = useApp();

  const [search, setSearch] = useState<Partial<TripsSearch>>({});
  const [filters, setFilters] = useState<Partial<TripsFilters>>({});
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const popular = useMemo<CardItem[]>(() => demoPopular, []);
  const hotels = useMemo<CardItem[]>(() => [...demoPopular].reverse(), []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7F8" />
      <Stack.Screen options={{ title: 'Voyages', headerShown: false }} />

      <View style={styles.headerContainer}>
        <HomeHeader active="voyages" onChange={setHomeTab} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
        style={{ flex: 1, backgroundColor: '#F6F7F8' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.h1}>Voyages</Text>
          <Text style={styles.subtitle}>Découvrez des hébergements exceptionnels à travers l'Afrique</Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={() => setIsSearchOpen(true)} style={styles.chipsRow} testID="voyages.searchChips">
          <Chip icon={<MapPin size={16} color="#111827" />} label={search.destination ?? 'Destination'} />
          <Chip icon={<Calendar size={16} color="#111827" />} label={search.startDate && search.endDate ? `${search.startDate} → ${search.endDate}` : 'Dates'} />
          <Chip icon={<Users size={16} color="#111827" />} label={`${search.guests ?? 1} voyageurs`} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsFilterOpen(true)} style={styles.filtersBtn} testID="voyages.filtersBtn">
          <Filter size={18} color="#0F5132" />
          <Text style={styles.filtersTxt}>Filtres</Text>
        </TouchableOpacity>

        <Section title="Populaires près de vous" onSeeAll={() => console.log('See all popular')}>
          <HorizontalCards data={popular} />
        </Section>

        <Section title="Hôtels recommandés" onSeeAll={() => console.log('See all hotels')}>
          <HorizontalCards data={hotels} />
        </Section>
      </ScrollView>

      <SearchSheet
        visible={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        section="trips"
        initial={search}
        onApply={(v) => {
          console.log('Search applied:', v);
          setSearch(v);
        }}
      />
      <FilterSheet
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initial={filters}
        onApply={(v) => {
          console.log('Filters applied:', v);
          setFilters(v);
        }}
      />
    </View>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.chip} testID="voyages.chip">
      {icon}
      <Text numberOfLines={1} style={styles.chipTxt}>{label}</Text>
    </View>
  );
}

function Section({ title, children, onSeeAll }: { title: string; children: React.ReactNode; onSeeAll?: () => void }) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {!!onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} testID="voyages.section.seeAll">
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

function HorizontalCards({ data }: { data: CardItem[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingHorizontal: 16 }}>
      {data.map((item) => (
        <View key={item.id} style={styles.card} testID={`voyages.card.${item.id}`}>
          <Image source={item.image} style={styles.cardImg} />
          {!!item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeTxt}>{item.badge}</Text>
            </View>
          )}
          <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
            <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardPlace}>{item.city}, {item.country}</Text>
            <Text style={styles.cardPrice}>{item.price.toLocaleString()} FCFA <Text style={styles.cardUnit}>/ nuit</Text></Text>
            <Text style={styles.cardRating}>★ {item.rating} · {item.reviews} avis</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F8' },
  headerContainer: { backgroundColor: '#F6F7F8', paddingHorizontal: 20, paddingBottom: 8 },
  header: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8 },
  h1: { fontSize: 28, fontWeight: '800', color: '#0B1220', letterSpacing: 0.3 },
  subtitle: { marginTop: 8, color: '#475569', fontWeight: '600', lineHeight: 20 },
  chipsRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8,
    marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, height: 48,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 2,
  },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingHorizontal: 10, height: 32, borderRadius: 999 },
  chipTxt: { fontWeight: '700', color: '#111827', maxWidth: 120 },
  filtersBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 12 },
  filtersTxt: { color: '#0F5132', fontWeight: '800' },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#0B1220' },
  seeAll: { fontWeight: '800', color: '#0F5132' },
  card: { width: 300, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  cardImg: { width: '100%', height: 180 },
  badge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#11A37F', paddingHorizontal: 10, height: 28, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  badgeTxt: { color: '#fff', fontWeight: '800' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0B1220' },
  cardPlace: { marginTop: 2, color: '#6B7280', fontWeight: '600' },
  cardPrice: { marginTop: 8, fontSize: 16, fontWeight: '900', color: '#0B1220' },
  cardUnit: { color: '#6B7280', fontWeight: '700' },
  cardRating: { marginTop: 6, color: '#374151', fontWeight: '700', marginBottom: 12 },
});