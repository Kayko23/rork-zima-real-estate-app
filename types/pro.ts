export type ProStatus = 'none' | 'draft' | 'pending_review' | 'verified' | 'rejected';

export type ProDomain = 'property' | 'trip' | 'vehicle';
export type Sector = 'property' | 'travel' | 'vehicles';

export type IdDocType = 'CNI' | 'PASSEPORT' | 'RESIDENCE';

export type AccountType = 'INDEPENDANT' | 'AGENCE';

export type ProRole =
  | 'agent'
  | 'property_manager'
  | 'hotel'
  | 'host'
  | 'vehicle_agency'
  | 'pro_driver'
  | 'private_owner';

export type RentUnit = 'night' | 'day' | 'week' | 'month';
export type CurrencyCode = 'XOF' | 'GHS' | 'NGN' | 'USD' | 'EUR';
export type FuelType = 'diesel' | 'essence' | 'hybride' | 'electrique';
export type Transmission = 'auto' | 'manuel';

export type ProCategory =
  | 'agent'
  | 'agency'
  | 'property_manager'
  | 'consulting'
  | 'hospitality'
  | 'hotel'
  | 'daily_residence'
  | 'holiday_villa'
  | 'travel_agency'
  | 'vip_with_driver'
  | 'vehicle_rental'
  | 'vehicle_sales'
  | 'pro_driver';

export interface ProKycIdentity {
  accountType: AccountType;
  legalName: string;
  birthDate?: string;
  nationality: string;
  country: string;
  city: string;
  addressLine: string;
  idType: IdDocType;
  idNumber: string;
  idExpiry?: string;
}

export interface ProKycContacts {
  email: string;
  phoneWhatsApp?: string;
  phoneMobile?: string;
  website?: string;
}

export interface ProKycDocuments {
  idFrontUrl: string;
  idBackUrl?: string;
  selfieWithIdUrl: string;
  avatarUrl: string;

  businessRegistryUrl?: string;
  operationLicenseUrl?: string;
  drivingLicenseFrontUrl?: string;
  drivingLicenseBackUrl?: string;
  driverExperienceYears?: number;
  fleetInsuranceUrl?: string;
}

export interface ProProfile {
  sectors: Sector[];
  categories: ProCategory[];
  servedAreas: { country: string; city?: string }[];
  bio: string;
  languages: string[];
  businessName?: string;
  rccm?: string;
  nif?: string;
}

export interface ProKycPayload {
  identity: ProKycIdentity;
  contacts: ProKycContacts;
  documents: ProKycDocuments;
  profile: ProProfile;
  acceptedTerms: boolean;
}

export interface ProKyc {
  accountType: AccountType;
  legalName: string;
  birthDate?: string;
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

  businessRegistryUrl?: string;
  operationLicenseUrl?: string;
  drivingLicenseFrontUrl?: string;
  drivingLicenseBackUrl?: string;
  driverExperienceYears?: number;
  fleetInsuranceUrl?: string;

  sectors: Sector[];
  categories: ProCategory[];
  bio: string;
  businessName?: string;
  rccm?: string;
  nif?: string;
  areas: { country: string; city?: string }[];
  languages: string[];

  consentAccepted: boolean;
  status: ProStatus;
  rejectionReason?: string;

  services?: string[];
  rating?: number;
  verifiedAt?: string | null;
}

export interface ProKycDraft extends Partial<ProKyc> {
  currentStep?: number;
}
