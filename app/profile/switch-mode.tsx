import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Building2, CheckCircle2 } from "lucide-react-native";
import { router } from "expo-router";
import { useApp } from "@/hooks/useAppStore";

export default function SwitchModeScreen() {
  const { switchMode } = useApp();

  const handleContinue = () => {
    switchMode('provider');
    router.replace('/(proTabs)/dashboard');
  };

  return (
    <View style={s.wrap}>
      <Building2 size={48} />
      <Text style={s.title}>Passez en mode prestataire</Text>
      <Text style={s.desc}>
        Publiez des annonces, gérez vos clients, vos rendez-vous et vos paiements sur ZIMA Pro.
      </Text>

      <View style={s.bullets}>
        <Item><Text>Profil public vérifié</Text></Item>
        <Item><Text>Outils d&apos;annonces & Boost</Text></Item>
        <Item><Text>Messagerie pro & RDV</Text></Item>
      </View>

      <Pressable style={s.cta} onPress={handleContinue}>
        <Text style={s.ctaTxt}>Continuer</Text>
      </Pressable>
    </View>
  );
}

function Item({children}:{children:React.ReactNode}) {
  return (
    <View style={s.bulletItem}>
      <CheckCircle2 color="#059669" />
      <Text style={s.bulletText}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:{ padding:24, alignItems:"center", gap:14 },
  title:{ fontSize:22, fontWeight:"800", textAlign:"center" },
  desc:{ textAlign:"center", color:"#6b7280" },
  bullets:{ width:"100%", gap:10, marginTop:8 },
  bulletItem: { flexDirection:"row", alignItems:"center", gap:8 },
  bulletText: { flex: 1 },
  cta:{ marginTop:18, height:52, backgroundColor:"#064e3b", paddingHorizontal:18, borderRadius:14, alignItems:"center", justifyContent:"center", alignSelf:"stretch" },
  ctaTxt:{ color:"#fff", fontWeight:"800" },
});