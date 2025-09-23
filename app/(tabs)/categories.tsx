import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Home, Building, Store, Building2, Map, Factory } from 'lucide-react-native';
import SearchBar from '@/components/ui/SearchBar';
import FilterChips from '@/components/ui/FilterChips';
import NotificationBell from '@/components/ui/NotificationBell';
import { categories } from '@/constants/data';
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';
import { FilterState } from '@/types';

const categoryIcons = {
  home: Home,
  building: Building,
  store: Store,
  'building-2': Building2,
  map: Map,
  factory: Factory,
};

export default function CategoriesScreen() {
  const { hasUnreadNotifications, markNotificationsAsRead } = useApp();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'recent'
  });

  const filterChips = [
    { id: 'country', label: 'Pays', value: 'Tous les pays' },
    { id: 'city', label: 'Ville', value: 'Toutes les villes' },
  ];

  const handleFilterChipPress = (chipId: string) => {
    console.log('Filter chip pressed:', chipId);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleFilterPress = () => {
    console.log('Filter button pressed');
  };

  const handleCategoryPress = (categoryId: string) => {
    console.log('Category pressed:', categoryId);
  };

  const handleNotificationPress = () => {
    markNotificationsAsRead();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Recherche par catégorie</Text>
        <NotificationBell 
          hasUnread={hasUnreadNotifications}
          onPress={handleNotificationPress}
        />
      </View>

      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={handleFilterPress}
          placeholder="Rechercher une catégorie..."
        />
        
        <FilterChips 
          chips={filterChips} 
          onChipPress={handleFilterChipPress}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        
        <View style={styles.categoriesGrid}>
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons];
            
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
              >
                <View style={styles.categoryIcon}>
                  <IconComponent size={24} color={Colors.primary} />
                </View>
                
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.count} biens</Text>
                </View>
                
                <ChevronRight size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            );
          })}
        </View>

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
  searchSection: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(14, 90, 69, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  bottomSpacer: {
    height: 100,
  },
});