import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useVehicle } from '@/hooks/useVehicles';
import { Star, Users } from 'lucide-react-native';

export default function VehicleDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: vehicle, isLoading } = useVehicle(id);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Détails' }} />
        <ActivityIndicator size="large" color="#0e5a43" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Détails' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Véhicule introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const kindLabel = {
    vip: 'Véhicule VIP avec chauffeur',
    driver: 'Chauffeur professionnel',
    rent: 'Véhicule en location',
    sale: 'Véhicule à vendre',
  }[vehicle.kind];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: vehicle.title,
          headerBackTitle: 'Retour',
        }}
      />
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: vehicle.image }} style={styles.image} />
        <View style={styles.content}>
          {vehicle.premium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          <Text style={styles.title}>{vehicle.title}</Text>
          <Text style={styles.location}>{vehicle.city}</Text>

          <View style={styles.infoRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {vehicle.price.toLocaleString()} {vehicle.currency}
              </Text>
            </View>
            {vehicle.rating && (
              <View style={styles.ratingContainer}>
                <Star size={18} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.rating}>{vehicle.rating}</Text>
              </View>
            )}
          </View>

          <View style={styles.kindContainer}>
            <Text style={styles.kindLabel}>{kindLabel}</Text>
          </View>

          {vehicle.seats && (
            <View style={styles.seatsContainer}>
              <Users size={20} color="#6b7280" />
              <Text style={styles.seatsText}>{vehicle.seats} places</Text>
            </View>
          )}

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {vehicle.kind === 'vip'
                ? 'Véhicule haut de gamme avec chauffeur professionnel pour vos déplacements en toute sérénité.'
                : vehicle.kind === 'driver'
                ? 'Chauffeur expérimenté et professionnel disponible pour tous vos trajets.'
                : vehicle.kind === 'rent'
                ? 'Véhicule disponible à la location pour vos déplacements quotidiens ou occasionnels.'
                : 'Véhicule en excellent état, prêt à être acquis.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loader: {
    marginTop: 40,
  },
  notFound: {
    padding: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  notFoundText: {
    fontSize: 16,
    color: '#6b7280',
  },
  image: {
    width: '100%',
    height: 260,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0e5a43',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  premiumText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  location: {
    color: '#6b7280',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontWeight: '800',
    fontSize: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  kindContainer: {
    marginTop: 8,
  },
  kindLabel: {
    fontSize: 16,
    color: '#0e5a43',
    fontWeight: '600',
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  seatsText: {
    fontSize: 16,
    color: '#6b7280',
  },
  descriptionContainer: {
    marginTop: 20,
    gap: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  descriptionText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
});
