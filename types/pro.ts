export type ProStatus = 'none' | 'draft' | 'pending_review' | 'verified' | 'rejected';

export type IdDocType = 'CNI' | 'PASSEPORT' | 'RESIDENCE';

export type AccountType = 'INDEPENDANT' | 'AGENCE';

export type ProCategory =
  | 'AGENT'
  | 'AGENCE'
  | 'GESTIONNAIRE'
  | 'CONSEIL'
  | 'HOTELLERIE'
  | 'AGENT_IMMOBILIER'
  | 'GESTIONNAIRE_BIENS'
  | 'AGENCE_IMMOBILIERE'
  | 'RESP_RESERVATION_HOTEL'
  | 'RESP_RESERVATION_RESIDENCE'
  | 'GESTIONNAIRE_EVENEMENTIEL'
  | 'CHAUFFEUR_PRO';

export interface ProKyc {
  accountType: AccountType;
  legalName: string;
  birthDate: string;
  nationality: string; // ISO2
  country: string; // ISO2
  city: string;
  addressLine: string;

  idType: IdDocType;
  idNumber: string;
  idExpiry?: string;

  email: string;
  phoneWhatsApp?: string;
  phoneMobile?: string;
  website?: string;

  selfieWithIdUrl: string;
  idFrontUrl: string;
  idBackUrl?: string;
  avatarUrl: string;

  category: ProCategory;
  bio: string;
  businessName?: string;
  rccm?: string;
  nif?: string;
  areas: { country: string; city?: string }[];
  languages: string[];

  consentAccepted: boolean;
  status: ProStatus;
  rejectionReason?: string;

  // Extensions (non bloquantes)
  services?: string[];
  rating?: number;
  verifiedAt?: string | null;
}

export interface ProKycDraft extends Partial<ProKyc> {
  currentStep?: number;
}
