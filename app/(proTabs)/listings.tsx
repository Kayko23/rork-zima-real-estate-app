import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import NotificationBell from '@/components/ui/NotificationBell';
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';
import { Listing, ListingStatus, fetchListings } from '@/services/annonces.api';
import ListingCard from '@/components/provider/ListingCard';

export default function ListingsScreen() {
  const { hasUnreadNotifications, markNotificationsAsRead } = useApp();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ListingStatus>('active');
  const [data, setData] = useState<Listing[]|null>(null);

  async function loadListings() {
    setData(null);
    const rows = await fetchListings(activeTab);
    setData(rows);
  }

  useEffect(() => {
    loadListings();
  }, [activeTab]);

  const handleCreateListing = () => {
    router.push('/provider/annonces/new');
  };

  const handleNotificationPress = () => {
    markNotificationsAsRead();
    router.push('/notifications');
  };

  const tabs = [
    { id: 'active' as ListingStatus, label: 'Actives', count: data?.length ?? 0 },
    { id: 'pending' as ListingStatus, label: 'En attente', count: 0 },
    { id: 'expired' as ListingStatus, label: 'Expirées', count: 0 },
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

      {!data ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard item={item} />}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        />
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

});