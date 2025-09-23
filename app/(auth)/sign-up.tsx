import React, { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GlassCard, GlassButton } from "@/components/ui/Glass";
import Colors from "@/constants/colors";

export default function SignUp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(""); 
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const valid = /\S+@\S+\.\S+/.test(email) && 
                pwd.length >= 6 && 
                pwd === confirmPwd && 
                firstName.trim() && 
                lastName.trim() &&
                acceptTerms;

  const handleSignUp = () => {
    if (valid) {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <GlassCard style={s.card}>
        <Text style={s.title}>Créer un compte</Text>
        <TextInput 
          placeholder="Prénom" 
          value={firstName} 
          onChangeText={setFirstName} 
          style={s.input}
        />
        <TextInput 
          placeholder="Nom" 
          value={lastName} 
          onChangeText={setLastName} 
          style={s.input}
        />
        <TextInput 
          placeholder="Email" 
          autoCapitalize="none" 
          keyboardType="email-address" 
          value={email} 
          onChangeText={setEmail} 
          style={s.input}
        />
        <TextInput 
          placeholder="Téléphone" 
          keyboardType="phone-pad" 
          value={phone} 
          onChangeText={setPhone} 
          style={s.input}
        />
        <TextInput 
          placeholder="Mot de passe" 
          secureTextEntry 
          value={pwd} 
          onChangeText={setPwd} 
          style={s.input}
        />
        <TextInput 
          placeholder="Confirmer le mot de passe" 
          secureTextEntry 
          value={confirmPwd} 
          onChangeText={setConfirmPwd} 
          style={s.input}
        />
        
        <Pressable 
          style={s.checkboxRow} 
          onPress={() => setAcceptTerms(!acceptTerms)}
        >
          <View style={[s.checkbox, acceptTerms && s.checkboxActive]}>
            {acceptTerms && <Text style={s.checkmark}>✓</Text>}
          </View>
          <Text style={s.checkboxText}>J&apos;accepte les conditions générales</Text>
        </Pressable>
        
        <GlassButton 
          title="Créer mon compte" 
          onPress={handleSignUp} 
          style={[s.cta, !valid && {opacity:0.5}]}
        />
        <View style={s.spacer}/>
        <Link href="/(auth)/sign-in" asChild>
          <Pressable>
            <Text style={s.link}>Déjà un compte ? Se connecter</Text>
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
  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 12, gap: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: "#E6E8EB", alignItems: "center", justifyContent: "center" },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  checkboxText: { flex: 1, fontSize: 14, color: "#475569" },
  cta:{ marginTop:12 },
  spacer: { height: 8 },
  link:{ textAlign:"center", color: Colors.primary, fontWeight:"700" },
});