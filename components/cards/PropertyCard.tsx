import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/tokens';

export type PropertyItem = {
  id: string | number;
  title: string;
  city: string;
  priceLabel: string;
  cover: string;
  badges?: string[];
  facts?: string[];
  rating?: number;
  isPremium?: boolean;
};

export default function PropertyCard({ item }: { item: PropertyItem }) {
  const router = useRouter();
  const imageSource = item.cover && item.cover.trim() !== '' 
    ? { uri: item.cover } 
    : { uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800' };
  
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/property/${item.id}` as any)}
    >
      <Image source={imageSource} style={styles.img} />
      <View style={styles.overlay} />
      <View style={styles.badgesRow}>
        {item.isPremium && (
          <View style={[styles.badge, styles.premiumBadge]}>
            <Text style={styles.premiumBadgeTxt}>Premium</Text>
          </View>
        )}
        {item.badges?.map((b) => (
          <View key={b} style={styles.badge}>
            <Text style={styles.badgeTxt}>{b}</Text>
          </View>
        ))}
      </View>

      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.city}>{item.city}</Text>
        <View style={styles.pricePill}>
          <Text style={styles.priceTxt}>{item.priceLabel}</Text>
        </View>
        <View style={styles.factsRow}>
          {item.facts?.map((f, i) => (
            <Text key={i} style={styles.fact}>
              {f}
            </Text>
          ))}
          {item.rating ? (
            <Text style={styles.rating}>★ {item.rating}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, overflow: 'hidden', height: 220, backgroundColor: '#111' },
  img: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cardOverlay,
  },
  badgesRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.chip,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadge: {
    backgroundColor: colors.premium,
  },
  badgeTxt: { color: '#fff', fontWeight: '800', fontSize: 11 },
  premiumBadgeTxt: { color: '#000', fontWeight: '800', fontSize: 11 },
  meta: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    gap: 6,
  },
  title: { color: '#fff', fontWeight: '900', fontSize: 16 },
  city: { color: '#E2E8F0', fontWeight: '700', fontSize: 13 },
  pricePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 22,
  },
  priceTxt: { fontWeight: '900', fontSize: 14 },
  factsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    alignItems: 'center',
  },
  fact: { color: '#F1F5F9', fontWeight: '700', fontSize: 12 },
  rating: { marginLeft: 'auto', color: '#FDE68A', fontWeight: '800', fontSize: 13 },
});
