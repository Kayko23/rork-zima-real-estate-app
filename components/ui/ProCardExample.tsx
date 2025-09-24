import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProCard, { ProItem } from '@/components/ui/ProCard';

const SAMPLE_DATA: ProItem[] = [
  {
    id: '1',
    name: 'Zima Realty',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isPremium: true,
    isVerified: true,
    role: 'Agence',
    city: 'Abidjan',
    country: "Côte d'Ivoire",
    rating: 4.9,
    reviews: 67,
    listings: 34,
    specialties: ['Résidentiel', 'Location', 'Luxe'],
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    ],
    phone: '+2250700000000',
    whatsapp: '2250700000000',
    email: 'contact@zimarealty.com',
    online: true,
  },
  {
    id: '2',
    name: 'Grace Wanjiku',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isVerified: true,
    role: 'Agent',
    city: 'Nairobi',
    country: 'Kenya',
    rating: 4.8,
    reviews: 89,
    listings: 19,
    specialties: ['Résidentiel', 'Location', 'Investissement'],
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop',
    ],
    phone: '+254700000000',
    whatsapp: '254700000000',
    email: 'grace@example.com',
    online: true,
  },
  {
    id: '3',
    name: 'Golden Properties Ltd',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isPremium: true,
    isVerified: true,
    role: 'Agence',
    city: 'Accra',
    country: 'Ghana',
    rating: 4.7,
    reviews: 45,
    listings: 23,
    specialties: ['Résidentiel', 'Commercial', 'Vente de terrains'],
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop',
    ],
    phone: '+233200000000',
    whatsapp: '233200000000',
    email: 'info@goldenproperties.com',
    online: false,
  },
  {
    id: '4',
    name: 'Aminata Diallo',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isVerified: true,
    role: 'Agent',
    city: 'Dakar',
    country: 'Sénégal',
    rating: 4.9,
    reviews: 156,
    listings: 28,
    specialties: ['Résidentiel', 'Commercial', 'Conseil'],
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    ],
    phone: '+221700000000',
    whatsapp: '221700000000',
    email: 'aminata@example.com',
    online: true,
  },
];

export default function ProCardExample() {
  const handlePressProfile = (item: ProItem) => {
    console.log('Navigate to profile:', item.id);
    // Navigation logic here
  };

  const handlePressCard = (item: ProItem) => {
    console.log('Card pressed:', item.name);
    // Optional card press logic
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={SAMPLE_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProCard
            item={item}
            onPressProfile={handlePressProfile}
            onPressCard={handlePressCard}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 16,
  },
});