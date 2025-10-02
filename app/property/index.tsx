import React, { useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

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
  const { currency } = useSettings();
  const { format } = useMoney();
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<PropertyFilters>(INITIAL);

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
      <View style={{ paddingTop: insets.top, backgroundColor:'#fff', borderBottomWidth:0.5, borderBottomColor:'#E5E7EB', position: 'relative', zIndex: 10 }}>
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
          <Pressable onPress={()=>setOpen(true)} style={{ height:48, borderRadius:12, borderWidth:1, borderColor:'#E5E7EB', justifyContent:'center', paddingHorizontal:14 }}>
            <Text style={{ fontWeight:'700' }}>
              {filters.country ?? 'Pays'}, {filters.city ?? 'Ville'} • {filters.category ?? 'Catégorie'} {filters.trade ? `• ${filters.trade==='sale'?'Vente':'Location'}` : ''}
            </Text>
            <Text style={{ color:'#6B7280', marginTop:2 }}>
              Budget {fmt(filters.priceMin)} – {fmt(filters.priceMax)}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(i:any)=>String(i.id)}
        contentContainerStyle={{ paddingHorizontal:16, paddingBottom: insets.bottom + tabBarH + 16 }}
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
