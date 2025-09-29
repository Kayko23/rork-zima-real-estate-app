import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function ConfirmSheet({ title, description, confirmLabel, onConfirm }:{
  title:string; description?:string; confirmLabel:string; onConfirm:()=>void;
}) {
  return (
    <View style={s.container}>
      <Text style={s.title}>{title}</Text>
      {!!description && <Text style={s.description}>{description}</Text>}
      <View style={s.buttonRow}>
        <Pressable style={[s.btn,s.cancelBtn]} onPress={()=>router.back()}>
          <Text style={s.btnTxt}>Annuler</Text>
        </Pressable>
        <Pressable style={[s.btn,s.confirmBtn]} onPress={onConfirm}>
          <Text style={[s.btnTxt,s.confirmTxt]}>{confirmLabel}</Text>
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
  btn:{ flex:1, height:48, borderRadius:12, alignItems:"center", justifyContent:"center" }, 
  cancelBtn: { backgroundColor:"#F3F4F6" },
  confirmBtn: { backgroundColor:"#b91c1c" },
  btnTxt:{ fontWeight:"800" },
  confirmTxt: { color:"#fff" }
});