import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  ChevronDown,
  Grid,
  List,
} from 'lucide-react-native';
import FusedSearch from '@/components/search/FusedSearch';
import ProCard, { ProItem } from '@/components/ui/ProCard';
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';
import { mockProviders } from '@/constants/data';

import { T } from '@/constants/typography';

export default function ServicesFeed() {
  const [searchQuery] = useState<string>('');
  const [sortBy] = useState<string>('Mieux notés');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { filters } = useApp();

  const handleViewProfile = (item: ProItem) => {
    console.log('View profile:', item.id);
  };

  const handleSearchSubmit = (params: any) => {
    if (!params || typeof params !== 'object') return;
    // Validation des paramètres de recherche
    if (params.country && typeof params.country === 'string' && params.country.trim().length > 0) {
      console.log('Search country:', params.country.trim());
    }
    if (params.city && typeof params.city === 'string' && params.city.trim().length > 0) {
      console.log('Search city:', params.city.trim());
    }
    // Traitement des paramètres validés
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

  // Convertir les données Provider en ProItem
  const proItems: ProItem[] = useMemo(() => {
    return filteredProviders.map(provider => ({
      id: provider.id,
      name: provider.name,
      avatarUrl: provider.avatar,
      isVerified: provider.isVerified,
      isPremium: provider.isPremium,
      role: provider.type === 'agency' ? 'Agence' : 'Agent',
      city: provider.location.city,
      country: provider.location.country,
      rating: provider.rating,
      reviews: provider.reviewCount,
      listings: provider.listingCount,
      specialties: provider.specialties,
      gallery: [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      ],
      phone: provider.phone,
      email: provider.email,
      whatsapp: provider.whatsapp || provider.phone,
      online: Math.random() > 0.5, // Simuler le statut en ligne
    }));
  }, [filteredProviders]);

  return (
    <View style={styles.container}>
      <FusedSearch mode="services" onSubmit={handleSearchSubmit} />
      <Text style={[T.h2, { marginTop: 18 }]}>2 professionnels trouvés</Text>

      <View style={styles.listHeader}>
        <View style={styles.listHeaderLeft}>
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

      <FlatList
        data={proItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProCard
            item={item}
            onPressProfile={handleViewProfile}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

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
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
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
  listContent: {
    paddingBottom: 100,
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