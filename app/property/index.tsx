import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSearchPreset } from '@/hooks/useSearchPreset';
import { X } from 'lucide-react-native';
import { CATEGORIES, CategorySlug } from '@/types/taxonomy';
import { openCategory } from '@/lib/navigation';

import { sortPremiumFirst } from '@/utils/sortProperties';
import { api } from '@/lib/api';
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
    isPremium: item.premium ?? false
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
          queryKey={['properties-residential', activeCountry?.name_fr]}
          queryFn={async () => {
            const items = await api.listProperties({ country: activeCountry?.name_fr, category: 'residential', limit: 10 } as any);
            return sortPremiumFirst(items).map(transformProperty);
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
          queryKey={['properties-commercial', activeCountry?.name_fr]}
          queryFn={async () => {
            const items = await api.listProperties({ country: activeCountry?.name_fr, category: 'commercial', limit: 10 } as any);
            return sortPremiumFirst(items).map(transformProperty);
          }}
          renderItem={(item) => <PropertyCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/property/index', params: { category: 'commercial' } } as any)}
          onPickSubcategory={(chip) => router.push({ pathname: '/property/index', params: { category: 'commercial', sub: chip.value } } as any)}
        />

        <CategoryRail
          title="Bureaux"
          queryKey={['properties-office', activeCountry?.name_fr]}
          queryFn={async () => {
            const items = await api.listProperties({ country: activeCountry?.name_fr, category: 'office', limit: 10 } as any);
            return sortPremiumFirst(items).map(transformProperty);
          }}
          renderItem={(item) => <PropertyCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/property/index', params: { category: 'office' } } as any)}
        />

        <CategoryRail
          title="Terrains"
          queryKey={['properties-land', activeCountry?.name_fr]}
          queryFn={async () => {
            const items = await api.listProperties({ country: activeCountry?.name_fr, category: 'land', limit: 10 } as any);
            return sortPremiumFirst(items).map(transformProperty);
          }}
          renderItem={(item) => <PropertyCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/property/index', params: { category: 'land' } } as any)}
        />

        <CategoryRail
          title="Espaces événementiels"
          queryKey={['properties-venue', activeCountry?.name_fr]}
          queryFn={async () => {
            const items = await api.listProperties({ country: activeCountry?.name_fr, category: 'venue', limit: 10 } as any);
            return sortPremiumFirst(items).map(transformProperty);
          }}
          renderItem={(item) => <PropertyCard item={item} />}
          onSeeAll={() => router.push({ pathname: '/property/index', params: { category: 'venue' } } as any)}
        />

        <CategoryRail
          title="Hôtels"
          queryKey={['properties-hotel', activeCountry?.name_fr]}
          queryFn={async () => {
            const items = await api.listProperties({ country: activeCountry?.name_fr, category: 'hotel', limit: 10 } as any);
            return sortPremiumFirst(items).map(transformProperty);
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
