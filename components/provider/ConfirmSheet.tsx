import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function ConfirmSheet({ title, description, confirmLabel, onConfirm, danger }:{
  title:string; 
  description?:string; 
  confirmLabel:string; 
  onConfirm:()=>void;
  danger?: boolean;
}) {
  return (
    <View style={s.container}>
      <Text style={s.title}>{title}</Text>
      {!!description && <Text style={s.description}>{description}</Text>}
      <View style={s.buttonRow}>
        <Pressable style={[s.btn, s.cancelBtn]} onPress={() => router.back()}>
          <Text style={s.cancelBtnTxt}>Annuler</Text>
        </Pressable>
        <Pressable style={[s.btn, danger ? s.dangerBtn : s.confirmBtn]} onPress={onConfirm}>
          <Text style={[s.confirmBtnTxt, danger && s.dangerBtnTxt]}>{confirmLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({ 
  container: { padding:16, gap:10 },
  title: { fontSize:18, fontWeight:"800" },
  description: { color:"#6b7280" },
  buttonRow: { flexDirection:"row", gap:10 },
  btn: { flex:1, height:48, borderRadius:12, alignItems:"center", justifyContent:"center" }, 
  cancelBtn: { backgroundColor:"#F3F4F6" },
  confirmBtn: { backgroundColor:"#064e3b" },
  dangerBtn: { backgroundColor:"#b91c1c" },
  cancelBtnTxt: { fontWeight:"800" },
  confirmBtnTxt: { color:"#fff", fontWeight:"800" },
  dangerBtnTxt: { color:"#fff" }
});