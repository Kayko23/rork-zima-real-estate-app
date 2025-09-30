import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdjustSheet({ initial, onConfirm }:{
  initial:{ price:number; currency:string; from?:string; to?:string };
  onConfirm:(v:{ price:number; currency:string; from?:string; to?:string })=>void;
}) {
  const [price, setPrice] = useState(String(initial.price));
  const [currency, setCurrency] = useState(initial.currency);
  const [from, setFrom] = useState(initial.from ?? "");
  const [to, setTo] = useState(initial.to ?? "");
  
  const handleConfirm = () => {
    onConfirm({ 
      price: Number(price||0), 
      currency, 
      from: from || undefined, 
      to: to || undefined 
    });
  };

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        style={s.container} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView 
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.title}>Ajuster l'annonce</Text>
      <View style={s.priceRow}>
        <TextInput 
          style={[s.input, s.priceInput]} 
          keyboardType="numeric" 
          value={price} 
          onChangeText={setPrice} 
          placeholder="Prix" 
        />
        <TextInput 
          style={[s.input, s.currencyInput]} 
          value={currency} 
          onChangeText={setCurrency} 
          placeholder="Devise" 
        />
      </View>
      <Text style={s.label}>Disponibilité (optionnel)</Text>
      <View style={s.dateRow}>
        <TextInput 
          style={[s.input, s.dateInput]} 
          value={from} 
          onChangeText={setFrom} 
          placeholder="Du (YYYY-MM-DD)" 
        />
        <TextInput 
          style={[s.input, s.dateInput]} 
          value={to} 
          onChangeText={setTo} 
          placeholder="Au (YYYY-MM-DD)" 
        />
      </View>
          <Pressable style={s.cta} onPress={handleConfirm}>
            <Text style={s.ctaTxt}>Enregistrer</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  scrollContent: { padding: 16, gap: 10, paddingBottom: 40 }, 
  title: { fontSize:18, fontWeight:"800" }, 
  priceRow: { flexDirection:"row", gap:10 },
  dateRow: { flexDirection:"row", gap:10 },
  input: { height:48, borderRadius:12, borderWidth:1, borderColor:"#e5e7eb", paddingHorizontal:12, backgroundColor:"#fff" }, 
  priceInput: { flex:1 },
  currencyInput: { width:110 },
  dateInput: { flex:1 },
  label: { fontWeight:"700", marginTop:6 },
  cta: { height:48, backgroundColor:"#064e3b", borderRadius:12, alignItems:"center", justifyContent:"center" }, 
  ctaTxt: { color:"#fff", fontWeight:"800" }
});