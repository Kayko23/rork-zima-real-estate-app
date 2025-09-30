export type CountryCode = 
  | 'SN' | 'CI' | 'BF' | 'ML' | 'NE' | 'BJ' | 'TG' 
  | 'GH' | 'NG' | 'CM' | 'GA' | 'CG' | 'TD' | 'GQ'
  | 'CD' | 'CF' | 'RW' | 'BI' | 'DJ' | 'SO' | 'KE'
  | 'UG' | 'TZ' | 'MZ' | 'ZM' | 'ZW' | 'BW' | 'NA'
  | 'ZA' | 'LS' | 'SZ' | 'MG' | 'MU' | 'SC';

export type Currency = 'XOF' | 'XAF' | 'NGN' | 'GHS' | 'USD' | 'EUR';

export type PriceRange = { 
  min?: number; 
  max?: number; 
  step: number; 
  currency: Currency;
};

export type PropertyCategory = 
  | 'residential' 
  | 'offices' 
  | 'retail' 
  | 'industrial' 
  | 'land' 
  | 'event';

export type PropertyType = 'sale' | 'rent';

export type PropertyPeriod = 'monthly' | 'daily';

export type PropertyFilters = {
  country?: CountryCode;
  city?: string;
  category?: PropertyCategory;
  type?: PropertyType;
  period?: PropertyPeriod;
  price?: PriceRange;
  rooms?: number;
  baths?: number;
  surfaceMin?: number;
  features?: string[];
};

export type TripCategory = 'hotel' | 'residence';

export type TripFilters = {
  country?: CountryCode;
  city?: string;
  category?: TripCategory;
  dateFrom?: string;
  dateTo?: string;
  guests?: number;
  price?: PriceRange;
  ratingMin?: number;
  amenities?: string[];
};

export type ProService = 
  | 'agent' 
  | 'agency' 
  | 'property_management' 
  | 'hotel_booking' 
  | 'residence_booking'
  | 'event_space_management';

export type ProFilters = {
  country?: CountryCode;
  city?: string;
  services?: ProService[];
  verified?: boolean;
  premium?: boolean;
};

export type FilterScope = 'property' | 'trip' | 'pro';

export type SavedPreset = {
  id: string;
  name: string;
  scope: FilterScope;
  payload: PropertyFilters | TripFilters | ProFilters;
  updatedAt: number;
};
