export type ProStatus = 'none' | 'draft' | 'pending_review' | 'verified' | 'rejected';

export type IdDocType = 'CNI' | 'PASSEPORT' | 'RESIDENCE';

export type AccountType = 'INDEPENDANT' | 'AGENCE';

export type ProCategory = 'AGENT' | 'AGENCE' | 'GESTIONNAIRE' | 'CONSEIL' | 'HOTELLERIE';

export interface ProKyc {
  accountType: AccountType;
  legalName: string;
  birthDate: string;
  nationality: string;
  country: string;
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
}

export interface ProKycDraft extends Partial<ProKyc> {
  currentStep?: number;
}
