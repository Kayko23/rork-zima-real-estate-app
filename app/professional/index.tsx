import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, Pressable, Linking, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSearchPreset } from '@/hooks/useSearchPreset';
import { X } from 'lucide-react-native';

import { useQuery } from '@tanstack/react-query';
import { providersApi } from '@/lib/api';
import ProFiltersSheet, { type ProFilters } from '@/components/filters/ProFiltersSheet';
import SegmentedTabs from '@/components/home/SegmentedTabs';
import ZimaBrand from '@/components/ui/ZimaBrand';
import ProfessionalCard from '@/components/professionals/ProfessionalCard';

const INITIAL: ProFilters = {
  country: undefined, city: undefined,
  category: undefined,
  ratingMin: undefined,
  services: [],
  budgetMin: undefined,
  budgetMax: undefined,
};

const CATEGORY_LABEL: Record<string, string> = {
  agent: "Agents immobiliers",
  property_manager: "Gestionnaires de biens",
  agency: "Agences immobilières",
  hotel_booking: "Réservation – Hôtels",
  short_stay: "Réservation – Séjours à la nuit",
  event_space: "Gestion d'espaces évènementiels",
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

  const byCategory = useMemo(() => {
    const map = new Map<string, any[]>();
    data.forEach((p: any) => {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    });
    return Array.from(map.entries());
  }, [data]);

  const resultCount = data.length;

  const mailto = (email?: string) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`);
  };

  const tel = (phone?: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const whatsapp = async (msisdn?: string) => {
    if (!msisdn) return;
    const text = "Bonjour 👋";
    const deep = `whatsapp://send?phone=${msisdn}&text=${encodeURIComponent(text)}`;
    const web = `https://wa.me/${msisdn}?text=${encodeURIComponent(text)}`;
    const can = await Linking.canOpenURL("whatsapp://send");
    Linking.openURL(can ? deep : web);
  };

  const openProfile = (id: string) => {
    router.push(`/professional/${id}`);
  };

  const goSeeAll = (category: string) => {
    router.push({ pathname: "/professional", params: { category } });
  };

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

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + tabBarH + 16 }}>
        {byCategory.map(([cat, items]) => (
          <View key={cat} style={{ marginBottom: 20 }}>
            <View style={{ paddingHorizontal: 4, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#13251C' }}>{CATEGORY_LABEL[cat] || cat}</Text>
              <Pressable onPress={() => goSeeAll(cat)}>
                <Text style={{ color: '#0E4D3A', fontWeight: '800' }}>Voir tout ›</Text>
              </Pressable>
            </View>

            <FlatList
              data={items}
              keyExtractor={(i: any) => i.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              renderItem={({ item }) => (
                <ProfessionalCard
                  item={item}
                  onPressProfile={openProfile}
                  onPressMail={mailto}
                  onPressCall={tel}
                  onPressWhatsApp={whatsapp}
                />
              )}
            />
          </View>
        ))}

        {!isLoading && data.length === 0 && (
          <Text style={{ color:'#64748B', textAlign: 'center', marginTop: 24 }}>Aucun prestataire.</Text>
        )}
      </ScrollView>

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
