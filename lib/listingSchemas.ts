import { z } from 'zod';

const Money = z.object({
  amount: z.number().nonnegative('Le montant doit être positif'),
  currency: z.enum(['XOF', 'GHS', 'NGN', 'USD', 'EUR'])
});

const BaseListing = z.object({
  title: z.string().min(6, 'Le titre doit contenir au moins 6 caractères'),
  categoryPath: z.array(z.string()).min(1, 'Sélectionnez une catégorie'),
  country: z.string().min(2, 'Sélectionnez un pays'),
  city: z.string().min(2, 'La ville est requise'),
  address: z.string().min(3, "L'adresse est requise"),
  description: z.string().min(30, 'La description doit contenir au moins 30 caractères'),
  media: z.object({
    coverUrl: z.string().url('URL de couverture invalide'),
    gallery: z.array(z.string().url()).default([])
  }),
  isPremium: z.boolean().default(false),
  isVip: z.boolean().default(false),
});

export const PropertyListingSchema = BaseListing.extend({
  transaction: z.enum(['sale', 'rent', 'lease'], {
    message: 'Sélectionnez le type de transaction'
  }),
  price: Money,
  areaM2: z.number().positive('La surface doit être positive').optional(),
  bedrooms: z.number().int().min(0, 'Nombre de chambres invalide').optional(),
  bathrooms: z.number().int().min(0, 'Nombre de salles de bain invalide').optional(),
  livingrooms: z.number().int().min(0, 'Nombre de salons invalide').optional(),
  yearBuilt: z.string().optional(),
  documents: z.array(z.string().url()).default([]),
  amenities: z.array(z.string()).default([]),
  orientation: z.string().optional(),
  landmark: z.string().optional(),
});

export const TripListingSchema = BaseListing.extend({
  rentUnit: z.enum(['night']).default('night'),
  price: Money,
  capacity: z.number().int().min(1, 'La capacité doit être au moins 1'),
  ratingMin: z.number().min(0).max(5).optional(),
  checkin: z.string().optional(),
  checkout: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
});

export const VehicleListingSchema = BaseListing.extend({
  subType: z.enum([
    'vip_avec_chauffeur',
    'auto',
    '4x4',
    'minibus',
    'moto',
    'bateau',
    'neuf',
    'occasion'
  ], {
    message: 'Sélectionnez un sous-type'
  }),
  withDriver: z.boolean().default(false),
  seats: z.number().int().min(1, 'Le nombre de places doit être au moins 1').optional(),
  fuel: z.enum(['diesel', 'essence', 'hybride', 'electrique']).optional(),
  gearbox: z.enum(['auto', 'manuel']).optional(),
  luggage: z.number().int().min(0).optional(),
  rentUnit: z.enum(['day', 'week', 'month']).optional(),
  price: Money,
  deposit: z.number().nonnegative('La caution doit être positive').optional(),
  mileageLimit: z.number().positive('La limite de kilométrage doit être positive').optional(),
  driverFee: z.number().nonnegative('Les frais de chauffeur doivent être positifs').optional(),
  companyName: z.string().optional(),
  year: z.string().optional(),
  mileage: z.number().nonnegative().optional(),
  condition: z.enum(['neuf', 'excellent', 'bon', 'correct']).optional(),
});

export type PropertyListing = z.infer<typeof PropertyListingSchema>;
export type TripListing = z.infer<typeof TripListingSchema>;
export type VehicleListing = z.infer<typeof VehicleListingSchema>;
