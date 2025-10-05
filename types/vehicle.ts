export type VehicleKind = 'rent' | 'sale' | 'vip' | 'driver';

export type Vehicle = {
  id: string;
  title: string;
  city: string;
  countryCode: string;
  price: number;
  currency: 'XOF' | 'XAF';
  premium: boolean;
  kind: VehicleKind;
  seats?: number;
  image: string;
  rating?: number;
  fuel?: string;
  gearbox?: 'auto' | 'manuelle';
};
