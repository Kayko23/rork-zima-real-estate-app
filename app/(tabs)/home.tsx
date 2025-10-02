import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, useWindowDimensions, FlatList, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import SegmentedTabs from "@/components/home/SegmentedTabs";
import SectionHeader from "@/components/home/SectionHeader";
import PropertyCard, { type Property } from "@/components/property/PropertyCard";
import { colors, radius } from "@/theme/tokens";
import { useRouter } from "expo-router";

import { sortPremiumFirst } from "@/utils/sortProperties";

const W = Dimensions.get('window').width;

const premiumSeed: Property[] = sortPremiumFirst([
  { id:"p1", title:"Villa", city:"Accra", price:274500000, currency:"XOF", beds:4, baths:3, area:280, rating:4.8,
    photos:["https://images.unsplash.com/photo-1505691723518-36a5ac3b2d91?q=80&w=1400"], badge:'À VENDRE' as const, isPremium: true, createdAt: "2025-01-10T10:00:00Z" },
  { id:"p2", title:"Studio", city:"Lagos", price:35000000, currency:"XOF", beds:1, baths:1, area:40, rating:4.2,
    photos:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400"], badge:'À LOUER' as const, isPremium: false, createdAt: "2025-01-05T10:00:00Z" },
]);

const arrivalsSeed: Property[] = sortPremiumFirst([
  { id:"n1", title:"Appartement", city:"Lagos", price:732792, currency:"XOF", beds:2, baths:2, area:85, rating:4.6,
    photos:["https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1400"], badge:'À LOUER' as const, isPremium: false, createdAt: "2025-01-08T10:00:00Z" },
  { id:"n2", title:"Penthouse", city:"Abidjan", price:520000000, currency:"XOF", beds:3, baths:3, area:210, rating:4.7,
    photos:["https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400"], badge:'Premium' as const, isPremium: true, createdAt: "2025-01-12T10:00:00Z" },
]);

export default function Home() {
  const [tab,setTab] = React.useState<"props"|"pros"|"trips">("props");
  const [cat, setCat] = React.useState<string>("Résidentiel");
  const [loading, setLoading] = React.useState<boolean>(false);
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    const t = setTimeout(()=>setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const goPros = () => router.push("/(tabs)/professionals");
  const goTrips = () => router.push("/(tabs)/voyages");

  const all: Property[] = React.useMemo(() => sortPremiumFirst([...premiumSeed, ...arrivalsSeed]), []);
  const categories = React.useMemo(() => ["Résidentiel","Bureaux","Commerces","Terrains","Industriel","Luxe"], []);
  const filteredByCat = React.useMemo(() => all.filter(p => (p.title+" "+p.city).toLowerCase().includes(cat.toLowerCase())), [all, cat]);

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe,{ paddingTop: Math.max(top, 12)}]} testID="home-safe">
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottom + 100 }}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <Pressable onPress={() => router.push('/(tabs)/home')} style={{ alignSelf: 'center' }}>
          <Text style={styles.brand}>ZIMA</Text>
        </Pressable>

        <View style={{ paddingHorizontal:16 }}>
          <SegmentedTabs value={tab} onChange={(k)=>{
            setTab(k);
            if (k==="props") router.push("/(tabs)/properties");
            if (k==="pros") goPros();
            if (k==="trips") goTrips();
          }}/>
        </View>

        <SectionHeader title="Biens premium" onSeeAll={()=>router.push("/(tabs)/properties")} />
        <FlatList
          horizontal
          data={premiumSeed}
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
          testID="premium-slider"
        />

        <SectionHeader title="Par catégories" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal:12, gap:8 }}>
          {categories.map((c)=> (
            <Pressable key={c} onPress={()=>setCat(c)} style={({pressed})=>[styles.chip, cat===c && styles.chipA, pressed && { opacity:.85 }]} testID={`chip-${c}`}>
              <Text style={[styles.chipTx, cat===c && styles.chipTxA]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <FlatList
          horizontal
          data={filteredByCat}
          keyExtractor={(i)=>i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal:12 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({item}) => (
            <View style={{ width: Math.round(W*0.72) }}>
              <PropertyCard item={item}/>
            </View>
          )}
          ListFooterComponent={
            <Pressable onPress={()=>router.push({ pathname:'/(tabs)/properties', params:{ category: cat } } as any)} style={styles.more} testID="see-all-cat">
              <Text style={{ color: colors.primary, fontWeight: '700' }}>Voir tout {cat} ›</Text>
            </Pressable>
          }
          testID="categories-slider"
        />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{ flex:1, backgroundColor: colors.bg },
  brand:{ textAlign:"center", fontSize:32, fontWeight:"800", color: colors.text, letterSpacing: 3, marginVertical: 10 },
  ctaRow:{ paddingHorizontal:12, flexDirection:"row", gap:12, marginTop:24, marginBottom:16 },
  cta:{ flex:1, backgroundColor: colors.primary, paddingVertical:16, borderRadius: radius.lg, alignItems:"center" },
  ctaOutline:{ backgroundColor: colors.panel, borderWidth:1, borderColor: colors.primary },
  ctaIcon:{ color:"#fff", fontWeight:"900", fontSize:18, marginBottom:2 },
  ctaTxt:{ color:"#fff", fontWeight:"800", fontSize:16 },
  chip:{ paddingHorizontal:14, paddingVertical:8, borderRadius:999, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#E6EBF2' },
  chipA:{ backgroundColor:'#0F6B56', borderColor:'#0F6B56' },
  chipTx:{ color:'#6A7687', fontWeight:'700' },
  chipTxA:{ color:'#fff' },
  more:{ justifyContent:'center', paddingRight:12 },
});
