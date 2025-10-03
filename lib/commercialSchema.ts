import { z } from 'zod';

const commercialCommon = {
  floorAreaM2: z.number().positive().optional(),
  powerKva: z.number().positive().optional(),
  restrooms: z.number().int().min(0).optional(),
  parkingSpaces: z.number().int().min(0).optional(),
  accessibility: z.enum(['Aucune', 'PMR', 'Ascenseur', 'Rampe']).optional(),
};

const retailSpec = z.object({
  subCategory: z.literal('retail'),
  spec: z.object({
    ...commercialCommon,
    frontageM: z.number().positive().optional(),
    windowLengthM: z.number().positive().optional(),
    footTraffic: z.enum(['Faible', 'Moyen', 'Élevé']).optional(),
    hasChangingRooms: z.boolean().default(false),
    storageRoomM2: z.number().positive().optional(),
    mallName: z.string().optional(),
    signageAllowed: z.boolean().default(true),
  }),
});

const restaurantSpec = z.object({
  subCategory: z.literal('restaurant'),
  spec: z.object({
    ...commercialCommon,
    kitchenType: z.enum(['Aucune', 'Légère', 'Pro']).default('Pro'),
    hasExtraction: z.boolean().default(true),
    hasGreaseTrap: z.boolean().default(true),
    coldRoomM3: z.number().positive().optional(),
    indoorSeats: z.number().int().min(0).optional(),
    terraceSeats: z.number().int().min(0).optional(),
    liquorLicense: z.boolean().default(false),
    gasType: z.enum(['Électrique', 'Gaz bouteille', 'Gaz réseau']).optional(),
    noisePermit: z.boolean().default(false),
    deliveryArea: z.boolean().default(true),
  }),
});

const warehouseSpec = z.object({
  subCategory: z.literal('warehouse'),
  spec: z.object({
    ...commercialCommon,
    clearHeightM: z.number().positive().optional(),
    loadingDocks: z.number().int().min(0).optional(),
    driveInDoors: z.number().int().min(0).optional(),
    floorLoadKnM2: z.number().positive().optional(),
    yardAreaM2: z.number().positive().optional(),
    sprinklerSystem: z.boolean().default(false),
    rackingIncluded: z.boolean().default(false),
    officeAreaM2: z.number().positive().optional(),
    truckAccess: z.enum(['VL', 'PL 19t', 'Semi']).optional(),
  }),
});

export const commercialSpecSchema = z.discriminatedUnion('subCategory', [
  retailSpec,
  restaurantSpec,
  warehouseSpec,
]);

export type CommercialSpec = z.infer<typeof commercialSpecSchema>;
export type RetailSpec = z.infer<typeof retailSpec>;
export type RestaurantSpec = z.infer<typeof restaurantSpec>;
export type WarehouseSpec = z.infer<typeof warehouseSpec>;
