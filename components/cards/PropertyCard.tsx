import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius } from '@/theme/tokens';

export type PropertyItem = {
  id: string;
  title: string;
  city: string;
  priceLabel: string;
  cover?: string;
  badges?: string[];
  facts?: string[];
  rating?: number;
  isPremium?: boolean;
};

export default function PropertyCard({ item }: { item: PropertyItem }) {
  const router = useRouter();
  const validUri = item.cover && item.cover.trim().length > 0 ? item.cover : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } } as any)}
      style={styles.card}
    >
      <Image source={{ uri: validUri }} style={styles.img} resizeMode="cover" />
      <View style={styles.overlay} />

      <View style={styles.badges}>
        {item.isPremium && (
          <View style={[styles.badge, styles.premiumBadge]}>
            <Text style={styles.badgeText}>Premium</Text>
          </View>
        )}
        {item.badges?.map((b) => (
          <View key={b} style={styles.badge}>
            <Text style={styles.badgeText}>{b}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottom}>
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.city}>{item.city}</Text>
        <View style={styles.pricePill}>
          <Text style={styles.price}>{item.priceLabel}</Text>
        </View>
        <View style={styles.metaRow}>
          {item.facts?.map((f, i) => (
            <Text key={i} style={styles.meta}>
              {f}
            </Text>
          ))}
          {item.rating != null && <Text style={styles.rating}>★ {item.rating}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const CARD_H = 220;
const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    height: CARD_H,
    backgroundColor: '#111',
  },
  img: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  badges: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 8,
    zIndex: 2,
  },
  badge: {
    backgroundColor: '#111827AA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadge: {
    backgroundColor: colors.premium,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' as const },
  bottom: { position: 'absolute', left: 12, right: 12, bottom: 12, gap: 6 },
  title: { color: '#fff', fontSize: 16, fontWeight: '900' as const },
  city: { color: '#E2E8F0', fontWeight: '700' as const },
  pricePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 22,
  },
  price: { fontWeight: '900' as const },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 6, alignItems: 'center' },
  meta: { color: '#F1F5F9', fontWeight: '700' as const, fontSize: 12 },
  rating: { marginLeft: 'auto', color: '#FDE68A', fontWeight: '800' as const, fontSize: 12 },
});
