import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, UserCheck } from 'lucide-react-native';
import PropertyCard from '@/components/ui/PropertyCard';
import SectionHeader from '@/components/ui/SectionHeader';
import ActionTile from '@/components/ui/ActionTile';

import { mockProperties } from '@/constants/data';
import Colors from '@/constants/colors';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  const [activeChip, setActiveChip] = useState<'properties' | 'services'>('properties');

  const handlePropertyPress = (propertyId: string) => {
    console.log('Property pressed:', propertyId);
  };

  const handleToggleFavorite = (propertyId: string) => {
    console.log('Toggle favorite:', propertyId);
  };

  const handleSeeAllPress = (section: string) => {
    console.log('See all pressed:', section);
  };

  const handlePublishPress = () => {
    console.log('Publish property pressed');
  };

  const handleFindProPress = () => {
    router.push('/services');
  };

  const handleChipPress = (chip: 'properties' | 'services') => {
    setActiveChip(chip);
    if (chip === 'services') {
      router.push('/services');
    }
  };



  const displayProperties = mockProperties;



  const renderPropertyCard = ({ item, index }: { item: any; index: number }) => (
    <PropertyCard
      key={item.id}
      property={item}
      onPress={() => handlePropertyPress(item.id)}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
      width={300}
    />
  );

  const categories = [
    { 
      id: 'residences', 
      name: 'Résidences', 
      emoji: '🏠',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      properties: mockProperties.filter(p => p.category === 'Appartement' || p.category === 'Maison' || p.category === 'Villa').slice(0, 3)
    },
    { 
      id: 'bureaux', 
      name: 'Bureaux', 
      emoji: '🏢',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      properties: mockProperties.filter(p => p.category === 'Bureau').slice(0, 3)
    },
    { 
      id: 'commerces', 
      name: 'Commerces', 
      emoji: '🏪',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      properties: mockProperties.filter(p => p.category === 'Commerce').slice(0, 3)
    },
    { 
      id: 'terrains', 
      name: 'Terrains', 
      emoji: '🌍',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      properties: mockProperties.filter(p => p.category === 'Terrain').slice(0, 3)
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Header with zi icon */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/9x4bhbj6w010vuyrq7vcd' }}
            style={styles.ziIcon}
            resizeMode="contain"
          />
        </View>

        {/* Hero Card with rounded bottom corners */}
        <View style={styles.heroCard}>
          <View style={styles.heroBackground}>
            <View style={styles.heroBlob1} />
            <View style={styles.heroBlob2} />
          </View>
          
          <View style={styles.heroContent}>
            <Image 
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/alk0nnhulsb6t76wytqya' }}
              style={styles.heroLogo}
              resizeMode="contain"
            />
          </View>
        </View>
        
        {/* Chips below hero */}
        <View style={styles.chipsSection}>
          <TouchableOpacity 
            style={[
              styles.chip,
              activeChip === 'properties' && styles.chipActive
            ]}
            onPress={() => handleChipPress('properties')}
            activeOpacity={0.8}
          >
            <Text style={styles.chipEmoji}>🏠</Text>
            <Text style={styles.chipText}>Biens immobiliers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.chip,
              activeChip === 'services' && styles.chipActive
            ]}
            onPress={() => handleChipPress('services')}
            activeOpacity={0.8}
          >
            <Text style={styles.chipEmoji}>💼</Text>
            <Text style={styles.chipText}>Services</Text>
          </TouchableOpacity>
        </View>



        {/* Premium Properties Section */}
        <View style={styles.section}>
          <SectionHeader 
            title="Biens premium" 
            onSeeAllPress={() => handleSeeAllPress('premium')}
          />
          <FlatList
            data={displayProperties.filter(p => p.isPremium)}
            renderItem={renderPropertyCard}
            keyExtractor={(item) => `premium-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={316}
            decelerationRate="fast"
          />
        </View>

        {/* New Properties Section */}
        <View style={styles.section}>
          <SectionHeader 
            title="Nouveautés" 
            onSeeAllPress={() => handleSeeAllPress('new')}
          />
          <FlatList
            data={displayProperties.slice(0, 4)}
            renderItem={renderPropertyCard}
            keyExtractor={(item) => `new-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={316}
            decelerationRate="fast"
          />
        </View>

        {/* Featured Property Card */}
        <View style={styles.section}>
          <View style={styles.featuredPropertyCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' }}
              style={styles.featuredPropertyImage}
              resizeMode="cover"
            />
            <View style={styles.featuredPropertyOverlay}>
              <View style={styles.featuredPropertyInfo}>
                <View style={styles.featuredPropertyDetails}>
                  <Text style={styles.featuredPropertySpecs}>🛏️ 1  🛁 1  📐 45m²</Text>
                  <View style={styles.featuredPropertyRating}>
                    <Text style={styles.ratingIcon}>⭐</Text>
                    <Text style={styles.ratingText}>4.8</Text>
                    <Text style={styles.photoCount}>📷 2</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <SectionHeader 
            title="Par catégories" 
            subtitle="Explorez par type de bien"
            showSeeAll={false}
          />
          
          {categories.map((category) => (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleRow}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.seeAllButton}
                  onPress={() => handleSeeAllPress(category.id)}
                >
                  <Text style={styles.seeAllText}>Voir tout ›</Text>
                </TouchableOpacity>
              </View>
              
              {/* Category Hero Image */}
              <View style={styles.categoryImageContainer}>
                <Image 
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                <View style={styles.categoryImageOverlay}>
                  <Text style={styles.categoryImageText}>
                    {category.properties.length} biens disponibles
                  </Text>
                </View>
              </View>
              
              {/* Category Properties */}
              {category.properties.length > 0 && (
                <FlatList
                  data={category.properties}
                  renderItem={({ item }) => (
                    <PropertyCard
                      property={item}
                      onPress={() => handlePropertyPress(item.id)}
                      onToggleFavorite={() => handleToggleFavorite(item.id)}
                      width={280}
                    />
                  )}
                  keyExtractor={(item) => `${category.id}-${item.id}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryPropertiesList}
                  snapToInterval={296}
                  decelerationRate="fast"
                />
              )}
            </View>
          ))}
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <View style={styles.actionsContainer}>
            <ActionTile
              title="Publier un bien"
              icon={<Plus size={24} color={Colors.primary} />}
              onPress={handlePublishPress}
              variant="primary"
            />
            <View style={styles.actionSpacer} />
            <ActionTile
              title="Trouver un pro"
              icon={<UserCheck size={24} color={Colors.gold} />}
              onPress={handleFindProPress}
              variant="secondary"
            />
          </View>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ziIcon: {
    height: 28,
    width: 28,
  },
  heroCard: {
    height: 220,
    position: 'relative',
    marginBottom: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background.hero,
  },
  heroBlob1: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroBlob2: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 1,
  },
  heroLogo: {
    height: 60,
    width: '72%',
    maxWidth: 420,
  },
  chipsSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 8,
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(26px)',
    }),
  },
  chipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: Colors.primary,
    borderWidth: 2,
    shadowOpacity: 0.12,
    transform: [{ scale: 1.02 }],
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },

  section: {
    marginBottom: 32,
  },
  horizontalList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  seeAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(22px)',
    }),
  },
  actionSpacer: {
    width: 16,
  },
  featuredPropertyCard: {
    marginHorizontal: 24,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredPropertyImage: {
    width: '100%',
    height: '100%',
  },
  featuredPropertyOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  featuredPropertyInfo: {
    padding: 16,
  },
  featuredPropertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPropertySpecs: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  featuredPropertyRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingIcon: {
    fontSize: 14,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  photoCount: {
    fontSize: 12,
    marginLeft: 8,
  },
  categoryImageContainer: {
    marginHorizontal: 24,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  categoryImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryPropertiesList: {
    paddingHorizontal: 24,
    gap: 16,
  },
});