import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { providersApi, api, providerReviewsApi } from '@/lib/api';
import ProfileProScreen, { type ProProfile } from '@/components/pro/ProfileProScreen';

export default function ProfessionalProfile() {
  const { id } = useLocalSearchParams<{id:string}>();

  const { data: provider } = useQuery({
    queryKey: ['provider', id],
    queryFn: () => providersApi.get(String(id)),
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['provider-listings', id],
    queryFn: () => api.listProviderProperties(String(id)),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['provider-reviews', id],
    queryFn: () => providerReviewsApi.list(String(id)),
  });

  if (!provider) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const proProfile: ProProfile = {
    id: String(provider.id),
    fullName: provider.name,
    role: provider.category === 'agent' ? 'AGENT' : provider.category === 'property_manager' ? 'GESTIONNAIRE' : 'AGENCE',
    avatarUrl: provider.avatar,
    coverUrl: provider.cover,
    location: { city: provider.city, country: provider.country },
    isVerified: provider.verified || false,
    isPremium: provider.premium || false,
    yearsActive: provider.yearsActive,
    rating: provider.rating ? { avg: provider.rating, count: provider.reviewCount || 0 } : null,
    listingsCount: listings.length,
    specialties: provider.services || [],
    languages: provider.languages || ['Français', 'English'],
    bio: provider.bio || `Prestataire vérifié. Réponse rapide. Expérience locale sur ${provider.city}.`,
    phones: { mobile: provider.phone, whatsapp: provider.whatsapp },
    email: provider.email || `contact@${provider.name.toLowerCase().replace(/\s+/g, '')}.com`,
    serviceAreas: provider.serviceAreas || [{ city: provider.city, country: provider.country }],
    listings: listings.map((l: any) => ({
      id: l.id,
      title: l.title,
      city: l.city,
      country: l.country,
      price: l.price,
      thumbnail: l.images?.[0],
    })),
    reviews: reviews.map((r: any) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      text: r.text,
      date: r.createdAt,
    })),
    images: provider.images || [],
  };

  return <ProfileProScreen profile={proProfile} />;
}
