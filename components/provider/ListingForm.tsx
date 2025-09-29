import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Image, KeyboardAvoidingView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Save, Camera, MapPin } from "lucide-react-native";
import { Listing, ListingType } from "@/services/annonces.api";

export default function ListingForm({
  initial,
  onSubmit
}: {
  initial?: Partial<Listing>;
  onSubmit: (payload: Partial<Listing>) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState<ListingType>(initial?.type ?? "sale");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [currency, setCurrency] = useState(initial?.currency ?? "XOF");
  const [city, setCity] = useState(initial?.city ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [surface, setSurface] = useState(String(initial?.surface ?? ""));
  const [beds, setBeds] = useState(String(initial?.beds ?? ""));
  const [baths, setBaths] = useState(String(initial?.baths ?? ""));
  const [desc, setDesc] = useState("");
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);

  async function addPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      quality: 0.8 
    });
    if (!res.canceled) setPhotos(p => [...p, res.assets[0].uri]);
  }

  return (
    <KeyboardAvoidingView 
      style={s.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={s.scrollContent}>
        <Label><Text>Photos</Text></Label>
        <View style={s.gallery}>
          {photos.map((u, i) => <Image key={`photo-${i}-${u.slice(-10)}`} source={{uri:u}} style={s.photo}/>)}
          <Pressable onPress={addPhoto} style={s.addPhoto}><Camera /></Pressable>
        </View>

        <Label><Text>Titre</Text></Label>
        <Input value={title} onChangeText={setTitle} placeholder="Ex: Villa · Accra" />

        <Label><Text>Type</Text></Label>
        <View style={s.segment}>
          <Seg active={type==="sale"} onPress={() => setType("sale")} label="Vente" />
          <Seg active={type==="rent"} onPress={() => setType("rent")} label="Location" />
        </View>

        <Label><Text>Prix & devise</Text></Label>
        <View style={s.row}>
          <Input style={s.flex1} value={price} onChangeText={setPrice} placeholder="Montant" keyboardType="numeric" />
          <Input style={s.currency} value={currency} onChangeText={setCurrency} placeholder="Devise" />
        </View>

        <Label><Text>Surface / Chambres / SDB</Text></Label>
        <View style={s.row}>
          <Input style={s.flex1} value={surface} onChangeText={setSurface} placeholder="m²" keyboardType="numeric" />
          <Input style={s.flex1} value={beds} onChangeText={setBeds} placeholder="chambres" keyboardType="numeric" />
          <Input style={s.flex1} value={baths} onChangeText={setBaths} placeholder="SDB" keyboardType="numeric" />
        </View>

        <Label><MapPin size={16}/><Text> Localisation</Text></Label>
        <View style={s.row}>
          <Input style={s.flex1} value={country} onChangeText={setCountry} placeholder="Pays" />
          <Input style={s.flex1} value={city} onChangeText={setCity} placeholder="Ville" />
        </View>

        <Label><Text>Description</Text></Label>
        <Input multiline style={s.textarea} value={desc} onChangeText={setDesc} placeholder="Décrivez le bien…" />

        <Pressable
          onPress={() => onSubmit({
            title, type, price: Number(price || 0), currency, city, country,
            surface: Number(surface || 0), beds: Number(beds || 0), baths: Number(baths || 0),
            photos
          })}
          style={s.cta}
        >
          <Save color="#fff" />
          <Text style={s.ctaTxt}>Enregistrer</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Label({children}:{children:React.ReactNode}) { 
  return <Text style={s.label}>{children}</Text>; 
}

function Input(props:any){ 
  return <TextInput {...props} style={[s.input, props.style]} />; 
}

function Seg({label, active, onPress}:{label:string; active:boolean; onPress:()=>void}) {
  return (
    <Pressable onPress={onPress} style={[s.segBtn, active && s.segBtnActive]}>
      <Text style={[s.segTxt, active && s.segTxtActive]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding:16, gap:12, paddingBottom:120 },
  gallery:{ flexDirection:"row", flexWrap:"wrap", gap:10 },
  photo:{ width:90, height:90, borderRadius:12 },
  addPhoto:{ width:90, height:90, borderRadius:12, borderWidth:1, borderColor:"#e5e7eb", alignItems:"center", justifyContent:"center", backgroundColor:"#F9FAFB" },
  input:{ height:48, borderRadius:12, borderWidth:1, borderColor:"#e5e7eb", paddingHorizontal:12, backgroundColor:"#fff" },
  textarea:{ height:120, textAlignVertical:"top", paddingTop:12 },
  row: { flexDirection:"row", gap:10 },
  flex1: { flex:1 },
  currency: { width:110 },
  segment:{ flexDirection:"row", gap:10 },
  segBtn:{ paddingHorizontal:14, height:36, borderRadius:999, backgroundColor:"#F3F4F6", justifyContent:"center" },
  segBtnActive:{ backgroundColor:"#064e3b" }, 
  segTxt:{ fontWeight:"700" }, 
  segTxtActive:{ color:"#fff", fontWeight:"800" },
  label: { fontWeight:"800", marginTop:4 },
  cta:{ marginTop:12, height:52, backgroundColor:"#1F2937", borderRadius:14, alignItems:"center", justifyContent:"center", flexDirection:"row", gap:8 },
  ctaTxt:{ color:"#fff", fontWeight:"800" },
});