import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'recent',
  });

  const filterChips = useMemo(() => [
    { id: 'type', label: 'Type de pro', value: 'Tous' },
    { id: 'city', label: 'Ville', value: 'Accra' },
  ], []);

  const handleFilterChipPress = useCallback((chipId: string) => {
    console.log('[Services] Filter chip pressed:', chipId);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    console.log('[Services] Filters change:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleFilterPress = useCallback(() => {
    console.log('[Services] Filter button pressed');
  }, []);

  const handleViewProfile = useCallback((providerId: string) => {
    console.log('[Services] View profile tapped', providerId);
    try {
      if (!providerId) throw new Error('ID invalide');
      router.push(`/provider/${providerId}`);
    } catch (e) {
      console.log('[Services] View profile error', e);
      Alert.alert('Navigation', "Impossible d'ouvrir le profil.");
    }
  }, []);

  const handleCall = useCallback(async (phone: string) => {
    console.log('[Services] Call tapped', phone);
    try {
      const num = phone?.replace(/\s+/g, '');
      if (!num) throw new Error('Numéro manquant');
      const url = `tel:${num}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported && Platform.OS === 'web') {
        // @ts-ignore window exists on web
        window.location.href = url as unknown as string;
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      console.log('[Services] Call error', e);
      Alert.alert('Appel', "Impossible de démarrer l’appel.");
    }
  }, []);

  const handleWhatsApp = useCallback(async (phone: string) => {
    console.log('[Services] WhatsApp tapped', phone);
    try {
      const num = phone?.replace(/\D/g, '');
      if (!num) throw new Error('Numéro WhatsApp manquant');
      const appUrl = `whatsapp://send?phone=${num}`;
      const webUrl = `https://wa.me/${num}`;
      const canApp = await Linking.canOpenURL(appUrl);
      if (canApp && Platform.OS !== 'web') {
        await Linking.openURL(appUrl);
        return;
      }
      await Linking.openURL(webUrl);
    } catch (e) {
      console.log('[Services] WhatsApp error', e);
      Alert.alert('WhatsApp', 'Impossible d’ouvrir WhatsApp.');
    }
  }, []);

  const handleEmail = useCallback(async (email: string) => {
    console.log('[Services] Email tapped', email);
    try {
      const addr = email?.trim();
      if (!addr) throw new Error('Email manquant');
      const url = `mailto:${addr}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported && Platform.OS === 'web') {
        // @ts-ignore window exists on web
        window.location.href = url as unknown as string;
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      console.log('[Services] Email error', e);
      Alert.alert('Email', "Impossible d’ouvrir l’email.");
    }
  }, []);

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
              testID="back-btn"
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
