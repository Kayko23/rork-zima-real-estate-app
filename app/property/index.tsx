import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSearchPreset } from '@/hooks/useSearchPreset';
import { X } from 'lucide-react-native';
import { CATEGORIES, CategorySlug } from '@/types/taxonomy';
import { openCategory } from '@/lib/navigation';

import { useQuery } from '@tanstack/react-query';
import { sortPremiumFirst } from '@/utils/sortProperties';
import { api } from '@/lib/api';
import PropertyFiltersSheet, { type PropertyFilters } from '@/components/filters/PropertyFiltersSheet';
import { useSettings } from '@/hooks/useSettings';
import { useMoney } from '@/lib/money';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import ZimaBrand from '@/components/ui/ZimaBrand';

const INITIAL: PropertyFilters = {
  country: undefined, city: undefined,
  trade: undefined, period: undefined,
  category: undefined,
  rooms: undefined, baths: undefined, surfaceMin: undefined,
  priceMin: undefined, priceMax: undefined,
  sort: 'recent',
};

export default function PropertyScreen(){
  const insets = useSafeAreaInsets();
  const tabBarH = 56;
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { currency } = useSettings();
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
      if (preset.premium) {
        newFilters.sort = 'recent';
      }
      setFilters(newFilters);
    }
  }, [preset]);

  const { data = [], isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => api.listProperties({
      country: filters.country,
      city: filters.city,
      type: filters.trade === 'sale' ? 'sale' : (filters.trade==='rent' ? 'rent' : undefined),
      period: filters.period,
      category: filters.category,
      rooms: filters.rooms,
      baths: filters.baths,
      surfaceMin: filters.surfaceMin,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      sort: filters.sort,
    }),
    select: (items) => sortPremiumFirst(items as any[])
  });

  const resultCount = data.length;

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top, backgroundColor:'#fff', borderBottomWidth:0.5, borderBottomColor:'#E5E7EB', zIndex: 10 }}>
        <ZimaBrand />
        
        <View style={{ paddingHorizontal:16, paddingTop:16, paddingBottom:12 }}>
          <SegmentedTabs 
            value="props" 
            onChange={(k)=>{
              if (k==='pros') router.push('/(tabs)/professionals');
              else if (k==='trips') router.push('/(tabs)/voyages');
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
              {filters.country ?? 'Pays'}, {filters.city ?? 'Ville'} • {filters.category ?? 'Catégorie'} {filters.trade ? `• ${filters.trade==='sale'?'Vente':'Location'}` : ''}
            </Text>
            <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 13, fontWeight: '600' }}>
              Budget {fmt(filters.priceMin)} – {fmt(filters.priceMax)}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(i:any)=>String(i.id)}
        contentContainerStyle={{ paddingTop: insets.top + 200, paddingHorizontal:16, paddingBottom: insets.bottom + tabBarH + 16 }}
        ListEmptyComponent={!isLoading ? <Text style={{ color:'#64748B' }}>Aucun résultat.</Text> : null}
        renderItem={({item})=>(
          <View style={{ borderWidth:1, borderColor:'#E5E7EB', borderRadius:16, overflow:'hidden', marginBottom:12 }}>
            <View style={{ padding:14 }}>
              <Text style={{ fontWeight:'800' }}>{item.title ?? 'Annonce'}</Text>
              <Text style={{ color:'#6B7280', marginTop:2 }}>{item.city}, {item.country}</Text>
              <Text style={{ marginTop:8, fontWeight:'700' }}>{format(item.price, currency)}{item.period==='daily'?' / jour': item.period==='monthly'?' / mois':''}</Text>
            </View>
          </View>
        )}
        scrollIndicatorInsets={{ bottom: insets.bottom + tabBarH }}
      />

      <PropertyFiltersSheet
        visible={open}
        initial={filters}
        resultCount={resultCount}
        onClose={()=>setOpen(false)}
        onApply={(f)=>{ setFilters(f); setOpen(false); }}
        presetKey="zima/property/lastFilters"
      />
    </View>
  );
}

const fmt = (n?: number) => n!=null ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits:0 }).format(n) : '—';
