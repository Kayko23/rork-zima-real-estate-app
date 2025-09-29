import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, Pressable } from "react-native";
import { Bell, ShieldCheck, Moon, Globe2 } from "lucide-react-native";
import { router } from "expo-router";

export default function SettingsScreen() {
  const [notif, setNotif] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const [dark, setDark] = useState(false);

  return (
    <View style={s.container}>
      <Text style={s.h2}>Général</Text>

      <Row icon={<Bell />} label="Notifications" value={notif} onValueChange={setNotif} />
      <Row icon={<ShieldCheck />} label="Confidentialité renforcée" value={privacy} onValueChange={setPrivacy} />
      <Row icon={<Moon />} label="Mode sombre" value={dark} onValueChange={setDark} />

      <Pressable style={s.link} onPress={() => router.push("/profile/language-currency")}>
        <Globe2 />
        <Text style={s.linkTxt}>Langue & Devise</Text>
      </Pressable>
    </View>
  );
}

function Row({icon, label, value, onValueChange}:{icon:any; label:string; value:boolean; onValueChange:(v:boolean)=>void}) {
  return (
    <View style={s.row}>
      <View style={s.rowContent}>
        <Text>{icon}</Text>
        <Text style={s.rowLabel}>{label}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const s = StyleSheet.create({
  container:{ padding:16, gap:14 },
  h2:{ fontSize:18, fontWeight:"700", marginBottom:8 },
  row:{ height:56, backgroundColor:"#fff", borderRadius:12, paddingHorizontal:12, borderWidth:1, borderColor:"#e5e7eb", flexDirection:"row", alignItems:"center", justifyContent:"space-between" },
  rowContent: { flexDirection:"row", alignItems:"center", gap:10 },
  rowLabel: { fontWeight:"600" },
  link:{ height:56, borderRadius:12, borderWidth:1, borderColor:"#e5e7eb", backgroundColor:"#fff", flexDirection:"row", alignItems:"center", gap:10, paddingHorizontal:12 },
  linkTxt:{ fontWeight:"700" },
});