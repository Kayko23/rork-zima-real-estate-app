import { z } from 'zod';
import { ALLOWED_COUNTRY_CODES } from '@/constants/cfa';

const phoneRegex = /^[0-9+\s().-]{7,18}$/;

const ProCategories = [
  'AGENT',
  'AGENCE',
  'GESTIONNAIRE',
  'CONSEIL',
  'HOTELLERIE',
  'AGENT_IMMOBILIER',
  'GESTIONNAIRE_BIENS',
  'AGENCE_IMMOBILIERE',
  'RESP_RESERVATION_HOTEL',
  'RESP_RESERVATION_RESIDENCE',
  'GESTIONNAIRE_EVENEMENTIEL',
  'CHAUFFEUR_PRO',
] as const;

export const proKycSchema = z.object({
  accountType: z.enum(['INDEPENDANT', 'AGENCE']),
  legalName: z.string()
    .min(2, 'Le nom est requis')
    .refine(
      v => v.trim().split(/\s+/).length >= 2,
      "Entrez votre nom complet tel qu'indiqué sur la pièce"
    ),
  birthDate: z.string().min(1, 'La date de naissance est requise'),
  nationality: z.string().length(2, 'Sélectionnez votre nationalité'),
  country: z.enum(ALLOWED_COUNTRY_CODES as [string, ...string[]], 'Sélectionnez un pays'),
  city: z.string().min(2, 'La ville est requise'),
  addressLine: z.string().min(5, "L'adresse complète est requise"),

  idType: z.enum(['CNI', 'PASSEPORT', 'RESIDENCE']),
  idNumber: z.string().min(4, 'Le numéro de pièce est requis'),
  idExpiry: z.string().optional(),

  email: z.string().email('Email invalide'),
  phoneWhatsApp: z.string().regex(phoneRegex, 'Numéro invalide').optional().or(z.literal('')),
  phoneMobile: z.string().regex(phoneRegex, 'Numéro invalide').optional().or(z.literal('')),
  website: z.string().url('URL invalide').optional().or(z.literal('')),

  selfieWithIdUrl: z.string().min(1, 'Le selfie avec pièce est requis'),
  idFrontUrl: z.string().min(1, 'La photo recto de la pièce est requise'),
  idBackUrl: z.string().optional(),
  avatarUrl: z.string().min(1, 'La photo de profil est requise'),

  category: z.enum(ProCategories),
  bio: z.string().min(30, 'La bio doit contenir au moins 30 caractères'),
  businessName: z.string().optional(),
  rccm: z.string().optional(),
  nif: z.string().optional(),
  areas: z.array(z.object({
    country: z.string(),
    city: z.string().optional(),
  })).min(1, "Ajoutez au moins une zone d'intervention"),
  languages: z.array(z.string()).min(1, 'Sélectionnez au moins une langue'),

  consentAccepted: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions'
  }),
}).refine(
  data => Boolean(data.phoneWhatsApp) || Boolean(data.phoneMobile),
  {
    message: 'Indiquez au moins un numéro (WhatsApp ou mobile)',
    path: ['phoneMobile'],
  }
).refine(
  data => {
    if (data.accountType === 'AGENCE') {
      return Boolean(data.businessName && data.businessName.trim().length > 0);
    }
    return true;
  },
  {
    message: 'Le nom commercial est requis pour une agence',
    path: ['businessName'],
  }
);

export type ProKycInput = z.infer<typeof proKycSchema>;
