import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockProviders } from '@/constants/data';
import Colors from '@/constants/colors';
import Type from '@/constants/typography';

export default function ProviderProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const provider = mockProviders.find(p => p.id === id);

  if (!provider) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Professionnel introuvable' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Professionnel introuvable</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const openPhone = () => {
    if (provider.phone) Linking.openURL(`tel:${provider.phone}`);
  };

  const openEmail = () => {
    if (provider.email) Linking.openURL(`mailto:${provider.email}`);
  };

  const openWhatsApp = () => {
    if (provider.whatsapp) {
      const url = `whatsapp://send?phone=${provider.whatsapp}`;
      Linking.openURL(url).catch(() =>
        Linking.openURL(`https://wa.me/${provider.whatsapp}`)
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: provider.name,
          headerStyle: { backgroundColor: Colors.background.primary },
          headerTintColor: Colors.text.primary,
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: provider.avatar }}
              style={styles.avatar}
            />
            <View style={styles.onlineDot} />
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{provider.name}</Text>
            
            <View style={styles.badgesRow}>
              {provider.isPremium && (
                <View style={[styles.badge, styles.premiumBadge]}>
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </View>
              )}
              {provider.isVerified && (
                <View style={[styles.badge, styles.verifiedBadge]}>
                  <Ionicons name="checkmark-circle" size={14} color="#fff" />
                  <Text style={styles.verifiedBadgeText}>Vérifié</Text>
                </View>
              )}
            </View>
            
            <View style={styles.metaRow}>
              <MaterialCommunityIcons
                name={provider.type === 'agency' ? 'office-building' : 'account-tie'}
                size={16}
                color={Colors.text.secondary}
              />
              <Text style={styles.metaText}>
                {provider.type === 'agency' ? 'Agence' : 'Agent'}
              </Text>
              <Text style={styles.dot}> • </Text>
              <Ionicons name="location-sharp" size={14} color={Colors.text.secondary} />
              <Text style={styles.metaText}>
                {provider.location.city}, {provider.location.country}
              </Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.statValue}>{provider.rating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>({provider.reviewCount} avis)</Text>
              </View>
              <Text style={styles.dot}> • </Text>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{provider.listingCount}</Text>
                <Text style={styles.statLabel}>annonces</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spécialités</Text>
          <View style={styles.specialtiesRow}>
            {provider.specialties.map((specialty) => (
              <View key={specialty} style={styles.specialtyChip}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Gallery */}
        {provider.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Galerie</Text>
            <FlatList
              data={provider.images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `gallery-${index}`}
              contentContainerStyle={styles.galleryContainer}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.galleryImage} />
              )}
            />
          </View>
        )}

        {/* Contact Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactActions}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={openPhone}
              disabled={!provider.phone}
            >
              <Ionicons name="call" size={24} color={Colors.primary} />
              <Text style={styles.contactButtonText}>Appeler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.contactButton}
              onPress={openWhatsApp}
              disabled={!provider.whatsapp}
            >
              <Ionicons name="logo-whatsapp" size={24} color={Colors.primary} />
              <Text style={styles.contactButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.contactButton}
              onPress={openEmail}
              disabled={!provider.email}
            >
              <Ionicons name="mail" size={24} color={Colors.primary} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message Button */}
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => router.push(`/chat/${provider.id}`)}
        >
          <Ionicons name="chatbubble" size={20} color="#fff" />
          <Text style={styles.messageButtonText}>Envoyer un message</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    ...Type.h2,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.border.light,
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    ...Type.h2,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumBadge: {
    backgroundColor: '#B58835',
  },
  premiumBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: '#1B9E6A',
  },
  verifiedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  dot: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: Colors.text.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  statLabel: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  section: {
    padding: 24,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    ...Type.h3,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  specialtyText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  galleryContainer: {
    gap: 12,
  },
  galleryImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
    backgroundColor: Colors.border.light,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  contactButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
  },
  contactButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    gap: 8,
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});