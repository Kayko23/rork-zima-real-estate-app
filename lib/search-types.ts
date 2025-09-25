export type Section = 'properties' | 'services' | 'trips';

export type TripsSearch = {
  destination?: string;
  startDate?: string;
  endDate?: string;
  guests?: number;
};

export type TripsFilters = {
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  hasPool?: boolean;
  hasWifi?: boolean;
  breakfast?: boolean;
};