import { PropertyFilters, TripFilters, VehicleFilters } from '@/components/filters/UnifiedFilterSheet';

export function buildPropertyQuery(f: PropertyFilters){
  return {
    country: f.destination?.country,
    city: f.destination?.city,
    transaction: f.transaction,
    category: f.category,
    type: f.type,
    bedrooms_gte: f.bedrooms,
    bathrooms_gte: f.bathrooms,
    livingrooms_gte: f.livingrooms,
    surfaceMin: f.surfaceMin,
    furnished: f.furnished,
    titleDeed: f.titleDeed,
    priceMin: f.budget?.min,
    priceMax: f.budget?.max,
    ratingMin: f.ratingMin,
    amenities: f.amenities && f.amenities.length ? f.amenities.join(',') : undefined,
  } as const;
}

export function buildTripQuery(f: TripFilters){
  return {
    country: f.destination?.country,
    city: f.destination?.city,
    checkIn: f.checkIn || undefined,
    checkOut: f.checkOut || undefined,
    guests: f.guests,
    priceMin: f.budget?.min,
    priceMax: f.budget?.max,
    ratingMin: f.ratingMin,
    amenities: f.amenities && f.amenities.length ? f.amenities.join(',') : undefined,
    sort: f.sort,
  } as const;
}

export function buildVehicleQuery(f: VehicleFilters){
  return {
    country: f.destination?.country,
    city: f.destination?.city,
    intent: f.intent,
    brand: f.brand,
    model: f.model,
    seats_gte: f.seats,
    fuel: f.fuel,
    gearbox: f.gearbox,
    withDriver: f.withDriver,
    yearMin: f.year?.min,
    yearMax: f.year?.max,
    priceDayMin: (f.pricePerDay?.min ?? f.budget?.min),
    priceDayMax: (f.pricePerDay?.max ?? f.budget?.max),
    startDate: f.startDate || undefined,
    endDate: f.endDate || undefined,
    ratingMin: f.ratingMin,
    companyId: f.companyId,
    amenities: f.amenities && f.amenities.length ? f.amenities.join(',') : undefined,
  } as const;
}
