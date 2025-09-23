import React, { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GlassCard, GlassButton } from "@/components/ui/Glass";
import Colors from "@/constants/colors";

export default function SignIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState(""); 
  const [pwd, setPwd] = useState("");
  
  const valid = /\S+@\S+\.\S+/.test(email) && pwd.length >= 6;

  const handleSignIn = () => {
    if (valid) {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <GlassCard style={s.card}>
        <Text style={s.title}>Connexion</Text>
        <TextInput 
          placeholder="Email" 
          autoCapitalize="none" 
          keyboardType="email-address" 
          value={email} 
          onChangeText={setEmail} 
          style={s.input}
        />
        <TextInput 
          placeholder="Mot de passe" 
          secureTextEntry 
          value={pwd} 
          onChangeText={setPwd} 
          style={s.input}
        />
        <GlassButton 
          title="Se connecter" 
          onPress={handleSignIn} 
          style={[s.cta, !valid && {opacity:0.5}]}
        />
        <View style={s.spacer}/>
        <Link href="/(auth)/sign-up" asChild>
          <Pressable>
            <Text style={s.link}>Créer un compte</Text>
          </Pressable>
        </Link>
      </GlassCard>
    </View>
  );
}

const s = StyleSheet.create({
  screen:{ flex:1, justifyContent:"center", padding:16, backgroundColor: Colors.background.secondary },
  card:{ padding:16 },
  title:{ fontSize:22, fontWeight:"800", marginBottom:12, color:"#0F172A" },
  input:{ backgroundColor:"#fff", borderRadius:14, borderWidth:1, borderColor:"#E6E8EB", padding:12, marginTop:8 },
  cta:{ marginTop:12 },
  spacer: { height: 8 },
  link:{ textAlign:"center", color: Colors.primary, fontWeight:"700" },
});