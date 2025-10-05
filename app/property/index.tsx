import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSearchPreset } from '@/hooks/useSearchPreset';
import { X } from 'lucide-react-native';
import { CATEGORIES, CategorySlug } from '@/types/taxonomy';
import { openCategory } from '@/lib/navigation';

import { sortPremiumFirst } from '@/utils/sortProperties';
import UnifiedFilterSheet, { type PropertyFilters } from '@/components/filters/UnifiedFilterSheet';
import { useSettings } from '@/hooks/useSettings';
import { useMoney } from '@/lib/money';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import ZimaBrand from '@/components/ui/ZimaBrand';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import ActiveCountryBadge from '@/components/ui/ActiveCountryBadge';
import CategoryRail from '@/components/home/CategoryRail';
import PropertyCard, { PropertyItem } from '@/components/cards/PropertyCard';

const INITIAL: PropertyFilters = {
  destination: { country: undefined, city: undefined },
  transaction: undefined,
  category: undefined,
  type: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  livingrooms: undefined,
  surfaceMin: undefined,
  furnished: undefined,
  titleDeed: undefined,
  budget: { min: undefined, max: undefined },
  ratingMin: undefined,
  amenities: [],
};

export default function PropertyScreen(){
  const insets = useSafeAreaInsets();
  const tabBarH = 56;
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { country: activeCountry, allowAllCountries } = useSettings();
  const { format } = useMoney();
  const { preset, reset: resetPreset } = useSearchPreset();
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<PropertyFilters>(INITIAL);

  useEffect(() => {
    const cat = params.category as CategorySlug;
    if (cat && CATEGORIES[cat]?.domain !== 'property') {
      openCategory(cat, {}, 'replace');
    }
  }, [params.category]);

  useEffect(() => {
    if (preset?.domain === 'properties') {
      const newFilters: PropertyFilters = { ...INITIAL };
      setFilters(newFilters);
    }
  }, [preset]);

  useEffect(() => {
    if (!allowAllCountries && activeCountry?.name_fr) {
      setFilters(prev => ({ ...prev, destination: { country: prev.destination?.country ?? activeCountry.name_fr, city: prev.destination?.city } }));
    }
  }, [allowAllCountries, activeCountry?.name_fr]);

  const transformProperty = (item: any): PropertyItem => ({
    id: item.id,
    title: item.title ?? 'Annonce',
    city: item.city ?? 'Ville',
    priceLabel: format(item.price ?? 0, item.currency ?? 'XOF'),
    cover: item.photos?.[0] ?? item.image ?? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    badges: item.transaction === 'sale' ? ['À VENDRE'] : item.transaction === 'rent' ? ['À LOUER'] : [],
    facts: [
      item.bedrooms ? `${item.bedrooms} ch` : '',
      item.bathrooms ? `${item.bathrooms} sdb` : '',
      item.surface ? `${item.surface} m²` : ''
    ].filter(Boolean),
    rating: item.rating,
    isPremium: item.isPremium ?? item.premium ?? false
  });

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top, backgroundColor:'#fff', borderBottomWidth:0.5, borderBottomColor:'#E5E7EB', zIndex: 10 }}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16 }}>
          <ZimaBrand />
          <HeaderCountryButton />
        </View>
        
        <View style={{ paddingHorizontal:16, paddingTop:16, paddingBottom:12 }}>
          <SegmentedTabs 
            value="props" 
            onChange={(k)=>{
              if (k==='trips') router.push('/(tabs)/voyages');
              else if (k==='vehicles') router.push('/vehicles');
            }} 
          />
        </View>

        <View style={{ paddingHorizontal:16, paddingBottom:16 }}>
          <View style={{ marginBottom: 10 }}>
            <ActiveCountryBadge />
          </View>
          {preset?.domain === 'properties' && (
            <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:12 }}>
              {preset.premium && (
                <View style={{ backgroundColor:'#0B6B53', paddingHorizontal:12, paddingVertical:6, borderRadius:999, flexDirection:'row', alignItems:'center', gap:6 }}>
                  <Text style={{ color:'#fff', fontWeight:'700', fontSize:12 }}>Premium</Text>
                </View>
              )}
              {preset.category && (
                <View style={{ backgroundColor:'#E8F2EE', paddingHorizontal:12, paddingVertical:6, borderRadius:999, flexDirection:'row', alignItems:'center', gap:6 }}>
                  <Text style={{ color:'#0B6B53', fontWeight:'700', fontSize:12 }}>{preset.category}</Text>
                </View>
              )}
              {preset.subcategory && (
                <View style={{ backgroundColor:'#E8F2EE', paddingHorizontal:12, paddingVertical:6, borderRadius:999, flexDirection:'row', alignItems:'center', gap:6 }}>
                  <Text style={{ color:'#0B6B53', fontWeight:'700', fontSize:12 }}>{preset.subcategory}</Text>
                </View>
              )}
              <Pressable onPress={resetPreset} style={{ backgroundColor:'#F3F4F6', paddingHorizontal:12, paddingVertical:6, borderRadius:999, flexDirection:'row', alignItems:'center', gap:4 }}>
                <X size={14} color="#6B7280" strokeWidth={2.5} />
                <Text style={{ color:'#6B7280', fontWeight:'700', fontSize:12 }}>Réinitialiser</Text>
              </Pressable>
            </View>
          )}
          <Pressable 
            onPress={()=>setOpen(true)} 
            style={({ pressed }) => [{
              height: 56,
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: '#0B6B53',
              backgroundColor: pressed ? '#F0F9F6' : '#fff',
              justifyContent: 'center',
              paddingHorizontal: 16,
              shadowColor: '#0B6B53',
              shadowOpacity: 0.08,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3
            }]}
          >
            <Text style={{ fontWeight: '800', fontSize: 15, color: '#0B6B53' }}>
              {(filters.destination?.country) ?? 'Pays'}, {(filters.destination?.city) ?? 'Ville'} • {filters.category ?? 'Catégorie'} {filters.transaction ? `• ${filters.transaction==='sale'?'Vente':'Location'}` : ''}
            </Text>
            <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 13, fontWeight: '600' }}>
              Budget {fmt(filters.budget?.min)} – {fmt(filters.budget?.max)}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 200, paddingBottom: insets.bottom + tabBarH + 16 }}
        scrollIndicatorInsets={{ bottom: insets.bottom + tabBarH }}
      >
        <CategoryRail
          title="Résidentiel"
          subcategories={[
            { label: 'Maisons individuelles', value: 'single_family' },
            { label: 'Cités résidentielles', value: 'gated' },
            { label: 'Colocation', value: 'colocation' },
            { label: 'Logements étudiants', value: 'student' },
            { label: 'Immeubles & copro', value: 'condo' },
          ]}
          queryKey={['properties-residential', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const properties = [
              { id: 'p1', title: 'Villa moderne 4 chambres', city: 'Abidjan', countryCode: 'CI', price: 85000000, currency: 'XOF', isPremium: true, transaction: 'sale', category: 'residential', bedrooms: 4, bathrooms: 3, surface: 250, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop', rating: 4.8 },
              { id: 'p2', title: 'Appartement 3 pièces', city: 'Dakar', countryCode: 'SN', price: 450000, currency: 'XOF', isPremium: false, transaction: 'rent', category: 'residential', bedrooms: 3, bathrooms: 2, surface: 120, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=600&fit=crop', rating: 4.5 },
              { id: 'p3', title: 'Maison familiale', city: 'Douala', countryCode: 'CM', price: 65000000, currency: 'XAF', isPremium: true, transaction: 'sale', category: 'residential', bedrooms: 5, bathrooms: 4, surface: 300, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop', rating: 4.9 },
            ];
            const filtered = properties.filter(p => !activeCountry?.code || p.countryCode === activeCountry.code);
            return sortPremiumFirst(filtered).slice(0, 10).map(transformProperty);
          }}
          renderItem={(item) => <PropertyCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/property/index', params: { category: 'residential' } } as any)}
          onPickSubcategory={(chip) => router.push({ pathname: '/property/index', params: { category: 'residential', sub: chip.value } } as any)}
        />

        <CategoryRail
          title="Commerces"
          subcategories={[
            { label: 'Boutiques', value: 'boutiques' },
            { label: 'Restaurants', value: 'restaurants' },
            { label: 'Magasins & entrepôts', value: 'warehouses' },
          ]}
          queryKey={['properties-commercial', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const properties = [
              { id: 'c1', title: 'Boutique centre-ville', city: 'Abidjan', countryCode: 'CI', price: 1200000, currency: 'XOF', isPremium: true, transaction: 'rent', category: 'commercial', surface: 80, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&h=600&fit=crop', rating: 4.6 },
              { id: 'c2', title: 'Restaurant équipé', city: 'Lomé', countryCode: 'TG', price: 45000000, currency: 'XOF', isPremium: false, transaction: 'sale', category: 'commercial', surface: 150, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&h=600&fit=crop', rating: 4.3 },
              { id: 'c3', title: 'Entrepôt logistique', city: 'Cotonou', countryCode: 'BJ', price: 2500000, currency: 'XOF', isPremium: true, transaction: 'rent', category: 'commercial', surface: 500, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&h=600&fit=crop', rating: 4.7 },
            ];
            const filtered = properties.filter(p => !activeCountry?.code || p.countryCode === activeCountry.code);
            return sortPremiumFirst(filtered).slice(0, 10).map(transformProperty);
          }}
          renderItem={(item) => <PropertyCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/property/index', params: { category: 'commercial' } } as any)}
          onPickSubcategory={(chip) => router.push({ pathname: '/property/index', params: { category: 'commercial', sub: chip.value } } as any)}
        />

        <CategoryRail
          title="Bureaux"
          queryKey={['properties-office', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const properties = [
              { id: 'o1', title: 'Bureau moderne 200m²', city: 'Abidjan', countryCode: 'CI', price: 1800000, currency: 'XOF', isPremium: true, transaction: 'rent', category: 'office', surface: 200, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=600&fit=crop', rating: 4.8 },
              { id: 'o2', title: 'Espace coworking', city: 'Dakar', countryCode: 'SN', price: 850000, currency: 'XOF', isPremium: false, transaction: 'rent', category: 'office', surface: 120, image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&h=600&fit=crop', rating: 4.5 },
              { id: 'o3', title: 'Immeuble de bureaux', city: 'Libreville', countryCode: 'GA', price: 350000000, currency: 'XAF', isPremium: true, transaction: 'sale', category: 'office', surface: 1200, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=600&fit=crop', rating: 4.9 },
            ];
            const filtered = properties.filter(p => !activeCountry?.code || p.countryCode === activeCountry.code);
            return sortPremiumFirst(filtered).slice(0, 10).map(transformProperty);
          }}
          renderItem={(item) => <PropertyCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/property/index', params: { category: 'office' } } as any)}
        />

        <CategoryRail
          title="Terrains"
          queryKey={['properties-land', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const properties = [
              { id: 'l1', title: 'Terrain 1000m² viabilisé', city: 'Abidjan', countryCode: 'CI', price: 45000000, currency: 'XOF', isPremium: true, transaction: 'sale', category: 'land', surface: 1000, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&h=600&fit=crop', rating: 4.6 },
              { id: 'l2', title: 'Parcelle agricole 5ha', city: 'Bamako', countryCode: 'ML', price: 120000000, currency: 'XOF', isPremium: false, transaction: 'sale', category: 'land', surface: 50000, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&h=600&fit=crop', rating: 4.2 },
              { id: 'l3', title: 'Terrain bord de mer', city: 'Lomé', countryCode: 'TG', price: 95000000, currency: 'XOF', isPremium: true, transaction: 'sale', category: 'land', surface: 2500, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&h=600&fit=crop', rating: 4.9 },
            ];
            const filtered = properties.filter(p => !activeCountry?.code || p.countryCode === activeCountry.code);
            return sortPremiumFirst(filtered).slice(0, 10).map(transformProperty);
          }}
          renderItem={(item) => <PropertyCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/property/index', params: { category: 'land' } } as any)}
        />

        <CategoryRail
          title="Espaces événementiels"
          queryKey={['properties-venue', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const properties = [
              { id: 'v1', title: 'Salle de réception 300 pers', city: 'Abidjan', countryCode: 'CI', price: 2500000, currency: 'XOF', isPremium: true, transaction: 'rent', category: 'venue', surface: 400, image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=900&h=600&fit=crop', rating: 4.8 },
              { id: 'v2', title: 'Espace événementiel jardin', city: 'Dakar', countryCode: 'SN', price: 1800000, currency: 'XOF', isPremium: false, transaction: 'rent', category: 'venue', surface: 600, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&h=600&fit=crop', rating: 4.6 },
              { id: 'v3', title: 'Villa événementielle', city: 'Douala', countryCode: 'CM', price: 3500000, currency: 'XAF', isPremium: true, transaction: 'rent', category: 'venue', surface: 500, image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=900&h=600&fit=crop', rating: 4.9 },
            ];
            const filtered = properties.filter(p => !activeCountry?.code || p.countryCode === activeCountry.code);
            return sortPremiumFirst(filtered).slice(0, 10).map(transformProperty);
          }}
          renderItem={(item) => <PropertyCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/property/index', params: { category: 'venue' } } as any)}
        />

        <CategoryRail
          title="Hôtels"
          queryKey={['properties-hotel', activeCountry?.code]}
          queryFn={async () => {
            await new Promise((r) => setTimeout(r, 150));
            const properties = [
              { id: 'h1', title: 'Hôtel 4 étoiles 50 chambres', city: 'Abidjan', countryCode: 'CI', price: 850000000, currency: 'XOF', isPremium: true, transaction: 'sale', category: 'hotel', surface: 2500, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=600&fit=crop', rating: 4.7 },
              { id: 'h2', title: 'Auberge 15 chambres', city: 'Lomé', countryCode: 'TG', price: 180000000, currency: 'XOF', isPremium: false, transaction: 'sale', category: 'hotel', surface: 800, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&h=600&fit=crop', rating: 4.3 },
              { id: 'h3', title: 'Resort bord de mer', city: 'Saly', countryCode: 'SN', price: 1200000000, currency: 'XOF', isPremium: true, transaction: 'sale', category: 'hotel', surface: 5000, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&h=600&fit=crop', rating: 4.9 },
            ];
            const filtered = properties.filter(p => !activeCountry?.code || p.countryCode === activeCountry.code);
            return sortPremiumFirst(filtered).slice(0, 10).map(transformProperty);
          }}
          renderItem={(item) => <PropertyCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/property/index', params: { category: 'hotel' } } as any)}
        />
      </ScrollView>

      <UnifiedFilterSheet
        kind="property"
        open={open}
        initial={filters}
        onClose={()=>setOpen(false)}
        onReset={()=>setFilters({ ...INITIAL, destination: { country: activeCountry?.name_fr, city: undefined } })}
        onApply={(f)=>{ setFilters(f); setOpen(false); }}
      />
    </View>
  );
}

const fmt = (n?: number) => n!=null ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits:0 }).format(n) : '—';
