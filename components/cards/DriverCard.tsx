import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, MapPin, Calendar, Award } from 'lucide-react-native';

export type DriverItem = {
  id: string;
  name: string;
  city: string;
  imageUrl?: string;
  isPremium?: boolean;
  pricePerDay?: number;
  currency?: 'XOF' | 'FCFA' | 'USD' | 'EUR';
  rating?: number;
  experience?: number;
  languages?: string[];
  verified?: boolean;
};

export default function DriverCard({ item }: { item: DriverItem }) {
  const router = useRouter();
  const validUri = item.imageUrl && item.imageUrl.trim().length > 0 
    ? item.imageUrl 
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800';
  
  const currency = item.currency ?? 'XOF';

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/vehicles/[id]', params: { id: item.id } } as any)}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: validUri }} style={styles.img} resizeMode="cover" />
        <View style={styles.imageOverlay} />
        
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Award size={14} color="#fff" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}

        {item.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Vérifié</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>

        <View style={styles.locationRow}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.location}>{item.city}</Text>
        </View>

        {item.experience && (
          <View style={styles.experienceRow}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.experience}>{item.experience} ans d&apos;expérience</Text>
          </View>
        )}

        {item.languages && item.languages.length > 0 && (
          <View style={styles.languagesRow}>
            <Text style={styles.languagesLabel}>Langues: </Text>
            <Text style={styles.languages}>{item.languages.join(', ')}</Text>
          </View>
        )}

        <View style={styles.footer}>
          {item.rating && (
            <View style={styles.ratingRow}>
              <Star size={16} color="#FFD166" fill="#FFD166" />
              <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
            </View>
          )}

          {typeof item.pricePerDay === 'number' && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {new Intl.NumberFormat('fr-FR').format(item.pricePerDay)} {currency}
              </Text>
              <Text style={styles.perDay}> / jour</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const CARD_H = 280;
const RADIUS = 18;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_H,
    borderRadius: RADIUS,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    height: 140,
    position: 'relative',
  },
  img: { 
    width: '100%', 
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E4B200',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  premiumText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  content: {
    padding: 14,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#0F172A',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  location: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600' as const,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  experience: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600' as const,
  },
  languagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  languagesLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600' as const,
  },
  languages: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600' as const,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#0F172A',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 16,
    fontWeight: '900' as const,
    color: '#0E5A43',
  },
  perDay: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600' as const,
  },
});
