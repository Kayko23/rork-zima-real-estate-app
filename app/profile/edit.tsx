import React, { useState } from "react";
import { View, Text, TextInput, Image, Pressable, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Save, Camera, UserRound, Mail, Phone, MapPin, Globe2, Lock, Eye, EyeOff } from "lucide-react-native";
import { useApp } from "@/hooks/useAppStore";

export default function EditProfileScreen() {
  const { user, updateUser } = useApp();
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [cover, setCover] = useState<string | undefined>(user?.cover);
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function pick(kind: "avatar" | "cover") {
    const res = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      quality: 0.8 
    });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      kind === "avatar" ? setAvatar(uri) : setCover(uri);
    }
  }

  function onSave() {
    // Validate password change if provided
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        alert("Veuillez saisir votre mot de passe actuel");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("Les nouveaux mots de passe ne correspondent pas");
        return;
      }
      if (newPassword.length < 6) {
        alert("Le nouveau mot de passe doit contenir au moins 6 caractères");
        return;
      }
    }

    const updateData: any = { 
      name: fullName, 
      email, 
      phone, 
      city, 
      country, 
      bio, 
      avatar, 
      cover 
    };

    // Add password change if provided
    if (newPassword && currentPassword) {
      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
    }

    updateUser(updateData);
    
    // Clear password fields after save
    if (newPassword) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Pressable onPress={() => pick("cover")} style={s.cover}>
        {cover ? <Image source={{uri: cover}} style={s.coverImg}/> : <Camera />}
      </Pressable>

      <Pressable onPress={() => pick("avatar")} style={s.avatarWrap}>
        {avatar ? <Image source={{uri: avatar}} style={s.avatar}/> : <UserRound size={28} />}
      </Pressable>

      <View style={s.form}>
        <Field icon={<UserRound size={18}/>} value={fullName} onChangeText={setFullName} placeholder="Nom complet" />
        <Field icon={<Mail size={18}/>} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
        <Field icon={<Phone size={18}/>} value={phone} onChangeText={setPhone} placeholder="Téléphone" keyboardType="phone-pad" />
        <Field icon={<MapPin size={18}/>} value={city} onChangeText={setCity} placeholder="Ville" />
        <Field icon={<Globe2 size={18}/>} value={country} onChangeText={setCountry} placeholder="Pays" />
        <Text style={s.label}>Bio</Text>
        <TextInput style={[s.input, s.multiline]} multiline numberOfLines={5} value={bio} onChangeText={setBio} placeholder="Présentez-vous…" />
        
        <Text style={[s.label, {marginTop: 24}]}>Changer le mot de passe</Text>
        <PasswordField 
          icon={<Lock size={18}/>} 
          value={currentPassword} 
          onChangeText={setCurrentPassword} 
          placeholder="Mot de passe actuel" 
          showPassword={showCurrentPassword}
          onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
        />
        <PasswordField 
          icon={<Lock size={18}/>} 
          value={newPassword} 
          onChangeText={setNewPassword} 
          placeholder="Nouveau mot de passe" 
          showPassword={showNewPassword}
          onToggleShow={() => setShowNewPassword(!showNewPassword)}
        />
        <PasswordField 
          icon={<Lock size={18}/>} 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
          placeholder="Confirmer le nouveau mot de passe" 
          showPassword={showConfirmPassword}
          onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      </View>

      <Pressable onPress={onSave} style={s.cta}>
        <Save color="#fff" />
        <Text style={s.ctaTxt}>Enregistrer</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field(props: any) {
  const { icon, ...ti } = props;
  return (
    <View style={s.row}>
      <View style={s.icon}>
        <Text>{icon}</Text>
      </View>
      <TextInput style={s.input} {...ti} />
    </View>
  );
}

function PasswordField(props: {
  icon: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  showPassword: boolean;
  onToggleShow: () => void;
}) {
  const { icon, showPassword, onToggleShow, ...ti } = props;
  return (
    <View style={s.row}>
      <View style={s.icon}>
        <Text>{icon}</Text>
      </View>
      <TextInput 
        style={s.input} 
        secureTextEntry={!showPassword}
        {...ti} 
      />
      <Pressable onPress={onToggleShow} style={s.eyeIcon}>
        {showPassword ? <EyeOff size={18} color="#6b7280" /> : <Eye size={18} color="#6b7280" />}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingBottom: 32 },
  cover: { height: 160, backgroundColor: "#eef2ef", justifyContent: "center", alignItems: "center" },
  coverImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  avatarWrap:{ width:96, height:96, borderRadius:48, backgroundColor:"#e7ece9", alignSelf:"center", marginTop:-48, alignItems:"center", justifyContent:"center", overflow:"hidden", borderWidth:3, borderColor:"#fff" },
  avatar: { width:"100%", height:"100%" },
  form:{ padding:16, gap:12 },
  row:{ flexDirection:"row", alignItems:"center", borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, paddingHorizontal:12, backgroundColor:"#fff" },
  icon:{ marginRight:8 },
  input:{ flex:1, height:48 },
  label:{ marginTop:8, marginBottom:4, fontWeight:"600" },
  multiline:{ height:120, paddingTop:12, textAlignVertical:"top" },
  cta:{ margin:16, height:52, backgroundColor:"#1F2937", borderRadius:14, alignItems:"center", justifyContent:"center", flexDirection:"row", gap:8 },
  ctaTxt:{ color:"#fff", fontWeight:"700" },
  eyeIcon: { padding: 4 },
});