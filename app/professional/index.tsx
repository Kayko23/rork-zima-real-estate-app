import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSearchPreset } from '@/hooks/useSearchPreset';
import { X } from 'lucide-react-native';

import { useQuery } from '@tanstack/react-query';
import { providersApi, providerCategories } from '@/lib/api';
import ProFiltersSheet, { type ProFilters } from '@/components/filters/ProFiltersSheet';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import ZimaBrand from '@/components/ui/ZimaBrand';

const INITIAL: ProFilters = {
  country: undefined, city: undefined,
  category: undefined,
  ratingMin: undefined,
  services: [],
  budgetMin: undefined,
  budgetMax: undefined,
};

export default function ProfessionalScreen(){
  const insets = useSafeAreaInsets();
  const tabBarH = 56;
  const router = useRouter();
  const { preset, reset: resetPreset } = useSearchPreset();
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<ProFilters>(INITIAL);

  useEffect(() => {
    if (preset?.domain === 'pros' && preset.premium) {
      const newFilters: ProFilters = { ...INITIAL };
      setFilters(newFilters);
    }
  }, [preset]);

  const { data = [], isLoading } = useQuery({
    queryKey: ['providers', filters],
    queryFn: () => providersApi.list({
      country: filters.country,
      city: filters.city,
      category: filters.category,
      ratingMin: filters.ratingMin,
    }),
  });

  const resultCount = data.length;

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      <View style={{ paddingTop: insets.top, backgroundColor:'#fff', borderBottomWidth:0.5, borderBottomColor:'#E5E7EB', position: 'relative', zIndex: 10 }}>
        <ZimaBrand />
        
        <View style={{ paddingHorizontal:16, paddingTop:16, paddingBottom:12 }}>
          <SegmentedTabs 
            value="pros" 
            onChange={(k)=>{
              if (k==='props') router.push('/(tabs)/properties');
              else if (k==='trips') router.push('/(tabs)/voyages');
            }} 
          />
        </View>

        <View style={{ paddingHorizontal:16, paddingBottom:16 }}>
          {preset?.domain === 'pros' && (
            <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:12 }}>
              {preset.premium && (
                <View style={{ backgroundColor:'#0B6B53', paddingHorizontal:12, paddingVertical:6, borderRadius:999, flexDirection:'row', alignItems:'center', gap:6 }}>
                  <Text style={{ color:'#fff', fontWeight:'700', fontSize:12 }}>Premium</Text>
                </View>
              )}
              <Pressable onPress={resetPreset} style={{ backgroundColor:'#F3F4F6', paddingHorizontal:12, paddingVertical:6, borderRadius:999, flexDirection:'row', alignItems:'center', gap:4 }}>
                <X size={14} color="#6B7280" strokeWidth={2.5} />
                <Text style={{ color:'#6B7280', fontWeight:'700', fontSize:12 }}>Réinitialiser</Text>
              </Pressable>
            </View>
          )}
          <Pressable onPress={()=>setOpen(true)} style={{ height:48, borderRadius:12, borderWidth:1, borderColor:'#E5E7EB', justifyContent:'center', paddingHorizontal:14 }}>
            <Text style={{ fontWeight:'700' }}>
              {filters.country ?? 'Pays'}, {filters.city ?? 'Ville'} • {filters.category ?? 'Catégorie'} • {filters.ratingMin ? `${filters.ratingMin}+ ★` : 'Toutes notes'}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={providerCategories as readonly string[]}
        keyExtractor={(k)=>k}
        contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 16 }}
        renderItem={({ item: cat }) => {
          const items = (data as any[]).filter((p)=>p.category===cat);
          if (!items.length) return null as any;
          return (
            <View style={{ marginBottom: 18 }}>
              <Text style={{ fontWeight:'800', fontSize:16, marginLeft:16, marginBottom:8 }}>{cat}</Text>
              <FlatList
                horizontal
                data={items}
                keyExtractor={(p:any)=>p.id}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                ItemSeparatorComponent={()=><View style={{ width:12 }}/>} 
                renderItem={({item})=> (
                  <View style={{ width:260, borderWidth:1, borderColor:'#E5E7EB', borderRadius:16, padding:14 }}>
                    <Text style={{ fontWeight:'800' }}>{item.name}</Text>
                    <Text style={{ color:'#6B7280', marginTop:2 }}>{item.city}, {item.country}</Text>
                    <Text style={{ marginTop:6 }}>★ {item.rating}</Text>
                    <View style={{ flexDirection:'row', flexWrap:'wrap', gap:6, marginTop:8 }}>
                      {item.services.map((s:string)=>(<Tag key={s} label={s}/>))}
                    </View>
                    <Pressable 
                      style={{ marginTop:10, backgroundColor:'#0B6B53', borderRadius:10, paddingVertical:10, alignItems:'center' }}
                      onPress={()=> router.push(`/professional/${item.id}`)}
                    >
                      <Text style={{ color:'#fff', fontWeight:'700' }}>Voir profil</Text>
                    </Pressable>
                  </View>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          );
        }}
        ListEmptyComponent={!isLoading ? <Text style={{ color:'#64748B', paddingHorizontal:16 }}>Aucun prestataire.</Text> : null}
      />

      <ProFiltersSheet
        visible={open}
        initial={filters}
        resultCount={resultCount}
        onClose={()=>setOpen(false)}
        onApply={(f)=>{ setFilters(f); setOpen(false); }}
        presetKey="zima/pro/lastFilters"
      />
    </View>
  );
}

function Tag({ label }:{label:string}){ return (
  <View style={{ borderWidth:1, borderColor:'#DADADA', borderRadius:999, paddingHorizontal:10, paddingVertical:6 }}>
    <Text style={{ fontSize:12 }}>{label}</Text>
  </View>
); }
