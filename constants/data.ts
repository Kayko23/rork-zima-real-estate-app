import type { Property, Provider, Conversation } from '@/types';
import { providers } from './professionals';

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
    price: 1850000,
    currency: 'NGN',
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
    price: 520000000,
    currency: 'XOF',
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
    price: 488000,
    currency: 'XOF',
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
    images: []
  },
  {
    id: 'p3',
    name: 'Fatima Diallo Immobilier',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    rating: 4.9,
    reviewCount: 89,
    location: { city: 'Dakar', country: 'Sénégal' },
    specialties: ['Résidentiel', 'Luxe', 'Investissement'],
    isVerified: true,
    isPremium: true,
    phone: '+221771234567',
    email: 'contact@fatimadiallo.sn',
    whatsapp: '+221771234567',
    listingCount: 52,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
    ]
  },
  {
    id: 'p4',
    name: 'Mohamed Traoré',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 4.7,
    reviewCount: 31,
    location: { city: 'Abidjan', country: 'Côte d\'Ivoire' },
    specialties: ['Location', 'Commercial', 'Résidentiel'],
    isVerified: true,
    isPremium: false,
    phone: '+2250701234567',
    email: 'mohamed.traore@gmail.com',
    whatsapp: '+2250701234567',
    listingCount: 19,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'
    ]
  },
  {
    id: 'p5',
    name: 'Aisha Kone Properties',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 4.5,
    reviewCount: 76,
    location: { city: 'Bamako', country: 'Mali' },
    specialties: ['Résidentiel', 'Terrain', 'Construction'],
    isVerified: true,
    isPremium: true,
    phone: '+22370123456',
    email: 'info@aishakone.ml',
    whatsapp: '+22370123456',
    listingCount: 41,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
    ]
  },
  {
    id: 'p6',
    name: 'Emmanuel Mensah',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4.8,
    reviewCount: 54,
    location: { city: 'Kumasi', country: 'Ghana' },
    specialties: ['Résidentiel', 'Luxe'],
    isVerified: true,
    isPremium: false,
    phone: '+233501234567',
    email: 'emmanuel.mensah@gmail.com',
    whatsapp: '+233501234567',
    listingCount: 23,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'
    ]
  },
  {
    id: 'p7',
    name: 'Zara Ouattara Realty',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 4.6,
    reviewCount: 92,
    location: { city: 'Ouagadougou', country: 'Burkina Faso' },
    specialties: ['Commercial', 'Industriel', 'Résidentiel'],
    isVerified: true,
    isPremium: true,
    phone: '+22670123456',
    email: 'contact@zaraouattara.bf',
    whatsapp: '+22670123456',
    listingCount: 38,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
    ]
  },
  {
    id: 'p8',
    name: 'Ibrahim Sow',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.4,
    reviewCount: 27,
    location: { city: 'Conakry', country: 'Guinée' },
    specialties: ['Location', 'Résidentiel'],
    isVerified: false,
    isPremium: false,
    phone: '+224621234567',
    email: 'ibrahim.sow@gmail.com',
    whatsapp: '+224621234567',
    listingCount: 15,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'
    ]
  },
  {
    id: 'p9',
    name: 'Mariam Keita Properties',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    rating: 4.7,
    reviewCount: 63,
    location: { city: 'Niamey', country: 'Niger' },
    specialties: ['Résidentiel', 'Commercial', 'Terrain'],
    isVerified: true,
    isPremium: false,
    phone: '+22796123456',
    email: 'contact@mariamkeita.ne',
    whatsapp: '+22796123456',
    listingCount: 29,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
    ]
  },
  {
    id: 'p10',
    name: 'Kofi Asante',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 4.9,
    reviewCount: 45,
    location: { city: 'Cape Coast', country: 'Ghana' },
    specialties: ['Résidentiel', 'Luxe', 'Vue mer'],
    isVerified: true,
    isPremium: true,
    phone: '+233241234567',
    email: 'kofi.asante@gmail.com',
    whatsapp: '+233241234567',
    listingCount: 31,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
    ]
  },
  {
    id: 'p11',
    name: 'Aminata Ba Immobilier',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 4.8,
    reviewCount: 78,
    location: { city: 'Thiès', country: 'Sénégal' },
    specialties: ['Résidentiel', 'Investissement', 'Gestion'],
    isVerified: true,
    isPremium: true,
    phone: '+221771234568',
    email: 'contact@aminataba.sn',
    whatsapp: '+221771234568',
    listingCount: 46,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'
    ]
  },
  {
    id: 'p12',
    name: 'Sekou Camara',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4.3,
    reviewCount: 22,
    location: { city: 'Bouaké', country: 'Côte d\'Ivoire' },
    specialties: ['Location', 'Résidentiel', 'Commercial'],
    isVerified: false,
    isPremium: false,
    phone: '+2250701234568',
    email: 'sekou.camara@gmail.com',
    whatsapp: '+2250701234568',
    listingCount: 12,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'
    ]
  },
  {
    id: 'p13',
    name: 'Grace Okafor Properties',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 4.7,
    reviewCount: 85,
    location: { city: 'Abuja', country: 'Nigeria' },
    specialties: ['Luxe', 'Commercial', 'Résidentiel'],
    isVerified: true,
    isPremium: true,
    phone: '+234901234567',
    email: 'info@graceokafor.ng',
    whatsapp: '+234901234567',
    listingCount: 57,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
    ]
  },
  {
    id: 'p14',
    name: 'Ousmane Diop',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.5,
    reviewCount: 38,
    location: { city: 'Kaolack', country: 'Sénégal' },
    specialties: ['Résidentiel', 'Terrain', 'Agriculture'],
    isVerified: true,
    isPremium: false,
    phone: '+221771234569',
    email: 'ousmane.diop@gmail.com',
    whatsapp: '+221771234569',
    listingCount: 21,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200'
    ]
  },
  {
    id: 'p15',
    name: 'Akosua Mensah Realty',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    rating: 4.6,
    reviewCount: 71,
    location: { city: 'Tamale', country: 'Ghana' },
    specialties: ['Résidentiel', 'Commercial', 'Développement'],
    isVerified: true,
    isPremium: false,
    phone: '+233261234567',
    email: 'contact@akosuamensah.gh',
    whatsapp: '+233261234567',
    listingCount: 33,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200'
    ]
  },
  {
    id: 'p16',
    name: 'Chioma Okafor',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 4.9,
    reviewCount: 156,
    location: { city: 'Lagos', country: 'Nigeria' },
    specialties: ['Luxe', 'Investissement', 'Conseil'],
    isVerified: true,
    isPremium: true,
    phone: '+234901234568',
    email: 'chioma@okaforproperties.ng',
    whatsapp: '+234901234568',
    listingCount: 42,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200'
    ]
  },
  {
    id: 'p17',
    name: 'Mamadou Keita Properties',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 4.7,
    reviewCount: 89,
    location: { city: 'Bamako', country: 'Mali' },
    specialties: ['Résidentiel', 'Commercial', 'Terrain'],
    isVerified: true,
    isPremium: true,
    phone: '+22370123457',
    email: 'contact@mamadoukeita.ml',
    whatsapp: '+22370123457',
    listingCount: 38,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'
    ]
  },
  {
    id: 'p18',
    name: 'Awa Diop',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 4.8,
    reviewCount: 124,
    location: { city: 'Dakar', country: 'Sénégal' },
    specialties: ['Résidentiel', 'Luxe', 'Vue mer'],
    isVerified: true,
    isPremium: true,
    phone: '+221771234570',
    email: 'awa.diop@gmail.com',
    whatsapp: '+221771234570',
    listingCount: 29,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200'
    ]
  },
  {
    id: 'p19',
    name: 'Koffi Asante Immobilier',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4.5,
    reviewCount: 93,
    location: { city: 'Abidjan', country: 'Côte d\'Ivoire' },
    specialties: ['Commercial', 'Industriel', 'Bureaux'],
    isVerified: true,
    isPremium: false,
    phone: '+2250701234569',
    email: 'info@koffiasante.ci',
    whatsapp: '+2250701234569',
    listingCount: 47,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200'
    ]
  },
  {
    id: 'p20',
    name: 'Adama Traoré',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.6,
    reviewCount: 67,
    location: { city: 'Ouagadougou', country: 'Burkina Faso' },
    specialties: ['Résidentiel', 'Location', 'Gestion'],
    isVerified: false,
    isPremium: false,
    phone: '+22670123457',
    email: 'adama.traore@gmail.com',
    whatsapp: '+22670123457',
    listingCount: 18,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200'
    ]
  },
  {
    id: 'p21',
    name: 'Nana Akoto Properties',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    rating: 4.9,
    reviewCount: 178,
    location: { city: 'Kumasi', country: 'Ghana' },
    specialties: ['Luxe', 'Résidentiel', 'Investissement'],
    isVerified: true,
    isPremium: true,
    phone: '+233501234568',
    email: 'contact@nanaakoto.gh',
    whatsapp: '+233501234568',
    listingCount: 56,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
    ]
  },
  {
    id: 'p22',
    name: 'Binta Sow',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 4.4,
    reviewCount: 52,
    location: { city: 'Conakry', country: 'Guinée' },
    specialties: ['Résidentiel', 'Location', 'Conseil'],
    isVerified: true,
    isPremium: false,
    phone: '+224621234568',
    email: 'binta.sow@gmail.com',
    whatsapp: '+224621234568',
    listingCount: 23,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'
    ]
  },
  {
    id: 'p23',
    name: 'Youssouf Diallo Realty',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 4.7,
    reviewCount: 134,
    location: { city: 'Niamey', country: 'Niger' },
    specialties: ['Commercial', 'Résidentiel', 'Développement'],
    isVerified: true,
    isPremium: true,
    phone: '+22796123457',
    email: 'contact@youssoufdiallo.ne',
    whatsapp: '+22796123457',
    listingCount: 41,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200'
    ]
  },
  {
    id: 'p24',
    name: 'Amina Hassan',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 4.8,
    reviewCount: 98,
    location: { city: 'Abuja', country: 'Nigeria' },
    specialties: ['Luxe', 'Commercial', 'Bureaux'],
    isVerified: true,
    isPremium: true,
    phone: '+234901234569',
    email: 'amina.hassan@gmail.com',
    whatsapp: '+234901234569',
    listingCount: 35,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200'
    ]
  },
  {
    id: 'p25',
    name: 'Kwaku Mensah Properties',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.7,
    reviewCount: 112,
    location: { city: 'Accra', country: 'Ghana' },
    specialties: ['Résidentiel', 'Commercial', 'Luxe'],
    isVerified: true,
    isPremium: true,
    phone: '+233244123458',
    email: 'contact@kwakumensah.gh',
    whatsapp: '+233244123458',
    listingCount: 48,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
    ]
  },
  {
    id: 'p26',
    name: 'Fatoumata Diarra',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    rating: 4.6,
    reviewCount: 87,
    location: { city: 'Bamako', country: 'Mali' },
    specialties: ['Résidentiel', 'Location', 'Conseil'],
    isVerified: true,
    isPremium: false,
    phone: '+22370123458',
    email: 'fatoumata.diarra@gmail.com',
    whatsapp: '+22370123458',
    listingCount: 26,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200'
    ]
  },
  {
    id: 'p27',
    name: 'Abdoulaye Sow Immobilier',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 4.8,
    reviewCount: 145,
    location: { city: 'Dakar', country: 'Sénégal' },
    specialties: ['Luxe', 'Investissement', 'Commercial'],
    isVerified: true,
    isPremium: true,
    phone: '+221771234571',
    email: 'contact@abdoulayesow.sn',
    whatsapp: '+221771234571',
    listingCount: 62,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200'
    ]
  },
  {
    id: 'p28',
    name: 'Adjoa Asante',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 4.9,
    reviewCount: 203,
    location: { city: 'Kumasi', country: 'Ghana' },
    specialties: ['Résidentiel', 'Luxe', 'Conseil'],
    isVerified: true,
    isPremium: true,
    phone: '+233501234569',
    email: 'adjoa.asante@gmail.com',
    whatsapp: '+233501234569',
    listingCount: 39,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200'
    ]
  },
  {
    id: 'p29',
    name: 'Moussa Keita Properties',
    type: 'agency',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4.5,
    reviewCount: 76,
    location: { city: 'Conakry', country: 'Guinée' },
    specialties: ['Commercial', 'Résidentiel', 'Terrain'],
    isVerified: false,
    isPremium: false,
    phone: '+224621234569',
    email: 'contact@moussakeitaproperties.gn',
    whatsapp: '+224621234569',
    listingCount: 31,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200'
    ]
  },
  {
    id: 'p30',
    name: 'Salamatou Diallo',
    type: 'agent',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 4.7,
    reviewCount: 91,
    location: { city: 'Niamey', country: 'Niger' },
    specialties: ['Résidentiel', 'Location', 'Gestion'],
    isVerified: true,
    isPremium: false,
    phone: '+22796123458',
    email: 'salamatou.diallo@gmail.com',
    whatsapp: '+22796123458',
    listingCount: 24,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'
    ]
  }
];

