// components/voyages/helpers.ts
import { Platform } from 'react-native';

export type StayType = 'hotel' | 'residence' | 'daily' | 'pro';
export type PricingUnit = 'night' | 'day';

export type VoyageItem = {
  id: string;
  title: string;
  city: string;
  country: string;
  photos: string[];
  price: number;
  unit: PricingUnit; // night | day
  rating: number; // 0..5
  reviews: number;
  type: StayType;
  badges?: Array<'Premium' | 'Top' | 'Nouveau'>;
  amenities?: string[]; // wifi, parking, piscine...
};

export const formatPrice = (v: number) => `$${v.toLocaleString('en-US')}`;

export const mockVoyages: VoyageItem[] = [
  {
    id: 'v1',
    title: 'Studio cosy proche plage',
    city: 'Dakar',
    country: 'Sénégal',
    photos: ['https://images.unsplash.com/photo-1505692794403-34d4982a83dd?q=80&w=1200&auto=format&fit=crop'],
    price: 72,
    unit: 'night',
    rating: 4.8,
    reviews: 67,
    type: 'residence',
    badges: ['Top'],
    amenities: ['wifi', 'clim', 'parking'],
  },
  {
    id: 'v2',
    title: 'Chambre Deluxe - Hotel Z',
    city: 'Abidjan',
    country: "Côte d'Ivoire",
    photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop'],
    price: 120,
    unit: 'night',
    rating: 4.6,
    reviews: 120,
    type: 'hotel',
    badges: ['Premium'],
    amenities: ['piscine', 'petit-dej', 'wifi'],
  },
  {
    id: 'v3',
    title: 'Villa journalière avec piscine',
    city: 'Accra',
    country: 'Ghana',
    photos: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop'],
    price: 180,
    unit: 'day',
    rating: 4.9,
    reviews: 32,
    type: 'daily',
    amenities: ['piscine', 'parking', 'wifi'],
  },
];

export const isWeb = Platform.OS === 'web';
