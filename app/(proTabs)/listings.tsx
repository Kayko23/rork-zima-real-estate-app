import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Eye, Edit, Pause, TrendingUp, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import PropertyCard from '@/components/ui/PropertyCard';
import NotificationBell from '@/components/ui/NotificationBell';
import { mockProperties } from '@/constants/data';
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';

type ListingTab = 'active' | 'pending' | 'expired';

export default function ListingsScreen() {
  const { hasUnreadNotifications, markNotificationsAsRead } = useApp();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ListingTab>('active');

  const listings = {
    active: mockProperties,
    pending: [],
    expired: [],
  };

  const handleCreateListing = () => {
    console.log('Create new listing');
    // Navigate to create listing form
    router.push('/property/create');
  };

  const handleListingAction = (listingId: string, action: string) => {
    console.log(`Listing ${listingId} - ${action}`);
    switch (action) {
      case 'edit':
        router.push(`/property/edit/${listingId}`);
        break;
      case 'adjust':
        router.push(`/property/adjust/${listingId}`);
        break;
      case 'pause':
        console.log('Pausing listing');
        break;
      case 'boost':
        router.push(`/property/boost/${listingId}`);
        break;
      case 'delete':
        console.log('Deleting listing');
        break;
    }
  };

  const handlePropertyPress = (propertyId: string) => {
    console.log('Property pressed:', propertyId);
    router.push(`/property/${propertyId}`);
  };

  const handleToggleFavorite = (propertyId: string) => {
    console.log('Toggle favorite:', propertyId);
  };

  const handleNotificationPress = () => {
    markNotificationsAsRead();
    router.push('/notifications');
  };

  const tabs = [
    { id: 'active' as ListingTab, label: 'Actives', count: listings.active.length },
    { id: 'pending' as ListingTab, label: 'En attente', count: listings.pending.length },
    { id: 'expired' as ListingTab, label: 'Expirées', count: listings.expired.length },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes annonces</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleCreateListing}
          >
            <Plus size={20} color={Colors.background.primary} />
          </TouchableOpacity>
          <NotificationBell 
            hasUnread={hasUnreadNotifications}
            onPress={handleNotificationPress}
          />
        </View>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {listings[activeTab].length > 0 ? (
          listings[activeTab].map((property) => (
            <View key={property.id} style={styles.listingContainer}>
              <PropertyCard
                property={property}
                onPress={() => handlePropertyPress(property.id)}
                onToggleFavorite={() => handleToggleFavorite(property.id)}
              />
              
              <View style={styles.listingStats}>
                <View style={styles.statItem}>
                  <Eye size={16} color={Colors.text.secondary} />
                  <Text style={styles.statText}>{property.views} vues</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statText}>3 contacts</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: Colors.success }]}>
                  <Text style={styles.statusText}>Actif</Text>
                </View>
              </View>
              
              <View style={styles.listingActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleListingAction(property.id, 'edit')}
                >
                  <Edit size={16} color={Colors.primary} />
                  <Text style={styles.actionText}>Modifier</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleListingAction(property.id, 'adjust')}
                >
                  <TrendingUp size={16} color={Colors.warning} />
                  <Text style={styles.actionText}>Ajuster</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleListingAction(property.id, 'pause')}
                >
                  <Pause size={16} color={Colors.text.secondary} />
                  <Text style={styles.actionText}>Pause</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleListingAction(property.id, 'boost')}
                >
                  <TrendingUp size={16} color={Colors.gold} />
                  <Text style={styles.actionText}>Boost</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleListingAction(property.id, 'delete')}
                >
                  <Trash2 size={16} color={Colors.error} />
                  <Text style={[styles.actionText, { color: Colors.error }]}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Plus size={48} color={Colors.text.secondary} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'active' && 'Aucune annonce active'}
              {activeTab === 'pending' && 'Aucune annonce en attente'}
              {activeTab === 'expired' && 'Aucune annonce expirée'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active' && 'Créez votre première annonce pour commencer'}
              {activeTab === 'pending' && 'Les annonces en cours de validation apparaîtront ici'}
              {activeTab === 'expired' && 'Les annonces expirées apparaîtront ici'}
            </Text>
            {activeTab === 'active' && (
              <TouchableOpacity style={styles.createButton} onPress={handleCreateListing}>
                <Text style={styles.createButtonText}>Créer une annonce</Text>
              </TouchableOpacity>
            )}
          </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listingContainer: {
    marginBottom: 24,
  },
  listingStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 12,
    marginTop: -8,
    marginHorizontal: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  statusText: {
    color: Colors.background.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  listingActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createButtonText: {
    color: Colors.background.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
});