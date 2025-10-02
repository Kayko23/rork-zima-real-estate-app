import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import SegmentedTabs from "@/components/home/SegmentedTabs";
import SectionHeader from "@/components/home/SectionHeader";
import PropertyCard, { type Property } from "@/components/property/PropertyCard";
import NewArrivals from "@/components/home/NewArrivals";
import { colors, radius } from "@/theme/tokens";
import { useRouter } from "expo-router";

import { sortPremiumFirst } from "@/utils/sortProperties";

const premium: Property[] = sortPremiumFirst([
  { id:"p1", title:"Villa", city:"Accra", price:274500000, currency:"XOF", beds:4, baths:3, area:280, rating:4.8,
    photos:["https://images.unsplash.com/photo-1505691723518-36a5ac3b2d91?q=80&w=1400"], badge:'À VENDRE' as const, isPremium: true, createdAt: "2025-01-10T10:00:00Z" },
  { id:"p2", title:"Studio", city:"Lagos", price:35000000, currency:"XOF", beds:1, baths:1, area:40, rating:4.2,
    photos:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400"], badge:'À LOUER' as const, isPremium: false, createdAt: "2025-01-05T10:00:00Z" },
]);

const arrivals: Property[] = sortPremiumFirst([
  { id:"n1", title:"Appartement", city:"Lagos", price:732792, currency:"XOF", beds:2, baths:2, area:85, rating:4.6,
    photos:["https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1400"], badge:'À LOUER' as const, isPremium: false, createdAt: "2025-01-08T10:00:00Z" },
  { id:"n2", title:"Penthouse", city:"Abidjan", price:520000000, currency:"XOF", beds:3, baths:3, area:210, rating:4.7,
    photos:["https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400"], badge:'Premium' as const, isPremium: true, createdAt: "2025-01-12T10:00:00Z" },
]);

export default function Home() {
  const [tab,setTab] = React.useState<"props"|"pros"|"trips">("props");
  const [loadingNew, setLoadingNew] = React.useState<boolean>(true);
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    const t = setTimeout(()=>setLoadingNew(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const goPros = () => router.push("/professionals");
  const goTrips = () => router.push("/voyages");

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe,{ paddingTop: Math.max(top, 12)}]} testID="home-safe">
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottom + 28 }}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <Text style={styles.brand}>ZIMA</Text>

        <View style={{ paddingHorizontal:16 }}>
          <SegmentedTabs value={tab} onChange={(k)=>{
            setTab(k);
            if (k==="pros") goPros();
            if (k==="trips") goTrips();
          }}/>
        </View>

        <SectionHeader title="Biens premium" onSeeAll={()=>router.push("/property")} />
        <View style={{ paddingHorizontal:12 }}>
          {premium.map(p => (
            <View key={p.id} style={{ marginBottom:16 }}>
              <PropertyCard item={p}/>
            </View>
          ))}
        </View>

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

        <NewArrivals data={arrivals} loading={loadingNew} />

        <SectionHeader title="Par catégories" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal:12, gap:12 }}
        >
          {["Résidentiel","Commercial","Terrains","Luxe & Collection"].map((c)=> (
            <Pressable
              key={c}
              onPress={()=>router.push({ pathname:"/categories", params:{ type:c } } as any)}
              style={({pressed})=>[
                styles.catCard,
                { width: width*0.75 },
                pressed && { transform:[{scale:.99}] }
              ]}
              testID={`cat-${c}`}
            >
              <Text style={styles.catTxt}>{c}</Text>
              <Text style={styles.catSub}>Voir tout ›</Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{ flex:1, backgroundColor: colors.bg },
  brand:{ textAlign:"center", fontSize:32, fontWeight:"800", color: colors.text, letterSpacing: 3, marginVertical: 10 },
  ctaRow:{ paddingHorizontal:12, flexDirection:"row", gap:12, marginTop:10 },
  cta:{ flex:1, backgroundColor: colors.primary, paddingVertical:16, borderRadius: radius.lg, alignItems:"center" },
  ctaOutline:{ backgroundColor: colors.panel, borderWidth:1, borderColor: colors.primary },
  ctaIcon:{ color:"#fff", fontWeight:"900", fontSize:18, marginBottom:2 },
  ctaTxt:{ color:"#fff", fontWeight:"800", fontSize:16 },
  catCard:{ backgroundColor: colors.panel, borderRadius: radius.lg, padding:16, justifyContent:"center" },
  catTxt:{ fontSize:18, fontWeight:"800", color: colors.text, marginBottom:6 },
  catSub:{ color: colors.primary, fontWeight:"700" }
});
