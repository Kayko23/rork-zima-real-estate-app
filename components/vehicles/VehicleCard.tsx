import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import type { Vehicle } from '@/types/vehicle';
import { Star } from 'lucide-react-native';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop';
function getSafeImage(uri?: string) {
  const safe = (uri ?? '').trim();
  return safe ? { uri: safe } : { uri: PLACEHOLDER_IMAGE };
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const kindLabel = {
    vip: 'VIP',
    driver: 'Chauffeur',
    rent: 'Location',
    sale: 'Vente',
  }[vehicle.kind];

  return (
    <Link href={`/vehicles/${vehicle.id}` as any} asChild>
      <Pressable style={styles.card} testID={`vehicle-card-${vehicle.id}`}>
        <Image source={getSafeImage(vehicle.image)} style={styles.image} />
        {vehicle.premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {vehicle.title}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {vehicle.city}
          </Text>
          <View style={styles.footer}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {vehicle.price.toLocaleString()} {vehicle.currency}
              </Text>
              <Text style={styles.kind}>{kindLabel}</Text>
            </View>
            {vehicle.rating && (
              <View style={styles.ratingRow}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.rating}>{vehicle.rating}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginRight: 14,
  },
  image: {
    width: '100%',
    height: 170,
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#0e5a43',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
  },
  location: {
    color: '#6b7280',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  price: {
    fontWeight: '700',
    fontSize: 14,
  },
  kind: {
    color: '#6b7280',
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
});
