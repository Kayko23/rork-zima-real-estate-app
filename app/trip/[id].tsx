import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Share2, Heart, ArrowLeft } from "lucide-react-native";
import Gallery from "@/components/voyages/Gallery";
import BookingBar from "@/components/voyages/BookingBar";
import BookingSheet from "@/components/voyages/BookingSheet";
import { useTripDetails } from "@/hooks/useTripDetails";
import SkeletonLine from "@/components/ui/SkeletonLine";
const Blur: any = Platform.OS === 'web' ? View : (require('expo-blur').BlurView);

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, similar } = useTripDetails(id);
  const insets = useSafeAreaInsets();

  const [openBook, setOpenBook] = React.useState(false);

  return (
    <View style={[s.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <Blur intensity={24} tint="light" style={s.topbar}>
        <TouchableOpacity style={s.iconBtn} onPress={()=>router.back()}><ArrowLeft size={20}/></TouchableOpacity>
        <View style={{flexDirection:"row", gap:8}}>
          <TouchableOpacity style={s.iconBtn}><Share2 size={18}/></TouchableOpacity>
          <TouchableOpacity style={s.iconBtn}><Heart size={18}/></TouchableOpacity>
        </View>
      </Blur>

      {loading || !data ? (
        <ScrollView contentContainerStyle={{padding:16}}>
          <SkeletonLine height={220} radius={18}/>
          <View style={{height:16}}/>
          <SkeletonLine height={24} width={240}/>
          <View style={{height:16}}/>
          <SkeletonLine height={14} width={160}/>
          <View style={{height:12}}/>
          <SkeletonLine height={14} width={120}/>
          <View style={{height:18}}/>
          <SkeletonLine height={120} radius={12}/>
        </ScrollView>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
            <Gallery photos={data.photos} countBadge />

            <View style={s.header}>
              <Text style={s.title}>{data.title}</Text>
              <View style={s.row}>
                <Text style={s.chip}>{data.type === "hotel" ? "hôtel" : "résidence"}</Text>
                <Text style={s.chip}>{data.rooms} pièces</Text>
                <Text style={s.chip}>{data.baths} SDB</Text>
                {!!data.area && <Text style={s.chip}>{data.area} m²</Text>}
              </View>
              <Text style={s.link} onPress={()=>{ }}>
                {data.city}, {data.country} • {data.address}
              </Text>
              <Text style={s.rating}>★ {data.rating} · {data.reviews} avis</Text>
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>Description</Text>
              <Text style={s.text}>{data.description}</Text>
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>Faites connaissance avec votre conseiller</Text>
              <View style={s.hostRow}>
                <View style={s.avatar} />
                <View style={{flex:1}}>
                  <Text style={s.hostName}>{data.host.name} {data.host.verified ? "✅" : ""}</Text>
                  <View style={s.metaRow}>
                    <Text style={s.meta}>★ {data.host.reviews} évaluations</Text>
                    <Text style={s.dot}>•</Text>
                    <Text style={s.meta}>{data.host.years} ans d’activité</Text>
                  </View>
                </View>
              </View>
              <View style={{flexDirection:"row", gap:10, marginTop:10}}>
                <TouchableOpacity style={s.btnGhost} onPress={()=>router.push(`/provider/${data.host.id}`)}>
                  <Text style={s.btnGhostTxt}>Voir le profil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btn} onPress={()=>router.push(`/provider/${data.host.id}`)}>
                  <Text style={s.btnTxt}>Tous ses biens</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>Équipements</Text>
              <View style={s.tags}>
                {data.amenities.map((a: string)=> (
                  <Text key={a} style={s.tag}>{
                    a==="wifi"?"Wifi gratuit":
                    a==="piscine"?"Piscine":
                    a==="parking"?"Parking gratuit":
                    a==="clim"?"Climatisation":
                    a==="cuisine"?"Cuisine équipée":
                    "Sécurité 24h"
                  }</Text>
                ))}
              </View>
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>Où se situe le bien</Text>
              <View style={s.mapMock}><Text style={{color:"#5A6", fontWeight:"800"}}>Carte interactive</Text></View>
              <View style={{flexDirection:"row", gap:10, marginTop:10}}>
                <TouchableOpacity style={s.btnGhost} onPress={()=>{
                  const url = Platform.select({
                    ios:`http://maps.apple.com/?daddr=${data.lat},${data.lng}`,
                    android:`google.navigation:q=${data.lat},${data.lng}`
                  });
                  if (url) Linking.openURL(url);
                }}>
                  <Text style={s.btnGhostTxt}>Itinéraire</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btn} onPress={()=>{
                  const url = Platform.select({
                    ios:`http://maps.apple.com/?ll=${data.lat},${data.lng}`,
                    android:`geo:${data.lat},${data.lng}`
                  });
                  if (url) Linking.openURL(url);
                }}>
                  <Text style={s.btnTxt}>Voir dans Maps</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>Avis</Text>
              <View style={s.review}>
                <View style={s.avatarSm}/>
                <View style={{flex:1}}>
                  <Text style={s.reviewName}>Moussa Ba  ★★★★★</Text>
                  <Text style={s.text}>Excellent appartement, très bien situé et l’agent très professionnel.</Text>
                </View>
              </View>
              <Text style={s.link} onPress={()=>router.push(`/trip/${id}/reviews`)}>Tous les avis</Text>
            </View>

            {!!similar.length && (
              <View style={{marginTop:12}}>
              </View>
            )}
          </ScrollView>

          <BookingBar
            price={data.price}
            onContact={() => setOpenBook(true)}
            onWhatsApp={() => Linking.openURL("https://wa.me/2348000000000")}
            onCall={() => Linking.openURL("tel:+221700000000")}
          />

          <BookingSheet
            visible={openBook}
            onClose={()=>setOpenBook(false)}
            onRequest={(payload: { start: string; end: string; guests: number })=>{ console.log('booking request', payload); setOpenBook(false); }}
            nightlyPrice={data.price}
          />
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen:{ flex:1, backgroundColor:"#F7FAF9" },
  topbar:{ position:"absolute", top:12, left:12, right:12, zIndex:10, borderRadius:999, padding:8, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  iconBtn:{ backgroundColor:"rgba(255,255,255,.9)", borderRadius:999, padding:8 },
  header:{ paddingHorizontal:16, paddingTop:12 },
  title:{ fontSize:20, fontWeight:"900", color:"#0B3B36" },
  row:{ flexDirection:"row", flexWrap:"wrap", gap:8, marginTop:8 },
  chip:{ backgroundColor:"#EAF3F1", paddingHorizontal:10, paddingVertical:6, borderRadius:999, color:"#0B3B36", fontWeight:"700" },
  link:{ marginTop:8, color:"#134E48", fontWeight:"800" },
  rating:{ marginTop:2, color:"#0B3B36", fontWeight:"800" },

  card:{ backgroundColor:"#fff", borderRadius:16, marginHorizontal:16, marginTop:14, padding:14, borderWidth:1, borderColor:"#E6EFEC" },
  cardTitle:{ fontWeight:"900", color:"#0B3B36", marginBottom:8 },
  text:{ color:"#3F5753" },

  hostRow:{ flexDirection:"row", alignItems:"center", gap:12, marginTop:4 },
  avatar:{ width:52, height:52, borderRadius:26, backgroundColor:"#DDE7E4" },
  avatarSm:{ width:38, height:38, borderRadius:19, backgroundColor:"#DDE7E4", marginRight:8 },
  hostName:{ fontWeight:"900", color:"#0B3B36" },
  metaRow:{ flexDirection:"row", gap:6, marginTop:2, alignItems:"center" },
  meta:{ color:"#4B635F", fontWeight:"700" },
  dot:{ color:"#9BB", fontWeight:"900" },

  tags:{ flexDirection:"row", flexWrap:"wrap", gap:8 },
  tag:{ backgroundColor:"#F1F6F5", borderRadius:999, paddingHorizontal:12, paddingVertical:8, color:"#0B3B36", fontWeight:"700" },

  mapMock:{ height:160, borderRadius:14, backgroundColor:"#ECF5F3", alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:"#E6EFEC" },

  review:{ flexDirection:"row", gap:10, alignItems:"flex-start" },
  reviewName:{ fontWeight:"900", color:"#0B3B36", marginBottom:4 },

  btn:{ backgroundColor:"#134E48", paddingVertical:10, paddingHorizontal:14, borderRadius:12 },
  btnTxt:{ color:"#fff", fontWeight:"800" },
  btnGhost:{ backgroundColor:"#fff", paddingVertical:10, paddingHorizontal:14, borderRadius:12, borderWidth:1, borderColor:"#DCEAE6" },
  btnGhostTxt:{ color:"#134E48", fontWeight:"800" },
});