import { Property, Provider, Conversation } from '@/types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Villa moderne avec piscine',
    price: 450000,
    currency: 'USD',
    location: {
      city: 'Accra',
      country: 'Ghana',
      address: 'East Legon'
    },
    type: 'sale',
    category: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
    ],
    description: 'Magnifique villa moderne située dans le quartier prisé d\'East Legon...',
    features: ['Piscine', 'Garage', 'Jardin', 'Sécurité 24h'],
    isPremium: true,
    isFavorite: false,
    views: 1250,
    createdAt: '2024-01-15',
    provider: {
      id: 'p1',
      name: 'Kwame Asante Realty',
      type: 'agency',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.8,
      reviewCount: 67,
      location: { city: 'Accra', country: 'Ghana' },
      specialties: ['Résidentiel', 'Luxe'],
      isVerified: true,
      isPremium: true,
      phone: '+233244123456',
      email: 'contact@kwamerealty.com',
      whatsapp: '+233244123456',
      listingCount: 34,
      images: []
    }
  },
  {
    id: '2',
    title: 'Appartement 2 pièces centre-ville',
    price: 1200,
    currency: 'USD',
    location: {
      city: 'Lagos',
      country: 'Nigeria',
      address: 'Victoria Island'
    },
    type: 'rent',
    category: 'Appartement',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    description: 'Bel appartement moderne au cœur de Victoria Island...',
    features: ['Climatisation', 'Parking', 'Ascenseur', 'Sécurité'],
    isPremium: false,
    isFavorite: true,
    views: 890,
    createdAt: '2024-01-20',
    provider: {
      id: 'p2',
      name: 'Adebayo Properties',
      type: 'agent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.6,
      reviewCount: 43,
      location: { city: 'Lagos', country: 'Nigeria' },
      specialties: ['Location', 'Résidentiel'],
      isVerified: true,
      isPremium: false,
      phone: '+234801234567',
      email: 'adebayo@properties.ng',
      whatsapp: '+234801234567',
      listingCount: 28,
      images: []
    }
  },
  {
    id: '3',
    title: 'Penthouse de luxe avec vue mer',
    price: 850000,
    currency: 'USD',
    location: {
      city: 'Dakar',
      country: 'Sénégal',
      address: 'Almadies'
    },
    type: 'sale',
    category: 'Penthouse',
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    description: 'Magnifique penthouse avec vue panoramique sur l\'océan...',
    features: ['Vue mer', 'Terrasse', 'Parking privé', 'Concierge'],
    isPremium: true,
    isFavorite: false,
    views: 2100,
    createdAt: '2024-01-18',
    provider: {
      id: 'p1',
      name: 'Kwame Asante Realty',
      type: 'agency',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.8,
      reviewCount: 67,
      location: { city: 'Accra', country: 'Ghana' },
      specialties: ['Résidentiel', 'Luxe'],
      isVerified: true,
      isPremium: true,
      phone: '+233244123456',
      email: 'contact@kwamerealty.com',
      whatsapp: '+233244123456',
      listingCount: 34,
      images: []
    }
  },
  {
    id: '4',
    title: 'Studio moderne centre Abidjan',
    price: 800,
    currency: 'USD',
    location: {
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      address: 'Plateau'
    },
    type: 'rent',
    category: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    description: 'Studio moderne et fonctionnel au cœur du Plateau...',
    features: ['Meublé', 'Climatisation', 'Internet', 'Sécurité'],
    isPremium: false,
    isFavorite: false,
    views: 650,
    createdAt: '2024-01-22',
    provider: {
      id: 'p2',
      name: 'Adebayo Properties',
      type: 'agent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.6,
      reviewCount: 43,
      location: { city: 'Lagos', country: 'Nigeria' },
      specialties: ['Location', 'Résidentiel'],
      isVerified: true,
      isPremium: false,
      phone: '+234801234567',
      email: 'adebayo@properties.ng',
      whatsapp: '+234801234567',
      listingCount: 28,
      images: []
    }
  },
  {
    id: '5',
    title: 'Maison familiale avec jardin',
    price: 320000,
    currency: 'USD',
    location: {
      city: 'Kumasi',
      country: 'Ghana',
      address: 'Asokwa'
    },
    type: 'sale',
    category: 'Maison',
    bedrooms: 4,
    bathrooms: 2,
    area: 200,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
    ],
    description: 'Belle maison familiale avec grand jardin et garage...',
    features: ['Jardin', 'Garage', 'Véranda', 'Puits'],
    isPremium: true,
    isFavorite: true,
    views: 1450,
    createdAt: '2024-01-19',
    provider: {
      id: 'p1',
      name: 'Kwame Asante Realty',
      type: 'agency',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.8,
      reviewCount: 67,
      location: { city: 'Accra', country: 'Ghana' },
      specialties: ['Résidentiel', 'Luxe'],
      isVerified: true,
      isPremium: true,
      phone: '+233244123456',
      email: 'contact@kwamerealty.com',
      whatsapp: '+233244123456',
      listingCount: 34,
      images: []
    }
  }
];

export const mockProviders: Provider[] = [
  {
    id: 'p1',
    name: 'Kwame Asante Realty',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.8,
    reviewCount: 67,
    location: { city: 'Accra', country: 'Ghana' },
    specialties: ['Résidentiel', 'Luxe', 'Commercial'],
    isVerified: true,
    isPremium: true,
    phone: '+233244123456',
    email: 'contact@kwamerealty.com',
    whatsapp: '+233244123456',
    listingCount: 34,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
    ]
  },
  {
    id: 'p2',
    name: 'Adebayo Properties',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4.6,
    reviewCount: 43,
    location: { city: 'Lagos', country: 'Nigeria' },
    specialties: ['Location', 'Résidentiel'],
    isVerified: true,
    isPremium: false,
    phone: '+234801234567',
    email: 'adebayo@properties.ng',
    whatsapp: '+234801234567',
    listingCount: 28,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'
    ]
  }
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: [
      {
        id: 'p1',
        name: 'Kwame Asante',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        isOnline: true
      }
    ],
    lastMessage: {
      id: 'm1',
      senderId: 'p1',
      receiverId: 'user1',
      content: 'La visite est confirmée pour demain à 14h',
      timestamp: '2024-01-21T10:30:00Z',
      isRead: false,
      type: 'text'
    },
    unreadCount: 2,
    category: 'properties'
  }
];

export const categories = [
  { id: 'residences', name: 'Résidences', icon: 'home', count: 1250 },
  { id: 'bureaux', name: 'Bureaux', icon: 'building', count: 340 },
  { id: 'commerce', name: 'Commerce & Retail', icon: 'store', count: 180 },
  { id: 'immeubles', name: 'Immeubles', icon: 'building-2', count: 95 },
  { id: 'terrains', name: 'Terrains', icon: 'layers-outline', count: 420 },
  { id: 'industriel', name: 'Industriel', icon: 'factory', count: 65 }
];

export const countries = [
  { code: 'GH', name: 'Ghana', cities: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast'] },
  { code: 'NG', name: 'Nigeria', cities: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'] },
  { code: 'CI', name: 'Côte d\'Ivoire', cities: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro'] },
  { code: 'SN', name: 'Sénégal', cities: ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis'] }
];