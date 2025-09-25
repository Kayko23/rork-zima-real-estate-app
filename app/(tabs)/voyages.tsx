import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Filter, MapPin, Calendar, Users, Star, Heart } from 'lucide-react-native';

type Hotel = {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
};

const demoHotels: Hotel[] = [
  {
    id: '1',
    title: 'Studio cosy proche plage',
    city: 'Dakar',
    country: 'Sénégal',
    price: 45000,
    rating: 4.8,
    reviews: 67,
    badge: 'Top',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format',
  },
  {
    id: '2',
    title: 'Chambre Deluxe - Hotel Ivoire',
    city: 'Abidjan',
    country: "Côte d&apos;Ivoire",
    price: 75000,
    rating: 4.6,
    reviews: 120,
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=1200&auto=format',
  },
  {
    id: '3',
    title: 'Villa moderne avec piscine',
    city: 'Accra',
    country: 'Ghana',
    price: 95000,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format',
  },
];

export default function VoyagesTab() {
  const insets = useSafeAreaInsets();
  const [destination] = useState('');
  const [dates] = useState('');
  const [guests] = useState(1);

  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchChips}>
        <TouchableOpacity style={styles.chip}>
          <MapPin size={16} color="#111827" />
          <Text style={styles.chipText}>{destination || 'Destination'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip}>
          <Calendar size={16} color="#111827" />
          <Text style={styles.chipText}>{dates || 'Dates'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip}>
          <Users size={16} color="#111827" />
          <Text style={styles.chipText}>{guests} voyageur{guests > 1 ? 's' : ''}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const HotelCard = ({ item }: { item: Hotel }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      {item.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.likeButton}>
        <Heart size={18} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.cardContent}>
        <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardLocation}>{item.city}, {item.country}</Text>
        <Text style={styles.cardPrice}>{item.price.toLocaleString()} FCFA <Text style={styles.cardUnit}>/ nuit</Text></Text>
        <View style={styles.ratingRow}>
          <Star size={14} color="#FCD34D" fill="#FCD34D" />
          <Text style={styles.cardRating}>{item.rating} · {item.reviews} avis</Text>
        </View>
      </View>
    </View>
  );

  const HotelSection = ({ title, data }: { title: string; data: Hotel[] }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Voir tout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HotelCard item={item} />}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>Voyages</Text>
        <Text style={styles.subtitle}>Découvrez des hébergements exceptionnels à travers l&apos;Afrique</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <SearchBar />
        <TouchableOpacity style={styles.filtersButton}>
          <Filter size={18} color="#0F5132" />
          <Text style={styles.filtersText}>Filtres</Text>
        </TouchableOpacity>
      </View>

      {/* Hotel Sections */}
      <HotelSection title="Populaires près de vous" data={demoHotels} />
      <HotelSection title="Hôtels recommandés" data={[...demoHotels].reverse()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0B1220',
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 8,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 20,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  searchChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 999,
  },
  chipText: {
    fontWeight: '700',
    color: '#111827',
    maxWidth: 120,
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  filtersText: {
    color: '#0F5132',
    fontWeight: '800',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B1220',
  },
  seeAll: {
    fontWeight: '800',
    color: '#0F5132',
  },
  horizontalList: {
    paddingRight: 16,
  },
  card: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#11A37F',
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  likeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 6,
    borderRadius: 999,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B1220',
    marginBottom: 4,
  },
  cardLocation: {
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B1220',
    marginBottom: 6,
  },
  cardUnit: {
    color: '#6B7280',
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardRating: {
    color: '#374151',
    fontWeight: '700',
  },
});