import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { Listing, ListingStatus, fetchListings } from "@/services/annonces.api";
import ListingCard from "@/components/provider/ListingCard";
import { router } from "expo-router";

export default function MyListingsScreen() {
  const ins = useSafeAreaInsets();
  const [tab, setTab] = useState<ListingStatus>("active");
  const [data, setData] = useState<Listing[]|null>(null);

  async function load() {
    setData(null);
    const rows = await fetchListings(tab);
    setData(rows);
  }
  
  useEffect(() => { 
    load(); 
  }, [tab]);

  return (
    <View style={s.container}>
      <View style={[s.tabs, { paddingTop: ins.top + 8 }]}>
        <Text style={s.h1}>Mes annonces</Text>
        <Pressable onPress={() => router.push("/provider/annonces/new")} style={s.fabSmall}>
          <Plus color="#fff"/>
        </Pressable>

        <View style={s.segment}>
          {(["active","pending","expired"] as ListingStatus[]).map(t => (
            <Pressable key={t} onPress={() => setTab(t)} style={[s.segBtn, tab===t && s.segBtnActive]}>
              <Text style={[s.segTxt, tab===t && s.segTxtActive]}>
                {t==="active"?"Actives":t==="pending"?"En attente":"Expirées"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {!data ? (
        <View style={s.loading}>
          <ActivityIndicator/>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          renderItem={({item}) => <ListingCard item={item}/>}
          contentContainerStyle={{ paddingBottom: ins.bottom + 90 }}
        />
      )}

      <Pressable onPress={() => router.push("/provider/annonces/new")} style={[s.fab, { bottom: ins.bottom + 20 }]}>
        <Plus color="#fff" size={22}/>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1 },
  tabs: { backgroundColor:"#fff" },
  h1: { fontSize:26, fontWeight:"900", paddingHorizontal:16, marginBottom:6 },
  segment: { flexDirection:"row", gap:8, paddingHorizontal:16, paddingBottom:10 },
  segBtn: { paddingHorizontal:14, height:36, borderRadius:999, backgroundColor:"#F3F4F6", justifyContent:"center" },
  segBtnActive: { backgroundColor:"#064e3b" },
  segTxt: { fontWeight:"700" },
  segTxtActive: { color:"#fff", fontWeight:"800" },
  loading: { flex:1, alignItems:"center", justifyContent:"center" },
  fab: { position:"absolute", right:20, width:56, height:56, borderRadius:28, backgroundColor:"#065f46", alignItems:"center", justifyContent:"center", elevation:6 },
  fabSmall: { position:"absolute", top:10, right:16, width:44, height:44, borderRadius:22, backgroundColor:"#065f46", alignItems:"center", justifyContent:"center" },
});