// Fonction pour obtenir un prestataire par ID avec données enrichies
export const getProviderById = (id: string) => {
  console.log('[getProviderById] Looking for provider with ID:', id);
  
  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.log('[getProviderById] Invalid ID provided:', id);
    return null;
  }
  
  try {
    // Chercher d'abord dans les providers de professionals.ts
    const professionalProvider = providers.find(p => {
      const providerId = String(p.id).trim();
      const searchId = String(id).trim();
      return providerId === searchId;
    });
    
    console.log('[getProviderById] Found in professionals:', !!professionalProvider);
    
    if (professionalProvider) {
      // Mapper les données du provider professionnel vers le format attendu
      const safeName = String(professionalProvider.name || 'Nom non disponible');
      const safeCity = String(professionalProvider.city || 'Ville non spécifiée');
      const safeCountry = String(professionalProvider.country || 'Pays non spécifié');
      
      // Créer un nom d'email sécurisé
      let emailName = 'contact';
      try {
        emailName = safeName.toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 20) || 'contact';
      } catch (emailError) {
        console.warn('[getProviderById] Error creating email name:', emailError);
        emailName = 'contact';
      }
      
      const mappedProvider = {
        id: String(professionalProvider.id),
        name: safeName,
        type: (professionalProvider.category === 'agency' ? 'agency' : 'agent') as 'agency' | 'agent',
        avatar: String(professionalProvider.avatar || 'https://i.pravatar.cc/150'),
        cover: String(professionalProvider.cover || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop'),
        rating: Math.max(0, Math.min(5, Number(professionalProvider.rating) || 4.0)),
        reviewCount: Math.max(0, Number(professionalProvider.reviews) || 0),
        location: {
          city: safeCity,
          country: safeCountry
        },
        specialties: Array.isArray(professionalProvider.tags) ? professionalProvider.tags.slice(0, 5) : ['Résidentiel'],
        isVerified: Array.isArray(professionalProvider.badges) ? professionalProvider.badges.includes('verified') : false,
        isPremium: Array.isArray(professionalProvider.badges) ? professionalProvider.badges.includes('premium') : false,
        phone: '+233244123456',
        email: `${emailName}@zimarealty.com`,
        whatsapp: '+233244123456',
        listingCount: Math.max(0, Number(professionalProvider.listings) || 0),
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
            city: safeCity,
            country: safeCountry,
            price: '$2,500/mois',
            status: 'À louer' as const,
            thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
          },
          {
            id: 'l2',
            title: 'Penthouse centre-ville',
            city: safeCity,
            country: safeCountry,
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
      
      console.log('[getProviderById] Mapped provider:', mappedProvider.name);
      return mappedProvider;
    }
    
    // Fallback vers mockProviders si pas trouvé
    const provider = mockProviders.find(p => String(p.id) === String(id));
    console.log('[getProviderById] Found in mockProviders:', !!provider);
    
    if (!provider) {
      console.log('[getProviderById] Provider not found anywhere');
      return null;
    }
    
    const enrichedProvider = {
      ...provider,
      cover: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
      languages: ['Français', 'English'],
      zones: ['Centre-ville', 'Résidentiel', 'Commercial'],
      listings: [
        {
          id: 'l1',
          title: 'Villa moderne avec piscine',
          city: provider.location?.city || 'Ville',
          country: provider.location?.country || 'Pays',
          price: '$2,500/mois',
          status: 'À louer' as const,
          thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        },
        {
          id: 'l2',
          title: 'Penthouse centre-ville',
          city: provider.location?.city || 'Ville',
          country: provider.location?.country || 'Pays',
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
    
    console.log('[getProviderById] Enriched provider:', enrichedProvider.name);
    return enrichedProvider;
    
  } catch (error) {
    console.error('[getProviderById] Error processing provider data:', error);
    return null;
  }
};

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
  { id: 'residential', name: 'Résidentiel', icon: 'home', count: 1250 },
  { id: 'commercial-office', name: 'Commercial & Bureaux', icon: 'briefcase', count: 340 },
  { id: 'land', name: 'Terrains', icon: 'map', count: 420 },
  { id: 'luxury', name: 'Luxe & Collection', icon: 'diamond', count: 78 },
  { id: 'hospitality', name: 'Vacances & Hôtellerie', icon: 'hotel', count: 210 }
];

export type PropertyCategoryGroup = {
  group: string;
  items: { name: string; slug: string }[];
};

export const propertyCategories: PropertyCategoryGroup[] = [
  {
    group: 'Résidentiel',
    items: [
      { name: 'Appartement', slug: 'apartment' },
      { name: 'Maison individuelle / Villa', slug: 'villa' },
      { name: 'Maison jumelée / Mitoyenne', slug: 'house' },
      { name: 'Chambre meublée', slug: 'room' },
      { name: 'Résidence journalière (type Airbnb)', slug: 'daily-residence' },
      { name: 'Coliving', slug: 'coliving' },
      { name: 'Résidence étudiante', slug: 'student-residence' },
      { name: 'Résidence senior', slug: 'senior-residence' },
      { name: 'Duplex', slug: 'duplex' },
      { name: 'Penthouse', slug: 'penthouse' },
      { name: 'Loft', slug: 'loft' }
    ]
  },
  {
    group: 'Commercial & Bureaux',
    items: [
      { name: 'Bureau / Plateau de bureaux', slug: 'office' },
      { name: 'Local commercial / Boutique', slug: 'retail' },
      { name: 'Showroom', slug: 'showroom' },
      { name: 'Entrepôt / Dépôt', slug: 'warehouse' },
      { name: 'Atelier / Petite industrie', slug: 'workshop' },
      { name: 'Espace évènementiel', slug: 'event-space' }
    ]
  },
  {
    group: 'Terrains',
    items: [
      { name: 'Terrain résidentiel', slug: 'plot-residential' },
      { name: 'Terrain commercial/industriel', slug: 'plot-commercial' },
      { name: 'Lotissement (parcelles)', slug: 'lot' },
      { name: 'Terrain agricole / Ferme / Plantation', slug: 'plot-agricultural' },
      { name: 'Bail emphytéotique', slug: 'leasehold' }
    ]
  },
  {
    group: 'Luxe & Collection',
    items: [
      { name: 'Propriété de luxe / Prestige', slug: 'luxury' },
      { name: 'Bord de mer / Lagune', slug: 'beachfront' },
      { name: 'Golf / Vue panoramique / Montagne', slug: 'mountain' },
      { name: 'Lagune', slug: 'lagoonfront' },
      { name: 'Golf', slug: 'golf' }
    ]
  },
  {
    group: 'Vacances & Hôtellerie',
    items: [
      { name: 'Hôtel / Guest house', slug: 'hotel' },
      { name: 'Lodge / Écolodge', slug: 'lodge' },
      { name: 'Resort / Complexe touristique', slug: 'resort' },
      { name: 'Bungalow / Chalet', slug: 'bungalow' },
      { name: 'Chalet', slug: 'chalet' },
      { name: 'Guest house', slug: 'guesthouse' }
    ]
  }
];

export const propertyStatuses = [
  { name: 'À vendre', slug: 'for-sale' },
  { name: 'À louer (longue durée)', slug: 'for-rent' },
  { name: 'Location saisonnière / journalière', slug: 'short-stay' },
  { name: 'Neuf / Sur plan (VEFA)', slug: 'new-offplan' },
  { name: 'En construction / Livrable', slug: 'under-construction' }
];

export const propertyAttributes = {
  metrics: ['chambres', 'sdb', 'surface_m2', 'terrain_m2', 'terrain_ha'] as const,
  furnishing: ['meublé', 'non_meublé'] as const,
  amenities: ['piscine','parking','sécurité24h','ascenseur','groupe_electrogène','climatisation'] as const,
  views: ['mer','lagune','ville','montagne'] as const,
  proximity: ['école','commerce','transport'] as const
};

export const categorySlugs = [
  'apartment','house','villa','duplex','penthouse','room','daily-residence','coliving','student-residence',
  'office','retail','showroom','warehouse','workshop','event-space',
    'plot-residential','plot-commercial','plot-agricultural','lot',
  'luxury','beachfront','lagoonfront','golf','mountain',
  'hotel','guesthouse','lodge','resort','bungalow','chalet'
] as const;

export const countries = [
  { code: 'GH', name: 'Ghana', cities: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast'] },
  { code: 'NG', name: 'Nigeria', cities: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'] },
  { code: 'CI', name: 'Côte d\'Ivoire', cities: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro'] },
  { code: 'SN', name: 'Sénégal', cities: ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis'] }
];