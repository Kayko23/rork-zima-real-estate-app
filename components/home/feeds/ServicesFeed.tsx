import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Search,
  X,
  ChevronDown,
  Grid,
  List,
  Phone,
  MessageCircle as WhatsAppIcon,
  Mail,
  Star,
  MapPin,
  Building2,
} from 'lucide-react-native';
import * as Linking from 'expo-linking';
import FilterChips from '@/components/ui/FilterChips';
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';
import { mockProviders } from '@/constants/data';
import { Provider } from '@/types';

export default function ServicesFeed() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy] = useState<string>('Mieux notés');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { filters, updateFilters } = useApp();

  const handleCall = (phone: string) => {
    if (phone && phone.trim()) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleWhatsApp = (phone: string) => {
    if (phone && phone.trim()) {
      Linking.openURL(`https://wa.me/${phone.replace('+', '')}`);
    }
  };

  const handleEmail = (email: string) => {
    if (email && email.trim()) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handleViewProfile = (providerId: string) => {
    console.log('View profile:', providerId);
  };

  const handleFilterChipPress = (chipId: string) => {
    console.log('Filter chip pressed:', chipId);
  };

  const filteredProviders = useMemo(() => {
    let filtered = [...mockProviders];

    if (filters.country) {
      filtered = filtered.filter(p => p.location.country === filters.country);
    }
    if (filters.city) {
      filtered = filtered.filter(p => p.location.city === filters.city);
    }
    if (filters.category) {
      filtered = filtered.filter(p => p.specialties.includes(filters.category!));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.location.city.toLowerCase().includes(query) ||
        p.location.country.toLowerCase().includes(query) ||
        p.specialties.some(s => s.toLowerCase().includes(query))
      );
    }

    switch (sortBy) {
      case 'Mieux notés':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'Plus d\'annonces':
        filtered.sort((a, b) => b.listingCount - a.listingCount);
        break;
      case 'Récents':
      default:
        break;
    }

    return filtered;
  }, [filters, searchQuery, sortBy]);

  const filterChips = [
    { id: 'country', label: 'Pays' },
    { id: 'city', label: 'Ville' },
    { id: 'category', label: 'Spécialité' },
  ];

  const renderProviderCard = (provider: Provider) => (
    <TouchableOpacity
      key={provider.id}
      style={styles.providerCard}
      onPress={() => handleViewProfile(provider.id)}
      activeOpacity={0.7}
    >
      <View style={styles.providerHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: provider.avatar }} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>
        
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <View style={styles.badgesRow}>
            {provider.isPremium && (
              <View style={[styles.badge, styles.premiumBadge]}>
                <Text style={styles.premiumBadgeText}>Premium</Text>
              </View>
            )}
            {provider.isVerified && (
              <View style={[styles.badge, styles.verifiedBadge]}>
                <Text style={styles.verifiedBadgeText}>Vérifié</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Building2 size={14} color={Colors.text.secondary} />
          <Text style={styles.metaText}>{provider.type === 'agency' ? 'Agence' : 'Agent'}</Text>
        </View>
        <View style={styles.metaItem}>
          <MapPin size={14} color={Colors.text.secondary} />
          <Text style={styles.metaText}>{provider.location.city}, {provider.location.country}</Text>
        </View>
      </View>

      <View style={styles.ratingRow}>
        <View style={styles.ratingContainer}>
          <Star size={14} color={Colors.gold} fill={Colors.gold} />
          <Text style={styles.ratingText}>
            {provider.rating} ({provider.reviewCount} avis)
          </Text>
        </View>
        <Text style={styles.adsCount}>{provider.listingCount} annonces</Text>
      </View>

      <View style={styles.tagsRow}>
        {provider.specialties.map((specialty, index) => (
          <View key={`${provider.id}-specialty-${index}`} style={styles.tag}>
            <Text style={styles.tagText}>{specialty}</Text>
          </View>
        ))}
      </View>

      <View style={styles.galleryRow}>
        {provider.images.slice(0, 3).map((image, index) => (
          <Image key={`${provider.id}-image-${index}`} source={{ uri: image }} style={styles.galleryImage} />
        ))}
        {provider.images.length > 3 && (
          <View style={styles.galleryMore}>
            <Text style={styles.galleryMoreText}>+{provider.images.length - 3}</Text>
          </View>
        )}
      </View>

      <View style={styles.ctaRow}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Voir profil</Text>
        </TouchableOpacity>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(provider.phone)}
          >
            <Phone size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleWhatsApp(provider.whatsapp || provider.phone)}
          >
            <WhatsAppIcon size={20} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEmail(provider.email)}
          >
            <Mail size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services professionnels</Text>
      <Text style={styles.subtitle}>
        Connectez-vous avec des experts immobiliers vérifiés à travers l&apos;Afrique
      </Text>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          {Platform.OS === 'web' ? (
            <View style={[styles.searchBarBackground, styles.webSearchBarBackground]} />
          ) : (
            <BlurView intensity={20} tint="light" style={styles.searchBarBackground} />
          )}
          <View style={styles.searchContent}>
            <Search size={20} color={Colors.text.secondary} />
            <Text style={styles.searchPlaceholder}>
              Rechercher par nom, ville ou spécialité
            </Text>
            {searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={styles.filterRow}>
        <FilterChips 
          chips={filterChips}
          onChipPress={handleFilterChipPress}
          onFilterChange={updateFilters}
          filters={filters}
        />
      </View>

      <View style={styles.listHeader}>
        <View style={styles.listHeaderLeft}>
          <Text style={styles.listTitle}>{filteredProviders.length} professionnels trouvés</Text>
          <Text style={styles.listSubtitle}>Afrique</Text>
        </View>
        <View style={styles.listHeaderRight}>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>{sortBy}</Text>
            <ChevronDown size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? (
              <Grid size={20} color={Colors.text.secondary} />
            ) : (
              <List size={20} color={Colors.text.secondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.providerList}>
        {filteredProviders.map(renderProviderCard)}
      </View>

      <View style={styles.joinCTA}>
        <Text style={styles.joinTitle}>Vous êtes un professionnel de l&apos;immobilier ?</Text>
        <Text style={styles.joinSubtitle}>
          Rejoignez notre réseau de professionnels vérifiés et développez votre activité.
        </Text>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Rejoindre ZIMA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0E1E1B',
    marginBottom: 8,
    paddingHorizontal: 8,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A6B65',
    lineHeight: 22,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  searchSection: {
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  searchBar: {
    height: 56,
    borderRadius: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  searchBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  webSearchBarBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
  },
  searchContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  filterRow: {
    marginBottom: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  listHeaderLeft: {
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0E1E1B',
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  listHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  viewToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerList: {
    paddingHorizontal: 8,
    gap: 16,
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0B5E55',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0E1E1B',
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadge: {
    backgroundColor: '#8A641F',
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    backgroundColor: '#0B5E55',
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  adsCount: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F6F7F8',
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  galleryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  galleryImage: {
    width: 88,
    height: 64,
    borderRadius: 12,
  },
  galleryMore: {
    width: 88,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  ctaRow: {
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0B5E55',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B5E55',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F6F7F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinCTA: {
    marginTop: 32,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  joinTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0E1E1B',
    textAlign: 'center',
    marginBottom: 8,
  },
  joinSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  joinButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#0B5E55',
    borderRadius: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});