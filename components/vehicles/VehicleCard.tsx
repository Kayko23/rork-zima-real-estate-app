import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { Vehicle } from '@/types/vehicle';
import { Star, Heart, Users, Fuel, Settings } from 'lucide-react-native';
import { colors, radius, shadow } from '@/theme/tokens';
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
        <Pressable 
          onPress={handleToggleFavorite} 
          style={styles.heart} 
          hitSlop={10}
          accessibilityLabel="Ajouter aux favoris"
          testID={`favorite-toggle-${vehicle.id}`}
        >
          <Heart 
            size={22} 
            color={isFav ? '#EF4444' : '#9CA3AF'} 
            fill={isFav ? '#EF4444' : 'transparent'} 
            strokeWidth={2.5} 
          />
        </Pressable>
      </View>

      <View style={styles.bottom}>
        <Text numberOfLines={1} style={styles.title}>
          {vehicle.title} • {vehicle.city}
        </Text>
        <View style={styles.pricePill}>
          <Text style={styles.price}>
            {vehicle.price.toLocaleString()} {vehicle.currency}
          </Text>
        </View>
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
              <Text style={styles.metaTxt}>{vehicle.fuel}</Text>
            </View>
          )}
          {vehicle.gearbox && (
            <View style={styles.metaItem}>
              <Settings size={14} color="#fff" />
              <Text style={styles.metaTxt}>{vehicle.gearbox === 'auto' ? 'Auto' : 'Man'}</Text>
            </View>
          )}
          {vehicle.rating && (
            <View style={[styles.metaItem, { marginLeft: 'auto' }]}>
              <Star size={14} color="#FFD166" fill="#FFD166" />
              <Text style={styles.metaTxt}>{vehicle.rating}</Text>
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
    backgroundColor: colors.panel,
    ...(shadow.card as any),
  },
  image: {
    width: '100%',
    height: 220,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cardOverlay,
  },
  badges: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  premiumBadge: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  kindBadge: {
    backgroundColor: 'rgba(17,24,39,.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  kindText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  heart: {
    marginLeft: 'auto',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,.95)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  bottom: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  pricePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  price: {
    color: colors.chip,
    fontWeight: '800',
    letterSpacing: 0.2,
    fontSize: 13,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: 'rgba(17,24,39,.35)',
    borderRadius: 999,
  },
  metaTxt: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});
