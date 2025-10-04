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
    image: 'https://picsum.photos/seed/v1/900/600',
    rating: 4.9,
  },
  {
    id: 'v2',
    title: 'Toyota Corolla',
    city: 'Lomé',
    countryCode: 'TG',
    price: 35000,
    currency: 'XOF',
    premium: true,
    kind: 'rent',
    seats: 5,
    image: 'https://picsum.photos/seed/v2/900/600',
    rating: 4.6,
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
    image: 'https://picsum.photos/seed/v3/900/600',
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
    image: 'https://picsum.photos/seed/v4/900/600',
    rating: 5,
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
    image: 'https://picsum.photos/seed/v5/900/600',
    rating: 4.8,
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
    image: 'https://picsum.photos/seed/v6/900/600',
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
    image: 'https://picsum.photos/seed/v7/900/600',
    rating: 4.9,
  },
  {
    id: 'v8',
    title: 'Chauffeur Pro Marie',
    city: 'Abidjan',
    countryCode: 'CI',
    price: 55000,
    currency: 'XOF',
    premium: true,
    kind: 'driver',
    image: 'https://picsum.photos/seed/v8/900/600',
    rating: 4.7,
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
