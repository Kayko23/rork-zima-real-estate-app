import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import SegmentedTabs from "@/components/home/SegmentedTabs";
import SectionHeader from "@/components/home/SectionHeader";
import PropertyCard, { type Property } from "@/components/property/PropertyCard";
import { colors, radius } from "@/theme/tokens";
import { useRouter } from "expo-router";

const premium: Property[] = [
  { id:"p1", title:"Villa", city:"Accra", price:274500000, currency:"XOF", beds:4, baths:3, area:280, rating:4.8,
    photos:["https://images.unsplash.com/photo-1505691723518-36a5ac3b2d91?q=80&w=1400"], badge:"À VENDRE" },
];

export default function Home() {
  const [tab,setTab] = React.useState<"props"|"pros"|"trips">("props");
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();

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
