import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSearchPreset } from '@/hooks/useSearchPreset';
import { X } from 'lucide-react-native';
import { CATEGORIES, CategorySlug } from '@/types/taxonomy';
import { openCategory } from '@/lib/navigation';


import UnifiedFilterSheet, { type PropertyFilters } from '@/components/filters/UnifiedFilterSheet';
import { useSettings } from '@/hooks/useSettings';
import { useMoney } from '@/lib/money';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import HeaderCountryButton from '@/components/HeaderCountryButton';
import PropertyStripSection from '@/components/home/PropertyStripSection';
import { PropertyItem } from '@/components/cards/PropertyCard';
import { Pill } from '@/components/home/SubcatPills';

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

  const RES_PILLS: Pill[] = useMemo(() => [
    { key: 'maisons', label: 'Maisons individuelles' },
    { key: 'cites', label: 'Cités résidentielles' },
    { key: 'colocation', label: 'Colocation' },
    { key: 'etudiants', label: 'Logements étudiants' },
    { key: 'immeubles', label: 'Immeubles & copro' },
  ], []);

  const COM_PILLS: Pill[] = useMemo(() => [
    { key: 'boutiques', label: 'Boutiques' },
    { key: 'galeries', label: 'Galeries' },
    { key: 'hangars', label: 'Hangars' },
    { key: 'depots', label: 'Dépôts' },
    { key: 'restos', label: 'Restaurants' },
  ], []);

  const OFFICE_PILLS: Pill[] = useMemo(() => [
    { key: 'bureaux', label: 'Bureaux' },
    { key: 'plateaux', label: 'Plateaux' },
    { key: 'coworking', label: 'Coworking' },
    { key: 'centres', label: 'Centres d\'affaires' },
  ], []);

  const LAND_PILLS: Pill[] = useMemo(() => [
    { key: 'residentiel', label: 'Résidentiel' },
    { key: 'commercial', label: 'Commercial' },
    { key: 'agricole', label: 'Agricole' },
    { key: 'lotissement', label: 'Lotissement' },
  ], []);

  const EVENT_PILLS: Pill[] = useMemo(() => [
    { key: 'salles', label: 'Salles de réception' },
    { key: 'jardins', label: 'Jardins' },
    { key: 'terrasses', label: 'Terrasses' },
    { key: 'complexes', label: 'Complexes' },
  ], []);

  const residentialItems = useMemo<PropertyItem[]>(() => {
    const mockData: PropertyItem[] = [];
    RES_PILLS.forEach((pill) => {
      for (let i = 0; i < 5; i++) {
        mockData.push({
          id: `res-${pill.key}-${i}`,
          title: `${pill.label} ${i + 1}`,
          city: activeCountry?.name_fr ?? 'Ville',
          priceLabel: format(Math.floor(Math.random() * 500000) + 100000, 'XOF'),
          cover: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          badges: Math.random() > 0.5 ? ['À VENDRE'] : ['À LOUER'],
          facts: ['3 ch', '2 sdb', '120 m²'],
          rating: 4.5,
          isPremium: Math.random() > 0.7,
          subcategory: pill.key,
        } as any);
      }
    });
    return mockData;
  }, [activeCountry?.name_fr, RES_PILLS, format]);

  const commerceItems = useMemo<PropertyItem[]>(() => {
    const mockData: PropertyItem[] = [];
    COM_PILLS.forEach((pill) => {
      for (let i = 0; i < 5; i++) {
        mockData.push({
          id: `com-${pill.key}-${i}`,
          title: `${pill.label} ${i + 1}`,
          city: activeCountry?.name_fr ?? 'Ville',
          priceLabel: format(Math.floor(Math.random() * 800000) + 200000, 'XOF'),
          cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
          badges: Math.random() > 0.5 ? ['À VENDRE'] : ['À LOUER'],
          facts: ['200 m²'],
          rating: 4.3,
          isPremium: Math.random() > 0.7,
          subcategory: pill.key,
        } as any);
      }
    });
    return mockData;
  }, [activeCountry?.name_fr, COM_PILLS, format]);

  const officeItems = useMemo<PropertyItem[]>(() => {
    const mockData: PropertyItem[] = [];
    OFFICE_PILLS.forEach((pill) => {
      for (let i = 0; i < 5; i++) {
        mockData.push({
          id: `office-${pill.key}-${i}`,
          title: `${pill.label} ${i + 1}`,
          city: activeCountry?.name_fr ?? 'Ville',
          priceLabel: format(Math.floor(Math.random() * 600000) + 150000, 'XOF'),
          cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
          badges: Math.random() > 0.5 ? ['À VENDRE'] : ['À LOUER'],
          facts: ['150 m²', '5 postes'],
          rating: 4.4,
          isPremium: Math.random() > 0.7,
          subcategory: pill.key,
        } as any);
      }
    });
    return mockData;
  }, [activeCountry?.name_fr, OFFICE_PILLS, format]);

  const landItems = useMemo<PropertyItem[]>(() => {
    const mockData: PropertyItem[] = [];
    LAND_PILLS.forEach((pill) => {
      for (let i = 0; i < 5; i++) {
        mockData.push({
          id: `land-${pill.key}-${i}`,
          title: `Terrain ${pill.label} ${i + 1}`,
          city: activeCountry?.name_fr ?? 'Ville',
          priceLabel: format(Math.floor(Math.random() * 1000000) + 300000, 'XOF'),
          cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
          badges: ['À VENDRE'],
          facts: ['500 m²'],
          rating: 4.2,
          isPremium: Math.random() > 0.7,
          subcategory: pill.key,
        } as any);
      }
    });
    return mockData;
  }, [activeCountry?.name_fr, LAND_PILLS, format]);

  const eventItems = useMemo<PropertyItem[]>(() => {
    const mockData: PropertyItem[] = [];
    EVENT_PILLS.forEach((pill) => {
      for (let i = 0; i < 5; i++) {
        mockData.push({
          id: `event-${pill.key}-${i}`,
          title: `${pill.label} ${i + 1}`,
          city: activeCountry?.name_fr ?? 'Ville',
          priceLabel: format(Math.floor(Math.random() * 400000) + 100000, 'XOF'),
          cover: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=800',
          badges: ['À LOUER'],
          facts: ['300 m²', '200 pers'],
          rating: 4.6,
          isPremium: Math.random() > 0.7,
          subcategory: pill.key,
        } as any);
      }
    });
    return mockData;
  }, [activeCountry?.name_fr, EVENT_PILLS, format]);

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top, backgroundColor:'#fff', borderBottomWidth:0.5, borderBottomColor:'#E5E7EB', zIndex: 10 }}>
        <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:16, position:'relative' }}>
          <Pressable onPress={() => router.push('/(tabs)/home')} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ textAlign:'center', fontSize:38, fontWeight:'900', color: '#0B1720', letterSpacing: 3, marginVertical: 8 }}>ZIMA</Text>
          </Pressable>
          <View style={{ position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' }}>
            <HeaderCountryButton />
          </View>
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
        <PropertyStripSection
          title="Résidentiel"
          pills={RES_PILLS}
          items={residentialItems}
          initialSubcatKey="maisons"
          onSeeAll={(activeSubcatKey) =>
            router.push({ pathname: '/property/index', params: { category: 'residential', sub: activeSubcatKey } } as any)
          }
          onOpenItem={(item) => router.push({ pathname: '/property/[id]', params: { id: item.id } } as any)}
        />

        <PropertyStripSection
          title="Commerces"
          pills={COM_PILLS}
          items={commerceItems}
          initialSubcatKey="boutiques"
          onSeeAll={(activeSubcatKey) =>
            router.push({ pathname: '/property/index', params: { category: 'commercial', sub: activeSubcatKey } } as any)
          }
          onOpenItem={(item) => router.push({ pathname: '/property/[id]', params: { id: item.id } } as any)}
        />

        <PropertyStripSection
          title="Bureaux"
          pills={OFFICE_PILLS}
          items={officeItems}
          initialSubcatKey="bureaux"
          onSeeAll={(activeSubcatKey) =>
            router.push({ pathname: '/property/index', params: { category: 'office', sub: activeSubcatKey } } as any)
          }
          onOpenItem={(item) => router.push({ pathname: '/property/[id]', params: { id: item.id } } as any)}
        />

        <PropertyStripSection
          title="Terrains"
          pills={LAND_PILLS}
          items={landItems}
          initialSubcatKey="residentiel"
          onSeeAll={(activeSubcatKey) =>
            router.push({ pathname: '/property/index', params: { category: 'land', sub: activeSubcatKey } } as any)
          }
          onOpenItem={(item) => router.push({ pathname: '/property/[id]', params: { id: item.id } } as any)}
        />

        <PropertyStripSection
          title="Espaces événementiels"
          pills={EVENT_PILLS}
          items={eventItems}
          initialSubcatKey="salles"
          onSeeAll={(activeSubcatKey) =>
            router.push({ pathname: '/property/index', params: { category: 'event', sub: activeSubcatKey } } as any)
          }
          onOpenItem={(item) => router.push({ pathname: '/property/[id]', params: { id: item.id } } as any)}
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
