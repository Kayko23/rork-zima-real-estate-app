import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, FlatList, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SegmentedTabs from "@/components/home/SegmentedTabs";
import SectionHeader from "@/components/home/SectionHeader";
import PropertyCard, { type Property } from "@/components/property/PropertyCard";
import ResidentialChips from "@/components/home/ResidentialChips";
import { colors, radius } from "@/theme/tokens";
import { useRouter } from "expo-router";

import { sortPremiumFirst } from "@/utils/sortProperties";

const W = Dimensions.get('window').width;

const premiumProperties: Property[] = sortPremiumFirst([
  { id:"p1", title:"Villa", city:"Accra", price:274500000, currency:"XOF", beds:4, baths:3, area:280, rating:4.8,
    photos:["https://images.unsplash.com/photo-1505691723518-36a5ac3b2d91?q=80&w=1400"], badge:'À VENDRE' as const, isPremium: true, createdAt: "2025-01-10T10:00:00Z" },
  { id:"p2", title:"Penthouse", city:"Abidjan", price:520000000, currency:"XOF", beds:3, baths:3, area:210, rating:4.7,
    photos:["https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400"], badge:'Premium' as const, isPremium: true, createdAt: "2025-01-12T10:00:00Z" },
]);

const premiumTrips: Property[] = [
  { id:"t1", title:"Hôtel Ivoire", city:"Abidjan", price:85000, currency:"XOF", beds:2, baths:1, area:45, rating:4.9,
    photos:["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400"], badge:'Premium' as const, isPremium: true, createdAt: "2025-01-10T10:00:00Z" },
  { id:"t2", title:"Resort Baobab", city:"Dakar", price:120000, currency:"XOF", beds:1, baths:1, area:35, rating:4.7,
    photos:["https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1400"], badge:'Premium' as const, isPremium: true, createdAt: "2025-01-11T10:00:00Z" },
];

const premiumPros: Property[] = [
  { id:"pr1", title:"Architecte Kofi", city:"Accra", price:0, currency:"XOF", rating:4.9,
    photos:["https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1400"], badge:'Premium' as const, isPremium: true, createdAt: "2025-01-10T10:00:00Z" },
  { id:"pr2", title:"Agent Amina", city:"Lagos", price:0, currency:"XOF", rating:4.8,
    photos:["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1400"], badge:'Premium' as const, isPremium: true, createdAt: "2025-01-11T10:00:00Z" },
];

