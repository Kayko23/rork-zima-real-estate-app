import { useQuery } from '@tanstack/react-query';
import type { Vehicle, VehicleKind } from '@/types/vehicle';
import { useSettings } from '@/hooks/useSettings';

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    title: 'Mercedes V-Class',
    city: 'Abidjan',
    countryCode: 'CI',
    price: 120000,
    currency: 'XOF',
    premium: true,
    kind: 'vip',
    seats: 7,
    fuel: 'Diesel',
    gearbox: 'auto',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 127,
    description: 'Mercedes V-Class luxueuse avec intérieur en cuir, idéale pour les déplacements VIP et les transferts aéroport.',
    amenities: ['WiFi', 'Eau minérale', 'Chargeurs USB', 'Sièges massants'],
    policies: ['Annulation gratuite jusqu\'à 24h avant', 'Carburant inclus', 'Chauffeur professionnel bilingue'],
    availability: { available: true },
    agency: { name: 'Prestige Cars CI', verified: true, address: 'Cocody, Abidjan', phone: '+2250707123456' },
  },
  {
    id: 'v2',
    title: 'Toyota Corolla',
    city: 'Lomé',
    countryCode: 'TG',
    price: 35000,
    currency: 'XOF',
    premium: false,
    kind: 'rent',
    seats: 5,
    fuel: 'Essence',
    gearbox: 'auto',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=900&h=600&fit=crop',
    rating: 4.6,
    reviewCount: 89,
    description: 'Toyota Corolla fiable et économique, parfaite pour vos déplacements quotidiens.',
    amenities: ['Climatisation', 'Radio Bluetooth'],
    policies: ['Permis de conduire requis', 'Caution de 100 000 XOF', 'Kilométrage illimité'],
    availability: { available: true },
    doors: 4,
    luggage: 2,
    agency: { name: 'Togo Rent Auto', verified: false, address: 'Centre-ville, Lomé', phone: '+22890123456' },
  },
  {
    id: 'v3',
    title: 'Hyundai H1',
    city: 'Cotonou',
    countryCode: 'BJ',
    price: 9000000,
    currency: 'XOF',
    premium: false,
    kind: 'sale',
    seats: 9,
    fuel: 'Diesel',
    gearbox: 'manuelle',
    image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=900&h=600&fit=crop',
    rating: 4.2,
  },
  {
    id: 'v4',
    title: 'Chauffeur Pro Paul',
    city: 'Dakar',
    countryCode: 'SN',
    price: 60000,
    currency: 'XOF',
    premium: true,
    kind: 'driver',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=600&fit=crop',
    rating: 5,
    reviewCount: 243,
    description: 'Chauffeur professionnel avec 12 ans d\'expérience, ponctuel et discret.',
    policies: ['Disponible 24/7', 'Véhicule Mercedes Classe E inclus', 'Transferts aéroport spécialisés'],
    availability: { available: true },
    driver: { name: 'Paul Diop', years: 12, languages: ['Français', 'Wolof', 'Anglais'], trips: 1847 },
  },
  {
    id: 'v5',
    title: 'BMW X5',
    city: 'Douala',
    countryCode: 'CM',
    price: 150000,
    currency: 'XAF',
    premium: true,
    kind: 'vip',
    seats: 5,
    fuel: 'Essence',
    gearbox: 'auto',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 156,
    description: 'BMW X5 de luxe avec toutes les options, pour une expérience de conduite exceptionnelle.',
    amenities: ['Toit panoramique', 'Système audio Harman Kardon', 'Sièges chauffants', 'Caméra 360°'],
    policies: ['Chauffeur disponible sur demande', 'Assurance tous risques incluse', 'Carburant non inclus'],
    availability: { available: false, nextAvailable: '15 janvier 2025' },
    doors: 5,
    luggage: 3,
    agency: { name: 'Luxury Drive Cameroun', verified: true, address: 'Bonanjo, Douala', phone: '+237670123456' },
  },
  {
    id: 'v6',
    title: 'Peugeot 508',
    city: 'Abidjan',
    countryCode: 'CI',
    price: 45000,
    currency: 'XOF',
    premium: false,
    kind: 'rent',
    seats: 5,
    fuel: 'Diesel',
    gearbox: 'auto',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop',
    rating: 4.3,
  },
  {
    id: 'v7',
    title: 'Range Rover Sport',
    city: 'Libreville',
    countryCode: 'GA',
    price: 25000000,
    currency: 'XAF',
    premium: true,
    kind: 'sale',
    seats: 7,
    fuel: 'Hybride',
    gearbox: 'auto',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop',
    rating: 4.9,
  },
  {
    id: 'v8',
    title: 'Chauffeur Pro Marie',
    city: 'Abidjan',
    countryCode: 'CI',
    price: 55000,
    currency: 'XOF',
    premium: false,
    kind: 'driver',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&h=600&fit=crop',
    rating: 4.7,
  },
  {
    id: 'v9',
    title: 'Audi A6',
    city: 'Abidjan',
    countryCode: 'CI',
    price: 95000,
    currency: 'XOF',
    premium: true,
    kind: 'vip',
    seats: 5,
    fuel: 'Essence',
    gearbox: 'auto',
    image: 'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=900&h=600&fit=crop',
    rating: 4.7,
  },
  {
    id: 'v10',
    title: 'Nissan Patrol',
    city: 'Dakar',
    countryCode: 'SN',
    price: 18000000,
    currency: 'XOF',
    premium: true,
    kind: 'sale',
    seats: 7,
    fuel: 'Diesel',
    gearbox: 'auto',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop',
    rating: 4.5,
  },
  {
    id: 'v11',
    title: 'Renault Clio',
    city: 'Lomé',
    countryCode: 'TG',
    price: 28000,
    currency: 'XOF',
    premium: false,
    kind: 'rent',
    seats: 5,
    fuel: 'Essence',
    gearbox: 'manuelle',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&h=600&fit=crop',
    rating: 4.1,
  },
  {
    id: 'v12',
    title: 'Chauffeur Pro Amadou',
    city: 'Douala',
    countryCode: 'CM',
    price: 65000,
    currency: 'XAF',
    premium: true,
    kind: 'driver',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=600&fit=crop',
    rating: 4.9,
  },
];

export type VehicleFilter = Partial<{
  premium: boolean;
  kind: VehicleKind;
  countryCode: string;
}>;

export function useVehicles(filter: VehicleFilter = {}) {
  const { country, allowAllCountries } = useSettings();
  const merged: VehicleFilter = {
    ...filter,
    countryCode: allowAllCountries ? filter.countryCode : (filter.countryCode ?? country?.code ?? undefined),
  };
  return useQuery({
    queryKey: ['vehicles', merged],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 150));
      return MOCK_VEHICLES.filter((v) => {
        if (!allowAllCountries && merged.countryCode && v.countryCode !== merged.countryCode) return false;
        if (allowAllCountries && merged.countryCode && v.countryCode !== merged.countryCode) return false;
        if (merged.premium !== undefined && v.premium !== merged.premium) return false;
        if (merged.kind && v.kind !== merged.kind) return false;
        return true;
      });
    },
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return MOCK_VEHICLES.find((v) => v.id === id) || null;
    },
  });
}
