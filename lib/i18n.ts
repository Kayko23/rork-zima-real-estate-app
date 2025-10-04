export type Locale = 'fr' | 'en';

export const t = (l: Locale) => ({
  chooseLanguage: l === 'fr' ? 'Choisissez votre langue' : 'Choose your language',
  french: l === 'fr' ? 'Français' : 'French',
  english: l === 'fr' ? 'Anglais' : 'English',
  continue: l === 'fr' ? 'Continuer' : 'Continue',
  chooseCountry: l === 'fr' ? 'Choisissez un pays' : 'Choose a country',
  searchCountry: l === 'fr' ? 'Rechercher un pays...' : 'Search a country...',
  next: l === 'fr' ? 'Suivant' : 'Next',
  headerTabs: {
    properties: l === 'fr' ? 'Propriétés' : 'Properties',
    travels: l === 'fr' ? 'Voyages' : 'Trips',
    vehicles: l === 'fr' ? 'Véhicules' : 'Vehicles',
  },
  premium: l === 'fr' ? 'Premium' : 'Premium',
  viewAll: l === 'fr' ? 'Voir tout' : 'View all',
  vehiclesPremium: l === 'fr' ? 'Véhicules premium' : 'Premium vehicles',
  vehiclesRent: l === 'fr' ? 'Location' : 'Rent',
  vehiclesSale: l === 'fr' ? 'Vente' : 'Sale',
  vehiclesVip: l === 'fr' ? 'VIP avec chauffeur' : 'VIP with driver',
  vehiclesDriver: l === 'fr' ? 'Chauffeurs Pro' : 'Pro Drivers',
  results: l === 'fr' ? 'Résultats' : 'Results',
  notFound: l === 'fr' ? 'Introuvable' : 'Not found',
});
