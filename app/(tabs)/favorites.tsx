import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import PropertyCard from '@/components/ui/PropertyCard';
import ProviderCard from '@/components/ui/ProviderCard';
import NotificationBell from '@/components/ui/NotificationBell';
import { mockProperties, mockProviders } from '@/constants/data';
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';

type TabType = 'properties' | 'providers';
type ViewType = 'grid' | 'list';

export default function FavoritesScreen() {
  const { hasUnreadNotifications, markNotificationsAsRead } = useApp();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('properties');
  const [viewType, setViewType] = useState<ViewType>('grid');

  const favoriteProperties = mockProperties.filter(p => p.isFavorite);
  const favoriteProviders = mockProviders.slice(0, 1); // Mock favorites

  const handlePropertyPress = (propertyId: string) => {
    console.log('Property pressed:', propertyId);
  };

  const handleToggleFavorite = (propertyId: string) => {
    console.log('Toggle favorite:', propertyId);
  };

  const handleViewProfile = (providerId: string) => {
    console.log('View profile:', providerId);
  };

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

  const handleNotificationPress = () => {
    markNotificationsAsRead();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoris</Text>
        <NotificationBell 
          hasUnread={hasUnreadNotifications}
          onPress={handleNotificationPress}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'properties' && styles.activeTab]}
          onPress={() => setActiveTab('properties')}
        >
          <Text style={[styles.tabText, activeTab === 'properties' && styles.activeTabText]}>
            Annonces ({favoriteProperties.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'providers' && styles.activeTab]}
          onPress={() => setActiveTab('providers')}
        >
          <Text style={[styles.tabText, activeTab === 'providers' && styles.activeTabText]}>
            Pros ({favoriteProviders.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewButton, viewType === 'grid' && styles.activeViewButton]}
            onPress={() => setViewType('grid')}
          >
            <Grid3X3 size={20} color={viewType === 'grid' ? Colors.primary : Colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewType === 'list' && styles.activeViewButton]}
            onPress={() => setViewType('list')}
          >
            <List size={20} color={viewType === 'list' ? Colors.primary : Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sortButton}>
          <SlidersHorizontal size={20} color={Colors.text.secondary} />
          <Text style={styles.sortText}>Trier</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'properties' ? (
          favoriteProperties.length > 0 ? (
            favoriteProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onPress={() => handlePropertyPress(property.id)}
                onToggleFavorite={() => handleToggleFavorite(property.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Aucun favori</Text>
              <Text style={styles.emptyText}>
                Ajoutez des propriétés à vos favoris pour les retrouver ici
              </Text>
            </View>
          )
        ) : (
          favoriteProviders.length > 0 ? (
            favoriteProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onViewProfile={() => handleViewProfile(provider.id)}
                onCall={() => handleCall(provider.phone)}
                onWhatsApp={() => handleWhatsApp(provider.whatsapp || provider.phone)}
                onEmail={() => handleEmail(provider.email)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Aucun professionnel favori</Text>
              <Text style={styles.emptyText}>
                Ajoutez des professionnels à vos favoris pour les retrouver ici
              </Text>
            </View>
          )
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.background.primary,
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeViewButton: {
    backgroundColor: Colors.background.secondary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background.primary,
    borderRadius: 8,
  },
  sortText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
});