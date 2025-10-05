import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { Vehicle } from '@/types/vehicle';
import { Star, Heart, Users, Fuel, Settings } from 'lucide-react-native';
import { radius, shadow } from '@/theme/tokens';
import { useApp } from '@/hooks/useAppStore';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop';
function getSafeImage(uri?: string) {
  const safe = (uri ?? '').trim();
  return safe ? { uri: safe } : { uri: PLACEHOLDER_IMAGE };
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const { isFavoriteVehicle, toggleFavoriteVehicle } = useApp();
  const isFav = isFavoriteVehicle?.(vehicle.id) ?? false;

  const kindLabel = {
    vip: 'VIP',
    driver: 'Chauffeur',
    rent: 'Location',
    sale: 'Vente',
  }[vehicle.kind];

  const fuelLabel: Record<string, string> = {
    Diesel: 'Diesel',
    Essence: 'Essence',
    Electrique: 'Électrique',
    Hybride: 'Hybride',
    GPL: 'GPL',
  };

  const pricePerDay = vehicle.kind === 'rent' || vehicle.kind === 'vip' || vehicle.kind === 'driver';

  const handlePress = () => {
    router.push(`/vehicles/${vehicle.id}` as any);
  };

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation();
    if (toggleFavoriteVehicle) {
      toggleFavoriteVehicle(vehicle.id);
    }
  };

  return (
    <Pressable 
      onPress={handlePress} 
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.995 }] }]} 
      testID={`vehicle-card-${vehicle.id}`}
    >
      <Image source={getSafeImage(vehicle.image)} style={styles.image} />
      <View style={styles.overlay} />
      
      <View style={styles.badgesRow}>
        <View style={styles.badges}>
          {vehicle.premium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          {kindLabel && (
            <View style={styles.kindBadge}>
              <Text style={styles.kindText}>{kindLabel}</Text>
            </View>
          )}
        </View>
        <Pressable 
          onPress={handleToggleFavorite} 
          style={styles.heart} 
          hitSlop={10}
          accessibilityLabel="Ajouter aux favoris"
          testID={`favorite-toggle-${vehicle.id}`}
        >
          <Heart 
            size={22} 
            color={isFav ? '#EF4444' : '#fff'} 
            fill={isFav ? '#EF4444' : 'transparent'} 
            strokeWidth={2.5} 
          />
        </Pressable>
      </View>

      <View style={styles.bottom}>
        <Text numberOfLines={1} style={styles.title}>
          {vehicle.title} • {vehicle.city}
        </Text>
        {pricePerDay ? (
          <View style={styles.pricePill}>
            <Text style={styles.price}>
              {vehicle.price.toLocaleString('fr-FR')} {vehicle.currency}
            </Text>
            <Text style={styles.perDay}> / jour</Text>
          </View>
        ) : (
          <View style={styles.pricePill}>
            <Text style={styles.price}>
              {vehicle.price.toLocaleString('fr-FR')} {vehicle.currency}
            </Text>
          </View>
        )}
        <View style={styles.meta}>
          {vehicle.seats && (
            <View style={styles.metaItem}>
              <Users size={14} color="#fff" />
              <Text style={styles.metaTxt}>{vehicle.seats}</Text>
            </View>
          )}
          {vehicle.fuel && (
            <View style={styles.metaItem}>
              <Fuel size={14} color="#fff" />
              <Text style={styles.metaTxt}>{fuelLabel[vehicle.fuel] || vehicle.fuel}</Text>
            </View>
          )}
          {vehicle.gearbox && (
            <View style={styles.metaItem}>
              <Settings size={14} color="#fff" />
              <Text style={styles.metaTxt}>{vehicle.gearbox === 'auto' ? 'Auto' : 'Manuelle'}</Text>
            </View>
          )}
          {vehicle.rating && (
            <View style={styles.metaItem}>
              <Star size={14} color="#FFD166" fill="#FFD166" />
              <Text style={styles.metaTxt}>{vehicle.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
    ...(shadow.card as any),
  },
  image: {
    width: '100%',
    height: 210,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  badgesRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  premiumBadge: {
    backgroundColor: '#E4B200',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  kindBadge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  kindText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  heart: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.4)',
  },
  bottom: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
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
  price: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  perDay: {
    marginLeft: 6,
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderRadius: 18,
  },
  metaTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});
