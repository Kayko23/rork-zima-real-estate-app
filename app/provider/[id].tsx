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
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProviderById } from '@/constants/data';
import { providers } from '@/constants/professionals';
import Colors from '@/constants/colors';
import Type from '@/constants/typography';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Star,
  CheckCircle,
  Crown,
  Building,
  User,
  Calendar,
  Globe,
  ChevronRight,
  Heart,
  Share,
} from 'lucide-react-native';

export default function ProviderProfile() {
  const params = useLocalSearchParams();
  console.log('[ProviderProfile] Raw params:', params);
  
  let provider: any = null;
  
  try {
    // Extract ID from params safely
    let providerId: string | undefined;
    
    if (params && typeof params === 'object') {
      if (Array.isArray(params.id)) {
        providerId = params.id[0];
      } else if (typeof params.id === 'string') {
        providerId = params.id;
      } else if (params.id) {
        providerId = String(params.id);
      }
    }
    
    console.log('[ProviderProfile] Extracted ID:', providerId, 'Type:', typeof providerId);
    
    if (!providerId || typeof providerId !== 'string' || providerId.trim() === '') {
      console.log('[ProviderProfile] Invalid ID provided:', providerId);
      provider = null;
    } else {
      const cleanId = providerId.trim();
      console.log('[ProviderProfile] Looking for provider with clean ID:', cleanId);
      
      // First try to find in professionals providers
      const professionalProvider = providers.find(p => String(p.id) === cleanId);
      
      if (professionalProvider) {
        // Map the professional provider to the expected format
        provider = {
          id: professionalProvider.id,
          name: professionalProvider.name,
          type: professionalProvider.category === 'agency' ? 'agency' : 'agent',
          avatar: professionalProvider.avatar || 'https://i.pravatar.cc/150',
          cover: professionalProvider.cover || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
          rating: professionalProvider.rating || 4.0,
          reviewCount: professionalProvider.reviews || 0,
          location: {
            city: professionalProvider.city || 'Ville',
            country: professionalProvider.country || 'Pays'
          },
          specialties: professionalProvider.tags || ['Résidentiel'],
          isVerified: professionalProvider.badges?.includes('verified') || false,
          isPremium: professionalProvider.badges?.includes('premium') || false,
          phone: '+233244123456',
          email: `contact@${professionalProvider.name.toLowerCase().replace(/\s+/g, '')}.com`,
          whatsapp: '+233244123456',
          listingCount: professionalProvider.listings || 0,
          images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
          ],
          languages: ['Français', 'English'],
          zones: ['Centre-ville', 'Résidentiel', 'Commercial'],
          listings: [
            {
              id: 'l1',
              title: 'Villa moderne avec piscine',
              city: professionalProvider.city,
              country: professionalProvider.country,
              price: '$2,500/mois',
              status: 'À louer' as const,
              thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
            },
            {
              id: 'l2',
              title: 'Penthouse centre-ville',
              city: professionalProvider.city,
              country: professionalProvider.country,
              price: '$450,000',
              status: 'À vendre' as const,
              thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            },
          ],
          reviews: [
            {
              id: 'r1',
              author: 'Emeka Nwankwo',
              rating: 5,
              text: 'Excellent service ! Très professionnel et à l\'écoute.',
              date: '30/10/2024',
            },
            {
              id: 'r2',
              author: 'Fatou Sall',
              rating: 5,
              text: 'Service impeccable. Connaît très bien le marché local.',
              date: '15/10/2024',
            },
          ],
        };
        console.log('[ProviderProfile] Mapped professional provider:', provider.name);
      } else {
        // Fallback to getProviderById
        try {
          provider = getProviderById(cleanId);
          console.log('[ProviderProfile] Found provider via getProviderById:', provider ? provider.name : 'NOT FOUND');
        } catch (providerError) {
          console.error('[ProviderProfile] Error in getProviderById:', providerError);
          provider = null;
        }
      }
    }
  } catch (error) {
    console.error('[ProviderProfile] Error getting provider:', error);
    provider = null;
  }

  if (!provider) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Professionnel introuvable', headerShown: false }} />
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorText}>Professionnel introuvable</Text>
          <Text style={styles.errorSubtext}>Le professionnel que vous recherchez n&apos;existe pas ou a été supprimé.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  const openPhone = () => {
    if (provider?.phone) {
      try {
        Linking.openURL(`tel:${provider.phone}`);
      } catch (error) {
        console.error('Error opening phone:', error);
      }
    }
  };

  const openEmail = () => {
    if (provider?.email) {
      try {
        Linking.openURL(`mailto:${provider.email}`);
      } catch (error) {
        console.error('Error opening email:', error);
      }
    }
  };

  const openWhatsApp = () => {
    if (provider?.whatsapp) {
      try {
        const cleanPhone = provider.whatsapp.replace(/[^0-9+]/g, '');
        const url = `whatsapp://send?phone=${cleanPhone}`;
        Linking.openURL(url).catch(() =>
          Linking.openURL(`https://wa.me/${cleanPhone}`)
        );
      } catch (error) {
        console.error('Error opening WhatsApp:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: provider.cover || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop' }}
            style={styles.coverImage}
          />
          <View style={styles.coverOverlay} />
          
          {/* Header Actions */}
          <SafeAreaView style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronRight size={24} color="#fff" style={styles.backIcon} />
            </TouchableOpacity>
            <View style={styles.headerRightActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Heart size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Share size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: provider.avatar || 'https://i.pravatar.cc/150' }}
              style={styles.avatar}
            />
            <View style={styles.onlineDot} />
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{provider.name}</Text>
            
            <View style={styles.badgesRow}>
              {provider.isPremium && (
                <View style={[styles.badge, styles.premiumBadge]}>
                  <Crown size={12} color="#fff" />
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </View>
              )}
              {provider.isVerified && (
                <View style={[styles.badge, styles.verifiedBadge]}>
                  <CheckCircle size={12} color="#fff" />
                  <Text style={styles.verifiedBadgeText}>Vérifié</Text>
                </View>
              )}
            </View>
            
            <View style={styles.metaRow}>
              {provider.type === 'agency' ? (
                <Building size={16} color={Colors.text.secondary} />
              ) : (
                <User size={16} color={Colors.text.secondary} />
              )}
              <Text style={styles.metaText}>
                {provider.type === 'agency' ? 'Agence' : 'Agent'}
              </Text>
              <Text style={styles.dot}> • </Text>
              <MapPin size={14} color={Colors.text.secondary} />
              <Text style={styles.metaText}>
                {provider.location?.city || 'Ville'}, {provider.location?.country || 'Pays'}
              </Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <Text style={styles.statValue}>{Number(provider.rating || 0).toFixed(1)}</Text>
                <Text style={styles.statLabel}>({provider.reviewCount || provider.reviews || 0} avis)</Text>
              </View>
              <Text style={styles.dot}> • </Text>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{provider.listingCount || provider.listings || 0}</Text>
                <Text style={styles.statLabel}>annonces</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={openPhone}
            disabled={!provider.phone}
          >
            <Phone size={20} color={Colors.primary} />
            <Text style={styles.quickActionText}>Appeler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={openWhatsApp}
            disabled={!provider.whatsapp}
          >
            <MessageCircle size={20} color={Colors.primary} />
            <Text style={styles.quickActionText}>WhatsApp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={openEmail}
            disabled={!provider.email}
          >
            <Mail size={20} color={Colors.primary} />
            <Text style={styles.quickActionText}>Email</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.aboutGrid}>
            <View style={styles.aboutItem}>
              <Globe size={16} color={Colors.text.secondary} />
              <Text style={styles.aboutLabel}>Langues</Text>
              <Text style={styles.aboutValue}>{provider.languages?.join(', ') || 'Français, English'}</Text>
            </View>
            <View style={styles.aboutItem}>
              <MapPin size={16} color={Colors.text.secondary} />
              <Text style={styles.aboutLabel}>Zones d&apos;activité</Text>
              <Text style={styles.aboutValue}>{provider.zones?.join(', ') || 'Centre-ville, Résidentiel'}</Text>
            </View>
            <View style={styles.aboutItem}>
              <Calendar size={16} color={Colors.text.secondary} />
              <Text style={styles.aboutLabel}>Membre depuis</Text>
              <Text style={styles.aboutValue}>2022</Text>
            </View>
          </View>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spécialités</Text>
          <View style={styles.specialtiesRow}>
            {(provider.specialties || []).map((specialty: string) => (
              <View key={specialty} style={styles.specialtyChip}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Annonces récentes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {provider.listings?.map((listing: any) => (
            <TouchableOpacity key={listing.id} style={styles.listingCard}>
              <Image source={{ uri: listing.thumbnail }} style={styles.listingImage} />
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle}>{listing.title}</Text>
                <Text style={styles.listingLocation}>
                  {listing.city}, {listing.country}
                </Text>
                <View style={styles.listingMeta}>
                  <Text style={styles.listingPrice}>{listing.price}</Text>
                  <View style={[styles.statusBadge, 
                    listing.status === 'À vendre' ? styles.forSaleBadge : styles.forRentBadge
                  ]}>
                    <Text style={styles.statusText}>{listing.status}</Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Avis clients</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {provider.reviews?.map((review: any) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.author}</Text>
                <View style={styles.reviewRating}>
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={`star-${starIndex}`}
                      size={12}
                      color={starIndex < review.rating ? '#f59e0b' : '#e5e7eb'}
                      fill={starIndex < review.rating ? '#f59e0b' : '#e5e7eb'}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>

        {/* Gallery */}
        {provider.images && provider.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Galerie</Text>
            <FlatList
              data={provider.images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `gallery-${index}`}
              contentContainerStyle={styles.galleryContainer}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <Image source={{ uri: item }} style={styles.galleryImage} />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Contact Button */}
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={() => {
              try {
                router.push({ 
                  pathname: '/chat/[id]', 
                  params: { 
                    id: String(provider.id), 
                    ctx: 'service',
                    name: provider.name 
                  } 
                });
              } catch (error) {
                console.error('Error navigating to chat:', error);
              }
            }}
          >
            <MessageCircle size={20} color="#fff" />
            <Text style={styles.messageButtonText}>Envoyer un message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    ...Type.h2,
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Cover section
  coverContainer: {
    position: 'relative',
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.border.light,
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  backIcon: {
    transform: [{ rotate: '180deg' }],
  },
  // Profile header
  profileHeader: {
    flexDirection: 'row',
    padding: 24,
    backgroundColor: '#fff',
    marginTop: -40,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.border.light,
    borderWidth: 3,
    borderColor: '#fff',
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
    marginLeft: 4,
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
  // Quick actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  // About section
  aboutGrid: {
    gap: 16,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aboutLabel: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
    minWidth: 100,
  },
  aboutValue: {
    color: Colors.text.primary,
    fontSize: 14,
    flex: 1,
  },
  // Sections
  section: {
    padding: 24,
    backgroundColor: '#fff',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    ...Type.h3,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  // Specialties
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
  // Listings
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  listingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.border.light,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  listingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  forSaleBadge: {
    backgroundColor: '#e3f2fd',
  },
  forRentBadge: {
    backgroundColor: '#f3e5f5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  // Reviews
  reviewCard: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  // Gallery
  galleryContainer: {
    gap: 12,
  },
  galleryImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
    backgroundColor: Colors.border.light,
  },
  // Bottom actions
  bottomActions: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});