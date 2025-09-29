import React from "react";
import { View, Text, Pressable, StyleSheet, Linking } from "react-native";
import { LifeBuoy, Mail, MessageCircle } from "lucide-react-native";
import { router } from "expo-router";

export default function HelpScreen() {
  return (
    <View style={s.wrap}>
      <LifeBuoy size={48} />
      <Text style={s.title}>Aide & support</Text>
      <Text style={s.desc}>Besoin d&apos;un coup de main ? Choisissez une option :</Text>

      <Pressable style={s.row} onPress={() => router.push("/support")}>
        <MessageCircle />
        <Text style={s.rowTxt}>Ouvrir le centre d&apos;aide</Text>
      </Pressable>

      <Pressable style={s.row} onPress={() => Linking.openURL("mailto:support@zima.africa")}>
        <Mail />
        <Text style={s.rowTxt}>Contacter le support par email</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:{ padding:24, gap:14 },
  title:{ fontSize:20, fontWeight:"800" },
  desc:{ color:"#6b7280" },
  row:{ height:56, backgroundColor:"#fff", borderRadius:12, paddingHorizontal:12, borderWidth:1, borderColor:"#e5e7eb", flexDirection:"row", alignItems:"center", gap:10 },
  rowTxt:{ fontWeight:"700" },
});