const categoriesData: { key: string; title: string; items: Property[] }[] = [
  { key: "residentiel", title: "Résidentiel", items: [
    { id:"r1", title:"Appartement", city:"Lagos", price:732792, currency:"XOF", beds:2, baths:2, area:85, rating:4.6,
      photos:["https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1400"], badge:'À LOUER', isPremium: false, createdAt: "2025-01-08T10:00:00Z" },
    { id:"r2", title:"Studio", city:"Lagos", price:35000000, currency:"XOF", beds:1, baths:1, area:40, rating:4.2,
      photos:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400"], badge:'À LOUER', isPremium: false, createdAt: "2025-01-05T10:00:00Z" },
  ]},
  { key: "hotel", title: "Hôtel", items: [
    { id:"h1", title:"Hôtel Ivoire", city:"Abidjan", price:85000, currency:"XOF", beds:2, baths:1, area:45, rating:4.9,
      photos:["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400"], badge:'À LOUER', isPremium: false, createdAt: "2025-01-09T10:00:00Z" },
    { id:"h2", title:"Hôtel Azalaï", city:"Dakar", price:95000, currency:"XOF", beds:1, baths:1, area:35, rating:4.7,
      photos:["https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1400"], badge:'À LOUER', isPremium: false, createdAt: "2025-01-08T10:00:00Z" },
  ]},
  { key: "residence-journaliere", title: "Résidence journalière", items: [
    { id:"rj1", title:"Résidence Plateau", city:"Abidjan", price:45000, currency:"XOF", beds:1, baths:1, area:30, rating:4.5,
      photos:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400"], badge:'À LOUER', isPremium: false, createdAt: "2025-01-07T10:00:00Z" },
    { id:"rj2", title:"Studio Cocody", city:"Abidjan", price:35000, currency:"XOF", beds:1, baths:1, area:25, rating:4.3,
      photos:["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1400"], badge:'À LOUER', isPremium: false, createdAt: "2025-01-06T10:00:00Z" },
  ]},
  { key: "espaces-evenementiels", title: "Espaces événementiels", items: [
    { id:"ev1", title:"Salle de réception", city:"Abidjan", price:250000, currency:"XOF", beds:0, baths:2, area:200, rating:4.6,
      photos:["https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?q=80&w=1400"], badge:'À LOUER', isPremium: false, createdAt: "2025-01-08T10:00:00Z" },
    { id:"ev2", title:"Centre de conférence", city:"Dakar", price:350000, currency:"XOF", beds:0, baths:3, area:300, rating:4.7,
      photos:["https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1400"], badge:'À LOUER', isPremium: false, createdAt: "2025-01-07T10:00:00Z" },
  ]},
  { key: "terrains", title: "Terrains", items: [
    { id:"te1", title:"Terrain constructible", city:"Accra", price:180000000, currency:"XOF", beds:0, baths:0, area:500, rating:4.4,
      photos:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1400"], badge:'À VENDRE', isPremium: false, createdAt: "2025-01-06T10:00:00Z" },
  ]},
  { key: "commerces", title: "Commerces", items: [
    { id:"c1", title:"Boutique centre-ville", city:"Dakar", price:95000000, currency:"XOF", beds:0, baths:0, area:80, rating:4.3,
      photos:["https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400"], badge:'À VENDRE', isPremium: false, createdAt: "2025-01-07T10:00:00Z" },
  ]},
  { key: "bureaux", title: "Bureaux", items: [
    { id:"b1", title:"Bureau moderne", city:"Abidjan", price:150000000, currency:"XOF", beds:0, baths:0, area:120, rating:4.5,
      photos:["https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400"], badge:'À LOUER', isPremium: false, createdAt: "2025-01-09T10:00:00Z" },
  ]},
];

export default function Home() {
  const [tab,setTab] = React.useState<"props"|"pros"|"trips">("props");
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();

  const goPros = () => router.push("/(tabs)/professionals");
  const goTrips = () => router.push("/(tabs)/voyages");

  return (
    <View style={styles.container}>
      <View style={[styles.stickyHeader, { paddingTop: top, position: 'relative', zIndex: 10 }]}>
        <Pressable onPress={() => router.push('/(tabs)/home')} style={{ alignSelf: 'center' }}>
          <Text style={styles.brand}>ZIMA</Text>
        </Pressable>

        <View style={{ paddingHorizontal:16, paddingBottom:12 }}>
          <SegmentedTabs value={tab} onChange={(k)=>{
            setTab(k);
            if (k==="props") router.push("/(tabs)/properties");
            if (k==="pros") goPros();
            if (k==="trips") goTrips();
          }}/>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottom + 100 }}
        showsVerticalScrollIndicator={false}
        bounces
      >

        <SectionHeader title="Propriétés premium" onSeeAll={()=>router.push("/(tabs)/properties?premium=true")} />
        <FlatList
          horizontal
          data={premiumProperties}
          keyExtractor={(i)=>i.id}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={Math.round(W*0.86)}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 12 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({item}) => (
            <View style={{ width: Math.round(W*0.86) }}>
              <PropertyCard item={item}/>
            </View>
          )}
          testID="premium-properties-slider"
        />

        <SectionHeader title="Voyages premium" onSeeAll={()=>router.push("/(tabs)/voyages?premium=true")} />
        <FlatList
          horizontal
          data={premiumTrips}
          keyExtractor={(i)=>i.id}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={Math.round(W*0.86)}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 12 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({item}) => (
            <View style={{ width: Math.round(W*0.86) }}>
              <PropertyCard item={item}/>
            </View>
          )}
          testID="premium-trips-slider"
        />

        <SectionHeader title="Professionnels premium" onSeeAll={()=>router.push("/(tabs)/professionals?premium=true")} />
        <FlatList
          horizontal
          data={premiumPros}
          keyExtractor={(i)=>i.id}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={Math.round(W*0.86)}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 12 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({item}) => (
            <View style={{ width: Math.round(W*0.86) }}>
              <PropertyCard item={item}/>
            </View>
          )}
          testID="premium-pros-slider"
        />

        <SectionHeader title="Par catégories" />
        {categoriesData.map((category) => (
          <View key={category.key} style={{ marginBottom: 16 }}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Pressable 
                onPress={()=>router.push({ pathname:'/(tabs)/properties', params:{ category: category.key } } as any)} 
                style={({pressed})=>[styles.categoryLink, pressed && { opacity:.7 }]}
                testID={`see-all-${category.key}`}
              >
                <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>Voir tout ›</Text>
              </Pressable>
            </View>
            {category.key === 'residentiel' && (
              <View style={{ marginBottom: 12 }}>
                <ResidentialChips />
              </View>
            )}
            <FlatList
              horizontal
              data={category.items}
              keyExtractor={(i)=>i.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal:12 }}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={({item}) => (
                <View style={{ width: Math.round(W*0.72) }}>
                  <PropertyCard item={item}/>
                </View>
              )}
              testID={`category-${category.key}-slider`}
            />
          </View>
        ))}

        <View style={styles.ctaRow}>
          <Pressable
            onPress={()=>router.push("/property/new")}
            android_ripple={{ color: colors.primarySoft }}
            style={({pressed})=>[styles.cta, pressed && { transform:[{scale:.98}] }]}
            testID="cta-publish"
          >
            <Text style={styles.ctaIcon}>＋</Text>
            <Text style={styles.ctaTxt}>Publier un bien</Text>
          </Pressable>

          <Pressable
            onPress={goPros}
            android_ripple={{ color: colors.primarySoft }}
            style={({pressed})=>[styles.cta, styles.ctaOutline, pressed && { opacity:.85 }]}
            testID="cta-find-pro"
          >
            <Text style={[styles.ctaTxt, { color: colors.primary }]}>Trouver un pro</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  stickyHeader: { backgroundColor: colors.bg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  brand:{ textAlign:"center", fontSize:32, fontWeight:"800", color: colors.text, letterSpacing: 3, marginVertical: 10 },
  ctaRow:{ paddingHorizontal:12, flexDirection:"row", gap:12, marginTop:24, marginBottom:16 },
  cta:{ flex:1, backgroundColor: colors.primary, paddingVertical:16, borderRadius: radius.lg, alignItems:"center" },
  ctaOutline:{ backgroundColor: colors.panel, borderWidth:1, borderColor: colors.primary },
  ctaIcon:{ color:"#fff", fontWeight:"900", fontSize:18, marginBottom:2 },
  ctaTxt:{ color:"#fff", fontWeight:"800", fontSize:16 },
  categoryHeader:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:12, marginTop:12, marginBottom:8 },
  categoryTitle:{ fontSize:20, fontWeight:"700", color:"#0b1720" },
  categoryLink:{ padding:6, borderRadius:10 },
});
