import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { providers } from '@/constants/professionals';
import { getProviderById } from '@/constants/data';
import ProfileProScreen, { type ProProfile } from '@/components/pro/ProfileProScreen';

export default function ProviderProfile() {
  const params = useLocalSearchParams();
  
  let provider: any = null;
  
  try {
    let providerId: string | undefined;
    
    if (params && typeof params === 'object') {
      if (Array.isArray(params.id)) {
        providerId = params.id[0];
      } else if (typeof params.id === 'string') {
        providerId = params.id;
      } else if (params.id) {
        providerId = String(params.id);
      }
    }
    
    if (!providerId || typeof providerId !== 'string' || providerId.trim() === '') {
      provider = null;
    } else {
      const cleanId = providerId.trim();
      
      const professionalProvider = providers.find(p => String(p.id) === cleanId);
      
      if (professionalProvider) {
        provider = {
          id: professionalProvider.id,
          name: professionalProvider.name,
          type: professionalProvider.category === 'agency' ? 'agency' : 'agent',
          avatar: professionalProvider.avatar || 'https://i.pravatar.cc/150',
          cover: professionalProvider.cover || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
          rating: professionalProvider.rating || 4.0,
          reviewCount: professionalProvider.reviews || 0,
          location: {
            city: professionalProvider.city || 'Ville',
            country: professionalProvider.country || 'Pays'
          },
          specialties: professionalProvider.tags || ['Résidentiel'],
          isVerified: professionalProvider.badges?.includes('verified') || false,
          isPremium: professionalProvider.badges?.includes('premium') || false,
          phone: '+233244123456',
          email: `contact@${professionalProvider.name.toLowerCase().replace(/\s+/g, '')}.com`,
          whatsapp: '+233244123456',
          listingCount: professionalProvider.listings || 0,
          images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
          ],
          languages: ['Français', 'English'],
          zones: ['Centre-ville', 'Résidentiel', 'Commercial'],
          listings: [
            {
              id: 'l1',
              title: 'Villa moderne avec piscine',
              city: professionalProvider.city,
              country: professionalProvider.country,
              price: '$2,500/mois',
              status: 'À louer' as const,
              thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
            },
            {
              id: 'l2',
              title: 'Penthouse centre-ville',
              city: professionalProvider.city,
              country: professionalProvider.country,
              price: '$450,000',
              status: 'À vendre' as const,
              thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            },
          ],
          reviews: [
            {
              id: 'r1',
              author: 'Emeka Nwankwo',
              rating: 5,
              text: 'Excellent service ! Très professionnel et à l\'écoute.',
              date: '30/10/2024',
            },
            {
              id: 'r2',
              author: 'Fatou Sall',
              rating: 5,
              text: 'Service impeccable. Connaît très bien le marché local.',
              date: '15/10/2024',
            },
          ],
        };
      } else {
        try {
          provider = getProviderById(cleanId);
        } catch (providerError) {
          console.error('[ProviderProfile] Error in getProviderById:', providerError);
          provider = null;
        }
      }
    }
  } catch (error) {
    console.error('[ProviderProfile] Error getting provider:', error);
    provider = null;
  }

  if (!provider) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Professionnel introuvable</Text>
        <Text style={{ color: '#6B7280', textAlign: 'center' }}>
          Le professionnel que vous recherchez n&apos;existe pas ou a été supprimé.
        </Text>
      </View>
    );
  }

  const proProfile: ProProfile = {
    id: String(provider.id),
    fullName: provider.name,
    role: provider.type === 'agency' ? 'AGENCE' : 'AGENT',
    avatarUrl: provider.avatar,
    coverUrl: provider.cover,
    location: provider.location,
    isVerified: provider.isVerified,
    isPremium: provider.isPremium,
    yearsActive: 5,
    rating: provider.rating ? { avg: provider.rating, count: provider.reviewCount || 0 } : null,
    listingsCount: provider.listingCount || 0,
    specialties: provider.specialties || [],
    languages: provider.languages || ['Français', 'English'],
    bio: `Prestataire vérifié. Réponse rapide. Expérience locale sur ${provider.location.city}.`,
    phones: { mobile: provider.phone, whatsapp: provider.whatsapp },
    email: provider.email,
    serviceAreas: provider.zones?.map((z: string) => ({ city: z, country: provider.location.country })) || [],
    listings: provider.listings || [],
    reviews: provider.reviews || [],
    images: provider.images || [],
  };

  return <ProfileProScreen profile={proProfile} />;
}
