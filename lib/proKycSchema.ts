import { z } from 'zod';
import { ALLOWED_COUNTRY_CODES } from '@/constants/cfa';

const phoneRegex = /^[0-9+\s().-]{7,18}$/;

const ProCategories = [
  'agent',
  'agency',
  'property_manager',
  'consulting',
  'hospitality',
  'hotel',
  'daily_residence',
  'holiday_villa',
  'travel_agency',
  'vip_with_driver',
  'vehicle_rental',
  'vehicle_sales',
  'pro_driver',
] as const;

const Sectors = ['property', 'travel', 'vehicles'] as const;

export const identitySchema = z.object({
  accountType: z.enum(['INDEPENDANT', 'AGENCE']),
  legalName: z.string()
    .min(2, 'Le nom est requis')
    .refine(
      v => v.trim().split(/\s+/).length >= 2,
      "Entrez votre nom complet tel qu'indiqué sur la pièce"
    ),
  birthDate: z.string().optional(),
  nationality: z.string().length(2, 'Sélectionnez votre nationalité'),
  country: z.enum(ALLOWED_COUNTRY_CODES as [string, ...string[]], 'Sélectionnez un pays'),
  city: z.string().min(2, 'La ville est requise'),
  addressLine: z.string().min(5, "L'adresse complète est requise"),
  idType: z.enum(['CNI', 'PASSEPORT', 'RESIDENCE']),
  idNumber: z.string().min(4, 'Le numéro de pièce est requis'),
  idExpiry: z.string().optional(),
}).superRefine((v, ctx) => {
  if (v.accountType === 'INDEPENDANT' && !v.birthDate) {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: 'Date de naissance requise pour un indépendant', 
      path: ['birthDate'] 
    });
  }
});

export const contactsSchema = z.object({
  email: z.string().email('Email invalide'),
  phoneWhatsApp: z.string().regex(phoneRegex, 'Numéro invalide').optional().or(z.literal('')),
  phoneMobile: z.string().regex(phoneRegex, 'Numéro invalide').optional().or(z.literal('')),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
}).superRefine((v, ctx) => {
  if (!v.phoneWhatsApp && !v.phoneMobile) {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: 'WhatsApp ou Mobile est requis', 
      path: ['phoneWhatsApp'] 
    });
  }
});

export const profileSchema = z.object({
  sectors: z.array(z.enum(Sectors)).min(1, "Sélectionnez au moins un secteur d'activité"),
  categories: z.array(z.enum(ProCategories)).min(1, 'Sélectionnez au moins une catégorie'),
  servedAreas: z.array(z.object({ 
    country: z.string(), 
    city: z.string().optional() 
  })).min(1, "Ajoutez au moins une zone d'intervention"),
  bio: z.string().min(30, 'La bio doit contenir au moins 30 caractères'),
  languages: z.array(z.string()).min(1, 'Sélectionnez au moins une langue'),
  businessName: z.string().optional(),
  rccm: z.string().optional(),
  nif: z.string().optional(),
});

export const documentsSchema = z.object({
  idFrontUrl: z.string().min(1, 'La photo recto de la pièce est requise'),
  selfieWithIdUrl: z.string().min(1, 'Le selfie avec pièce est requis'),
  avatarUrl: z.string().min(1, 'La photo de profil est requise'),

  idBackUrl: z.string().optional(),
  businessRegistryUrl: z.string().optional(),
  operationLicenseUrl: z.string().optional(),
  drivingLicenseFrontUrl: z.string().optional(),
  drivingLicenseBackUrl: z.string().optional(),
  driverExperienceYears: z.coerce.number().int().min(0).optional(),
  fleetInsuranceUrl: z.string().optional(),
});

export const fullKycSchema = z.object({
  identity: identitySchema,
  contacts: contactsSchema,
  profile: profileSchema,
  documents: documentsSchema,
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: 'Veuillez accepter les conditions'
  }),
}).superRefine((v, ctx) => {
  const hasVehicles = v.profile.sectors.includes('vehicles');
  const isDriver = v.profile.categories.includes('pro_driver');

  if (hasVehicles && isDriver) {
    if (!v.documents.drivingLicenseFrontUrl) {
      ctx.addIssue({ 
        code: z.ZodIssueCode.custom, 
        message: 'Permis de conduire requis pour chauffeur pro', 
        path: ['documents', 'drivingLicenseFrontUrl'] 
      });
    }
  }

  if (v.profile.sectors.includes('travel')) {
    const needsLicense = v.profile.categories.some(c => 
      ['hotel', 'daily_residence', 'holiday_villa', 'travel_agency'].includes(c)
    );
    if (needsLicense && v.identity.accountType === 'AGENCE' && !v.documents.operationLicenseUrl) {
      ctx.addIssue({ 
        code: z.ZodIssueCode.custom, 
        message: "Autorisation d'exploitation requise pour agence de voyage/hôtel", 
        path: ['documents', 'operationLicenseUrl'] 
      });
    }
  }

  if (v.identity.accountType === 'AGENCE' && !v.profile.businessName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Le nom commercial est requis pour une agence',
      path: ['profile', 'businessName'],
    });
  }
});

export type ProKycInput = z.infer<typeof fullKycSchema>;
export type IdentityInput = z.infer<typeof identitySchema>;
export type ContactsInput = z.infer<typeof contactsSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type DocumentsInput = z.infer<typeof documentsSchema>;
