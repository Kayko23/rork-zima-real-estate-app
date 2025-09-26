import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import HeroSection from '@/components/ui/HeroSection';
import SearchBar from '@/components/ui/SearchBar';
import FilterChips from '@/components/ui/FilterChips';
import ProviderCard from '@/components/ui/ProviderCard';
import { mockProviders } from '@/constants/data';
import Colors from '@/constants/colors';
import { FilterState } from '@/types';

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'recent'
  });

  const filterChips = [
    { id: 'type', label: 'Type de pro', value: 'Tous' },
    { id: 'city', label: 'Ville', value: 'Accra' },
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

  const handleViewProfile = (providerId: string) => {
    console.log('View profile:', providerId);
    router.push(`/provider/${providerId}`);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.background.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroSection
          title="Services immobiliers"
          subtitle="Trouvez les meilleurs professionnels de l'immobilier près de chez vous"
        >
          <View style={styles.heroActions}>
            <View style={styles.searchSection}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFilterPress={handleFilterPress}
                placeholder="Rechercher un professionnel..."
              />
              
              <FilterChips 
                chips={filterChips} 
                onChipPress={handleFilterChipPress}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </View>
          </View>
        </HeroSection>

        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Professionnels recommandés</Text>
        </View>

        <View style={styles.content}>
          {mockProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onViewProfile={() => handleViewProfile(provider.id)}
              onCall={() => handleCall(provider.phone)}
              onWhatsApp={() => handleWhatsApp(provider.whatsapp || provider.phone)}
              onEmail={() => handleEmail(provider.email)}
            />
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroActions: {
    gap: 16,
  },
  searchSection: {
    gap: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  content: {
    paddingHorizontal: 16,
  },
  bottomSpacer: {
    height: 100,
  },
});