import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ListingCover from '@/components/common/ListingCover';

export type FuelType = 'diesel' | 'essence' | 'electrique' | 'hybride' | 'gpl' | 'autre';
export type Transmission = 'auto' | 'manuelle';

export type VehicleItem = {
  id: string;
  title: string;
  city: string;
  imageUrl?: string;
  isPremium?: boolean;
  isVip?: boolean;

  forRent?: boolean;
  pricePerDay?: number;
  currency?: 'XOF' | 'FCFA' | 'USD' | 'EUR';

  seats?: number;
  fuel?: FuelType;
  transmission?: Transmission;
  rating?: number;

  // Legacy support
  priceLabel?: string;
  cover?: string;
  badges?: string[];
};

const fuelLabel: Record<FuelType, string> = {
  diesel: 'Diesel',
  essence: 'Essence',
  electrique: 'Électrique',
  hybride: 'Hybride',
  gpl: 'GPL',
  autre: 'Autre',
};

const transLabel: Record<Transmission, string> = {
  auto: 'Auto',
  manuelle: 'Manuelle',
};

export default function VehicleCard({ item }: { item: VehicleItem }) {
  const router = useRouter();
  const imageSource = item.imageUrl || item.cover;
  
  const currency = item.currency ?? 'XOF';
  const showPrice = item.forRent !== false && typeof item.pricePerDay === 'number';
  const displayPrice = item.priceLabel || (showPrice ? `${new Intl.NumberFormat('fr-FR').format(item.pricePerDay!)} ${currency}` : '');

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/vehicles/[id]', params: { id: item.id } } as any)}
      style={styles.card}
    >
      <ListingCover url={imageSource} style={styles.img} />

      <View style={styles.badgesLeft}>
        {item.isPremium && <Badge text="Premium" tone="gold" />}
        {item.isVip && <Badge text="VIP" tone="dark" />}
        {item.badges?.map((b) => <Badge key={b} text={b} tone="dark" />)}
      </View>

      <View style={styles.overlay}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title} • {item.city}
        </Text>

        {displayPrice ? (
          <View style={styles.pricePill}>
            <Text style={styles.price}>{displayPrice}</Text>
            {showPrice && <Text style={styles.perDay}> / jour</Text>}
          </View>
        ) : null}

        <View style={styles.metaRow}>
          {!!item.seats && <Chip icon="👥" label={`${item.seats}`} />}
          {!!item.fuel && <Chip icon="🛢️" label={fuelLabel[item.fuel]} />}
          {!!item.transmission && <Chip icon="⚙️" label={transLabel[item.transmission]} />}
          {!!item.rating && <Chip icon="⭐" label={item.rating.toFixed(1)} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function Badge({ text, tone }: { text: string; tone: 'gold' | 'dark' }) {
  return (
    <View style={[styles.badge, tone === 'gold' ? styles.badgeGold : styles.badgeDark]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{icon} {label}</Text>
    </View>
  );
}

const CARD_H = 210;
const RADIUS = 18;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_H,
    borderRadius: RADIUS,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  img: { width: '100%', height: '100%' },

  badgesLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 10,
    zIndex: 2,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeGold: { backgroundColor: '#E4B200' },
  badgeDark: { backgroundColor: '#1F2937' },
  badgeText: { fontSize: 11, color: '#fff', fontWeight: '700' as const },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800' as const,
    marginBottom: 8,
  },

  pricePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
  },
  price: { fontSize: 15, fontWeight: '900' as const, color: '#0F172A' },
  perDay: { fontSize: 12, marginLeft: 4, color: '#475569', fontWeight: '600' as const },

  metaRow: { flexDirection: 'row', gap: 10 },
  chip: {
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontSize: 11, color: '#fff', fontWeight: '700' as const },
});
