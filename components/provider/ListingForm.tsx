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

  const handleSubmit = () => {
    onSubmit({
      title, 
      type, 
      price: Number(price || 0), 
      currency, 
      city, 
      country,
      surface: Number(surface || 0), 
      beds: Number(beds || 0), 
      baths: Number(baths || 0),
      photos
    });
  };

  return (
    <KeyboardAvoidingView 
      style={s.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Label>Photos</Label>
        <View style={s.gallery}>
          {photos.map((u, i) => <Image key={`photo-${i}`} source={{uri:u}} style={s.photo}/>)}
          <Pressable onPress={addPhoto} style={s.addPhoto}><Camera /></Pressable>
        </View>

        <Label>Titre</Label>
        <Input value={title} onChangeText={setTitle} placeholder="Ex: Villa · Accra" />

        <Label>Type</Label>
        <View style={s.segment}>
          <Seg active={type==="sale"} onPress={() => setType("sale")} label="Vente" />
          <Seg active={type==="rent"} onPress={() => setType("rent")} label="Location" />
        </View>

        <Label>Prix & devise</Label>
        <View style={s.priceRow}>
          <Input style={s.priceInput} value={price} onChangeText={setPrice} placeholder="Montant" keyboardType="numeric" />
          <Input style={s.currencyInput} value={currency} onChangeText={setCurrency} placeholder="Devise" />
        </View>

        <Label>Surface / Chambres / SDB</Label>
        <View style={s.detailsRow}>
          <Input style={s.detailInput} value={surface} onChangeText={setSurface} placeholder="m²" keyboardType="numeric" />
          <Input style={s.detailInput} value={beds} onChangeText={setBeds} placeholder="chambres" keyboardType="numeric" />
          <Input style={s.detailInput} value={baths} onChangeText={setBaths} placeholder="SDB" keyboardType="numeric" />
        </View>

        <View style={s.locationHeader}>
          <MapPin size={16}/>
          <Label>Localisation</Label>
        </View>
        <View style={s.locationRow}>
          <Input style={s.locationInput} value={country} onChangeText={setCountry} placeholder="Pays" />
          <Input style={s.locationInput} value={city} onChangeText={setCity} placeholder="Ville" />
        </View>

        <Label>Description</Label>
        <Input 
          multiline 
          style={[s.textarea]} 
          value={desc} 
          onChangeText={setDesc} 
          placeholder="Décrivez le bien…" 
        />

        <Pressable onPress={handleSubmit} style={s.cta}>
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
  label: { fontWeight:"800", marginTop:4 },
  scrollContent: { padding:16, gap:12, paddingBottom:120 },
  gallery:{ flexDirection:"row", flexWrap:"wrap", gap:10 },
  photo:{ width:90, height:90, borderRadius:12 },
  addPhoto:{ width:90, height:90, borderRadius:12, borderWidth:1, borderColor:"#e5e7eb", alignItems:"center", justifyContent:"center", backgroundColor:"#F9FAFB" },
  input:{ height:48, borderRadius:12, borderWidth:1, borderColor:"#e5e7eb", paddingHorizontal:12, backgroundColor:"#fff" },
  textarea:{ height:120, textAlignVertical:"top", paddingTop: 12 },
  segment:{ flexDirection:"row", gap:10 },
  segBtn:{ paddingHorizontal:14, height:36, borderRadius:999, backgroundColor:"#F3F4F6", justifyContent:"center" },
  segBtnActive:{ backgroundColor:"#064e3b" }, 
  segTxt:{ fontWeight:"700" }, 
  segTxtActive:{ color:"#fff", fontWeight:"800" },
  priceRow: { flexDirection:"row", gap:10 },
  priceInput: { flex:1 },
  currencyInput: { width:110 },
  detailsRow: { flexDirection:"row", gap:10 },
  detailInput: { flex:1 },
  locationHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  locationRow: { flexDirection:"row", gap:10 },
  locationInput: { flex:1 },
  cta:{ marginTop:12, height:52, backgroundColor:"#1F2937", borderRadius:14, alignItems:"center", justifyContent:"center", flexDirection:"row", gap:8 },
  ctaTxt:{ color:"#fff", fontWeight:"800" },
});