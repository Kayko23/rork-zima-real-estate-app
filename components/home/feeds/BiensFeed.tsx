import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import PropertyCard from '@/components/ui/PropertyCard';
import SectionHeader from '@/components/ui/SectionHeader';
import ActionDouble from '@/components/home/ActionDouble';
import { mockProperties, propertyCategories } from '@/constants/data';
import Colors from '@/constants/colors';

export default function BiensFeed() {
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        const { fetchListings } = await import('@/services/annonces.api');
        const activeListings = await fetchListings('active');
        const pendingListings = await fetchListings('pending');
        
        const mappedListings = [...activeListings, ...pendingListings].map(listing => ({
          id: listing.id,
          title: listing.title,
          price: listing.price,
          currency: listing.currency,
          location: {
            city: listing.city,
            country: listing.country,
          },
          type: listing.type,
          category: (listing as any).subtype || listing.type || 'Bien',
          bedrooms: listing.beds,
          bathrooms: listing.baths,
          area: listing.surface,
          images: listing.photos && listing.photos.length > 0 ? listing.photos : [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          ],
          description: (listing as any).description || '',
          features: (listing as any).amenities || [],
          isPremium: listing.premium || false,
          isFavorite: false,
          views: listing.views || 0,
          createdAt: new Date().toISOString(),
          provider: {
            id: 'p1',
            name: 'Agent Zima',
            type: 'agent' as const,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            rating: 4.7,
            reviewCount: 50,
            location: { city: listing.city, country: listing.country },
            specialties: ['Résidentiel'],
            isVerified: true,
            isPremium: false,
            phone: '+233244123456',
            email: 'contact@zima.com',
            listingCount: 10,
            images: [],
          },
        }));
        
        setAllProperties([...mockProperties, ...mappedListings]);
      } catch (error) {
        console.error('[BiensFeed] Error loading properties:', error);
        setAllProperties(mockProperties);
      } finally {
        setLoading(false);
      }
    }
    
    loadProperties();
  }, []);

  const handlePropertyPress = (propertyId: string) => {
    console.log('Property pressed:', propertyId);
    router.push({
      pathname: "/property/[id]",
      params: { id: propertyId }
    });
  };

  const handleToggleFavorite = (propertyId: string) => {
    console.log('Toggle favorite:', propertyId);
  };

  const handleSeeAllPress = (section: string) => {
    if (!section?.trim()) return;
    if (section.length > 100) return;
    console.log('See all pressed:', section);

    const normalized = section.toLowerCase();

    const sectionMap: Record<string, { title: string; kind: string }> = {
      premium: { title: "Biens premium", kind: "premium" },
      new: { title: "Nouveautés", kind: "nouveautes" },
      residences: { title: "Résidences", kind: "residence" },
      bureaux: { title: "Bureaux", kind: "bureaux" },
      commerces: { title: "Commerces", kind: "commerces" },
      terrains: { title: "Terrains", kind: "terrain" },

      residential: { title: "Résidentiel", kind: "residence" },
      'commercial-office': { title: "Commercial & Bureaux", kind: "bureaux" },
      investment: { title: "Investissement", kind: "premium" },
      land: { title: "Terrains", kind: "terrain" },
      luxury: { title: "Luxe & Collection", kind: "premium" },
      hospitality: { title: "Vacances & Hôtellerie", kind: "voyages" },
    };

    const sectionData = sectionMap[normalized];
    if (sectionData) {
      router.push(`/browse?title=${encodeURIComponent(sectionData.title)}&kind=${sectionData.kind}`);
      return;
    }

    router.push(`/browse?title=${encodeURIComponent(section)}&kind=${encodeURIComponent(normalized)}`);
  };

  const displayProperties = allProperties;

  const renderPropertyCard = ({ item }: { item: any; index: number }) => (
    <PropertyCard
      key={item.id}
      property={item}
      onPress={() => handlePropertyPress(item.id)}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
      width={300}
    />
  );

  const categoryGroups = useMemo(() => {
    const images: Record<string, string> = {
      residential: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80&auto=format&fit=crop',
      'commercial-office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop',
      investment: 'https://images.unsplash.com/photo-1554224155-3a589877462f?w=1200&q=80&auto=format&fit=crop',
      land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop',
      luxury: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop',
      hospitality: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80&auto=format&fit=crop',
    };
    const emojis: Record<string, string> = {
      residential: '🏠',
      'commercial-office': '🏢',
      investment: '📈',
      land: '🗺️',
      luxury: '💎',
      hospitality: '🏨',
    };
    const names: Record<string, string> = {
      residential: 'Résidentiel',
      'commercial-office': 'Commercial & Bureaux',
      investment: 'Investissement',
      land: 'Terrains',
      luxury: 'Luxe & Collection',
      hospitality: 'Vacances & Hôtellerie',
    };

    const out: { id: string; name: string; emoji: string; image: string; properties: typeof displayProperties }[] = [];
    const order = ['Résidentiel','Commercial & Bureaux','Investissement','Terrains','Luxe & Collection','Vacances & Hôtellerie'];

    order.forEach((grp) => {
      const pc = propertyCategories.find((g) => g.group === grp);
      if (!pc) return;
      const key = Object.keys(names).find((k) => names[k] === grp) || 'residential';
      const match = pc.items.map((it) => it.name);
      const props = displayProperties.filter((p) => match.includes(p.category)).slice(0, 3);
      out.push({ id: key, name: grp, emoji: emojis[key], image: images[key], properties: props });
    });

    return out;
  }, [displayProperties]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', minHeight: 200 }]}>
        <Text style={{ color: Colors.text.secondary }}>Chargement des biens...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
      <View style={[styles.section, styles.firstSection]}>
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

      <View style={styles.section}>
        <SectionHeader 
          title="Par catégories" 
          subtitle="Explorez par type de bien"
          showSeeAll={false}
        />
        {categoryGroups.map((category) => (
          <View key={category.id} style={styles.categorySection} testID={`home-category-${category.id}`}>
            <View style={styles.categoryHeader}>
              <Pressable
                style={styles.categoryTitleRow}
                onPress={() => handleSeeAllPress(category.id)}
                accessibilityRole="button"
                testID={`home-category-title-${category.id}`}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={styles.categoryTitle}>{category.name}</Text>
              </Pressable>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => handleSeeAllPress(category.id)}
                accessibilityRole="button"
                testID={`home-category-seeall-${category.id}`}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllText}>Voir tout ›</Text>
              </TouchableOpacity>
            </View>

            <Pressable
              style={styles.categoryImageContainer}
              onPress={() => handleSeeAllPress(category.id)}
              accessibilityRole="button"
              testID={`home-category-image-${category.id}`}
            >
              <Image 
                source={{ uri: category.image }}
                style={styles.categoryImage}
                resizeMode="cover"
                accessibilityLabel={category.name}
              />
              <View style={styles.categoryImageOverlay}>
                <Text style={styles.categoryImageText}>
                  {`${category.properties.length} biens disponibles`}
                </Text>
              </View>
            </Pressable>

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

      <ActionDouble />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  section: {
    marginBottom: 32,
  },
  firstSection: {
    marginTop: 24,
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