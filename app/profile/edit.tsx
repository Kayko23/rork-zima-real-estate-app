import React, { useRef, useState, useEffect } from "react";
import { View, Text, TextInput, Image, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Save, Camera, UserRound, Mail, Phone, MapPin, Globe2, Lock, Eye, EyeOff, ChevronDown } from "lucide-react-native";
import { useApp } from "@/hooks/useAppStore";
import { getAllCountries, getCitiesByCountryName } from "@/constants/countries";
import BottomSheet from "@/components/ui/BottomSheet";

export default function EditProfileScreen() {
  const { user, updateUser } = useApp();
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [cover, setCover] = useState<string | undefined>(user?.cover);
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
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

  const scrollRef = useRef<ScrollView | null>(null);
  const allCountries = getAllCountries();

  useEffect(() => {
    if (country) {
      const cities = getCitiesByCountryName(country);
      setAvailableCities(cities);
      if (!cities.includes(city)) {
        setCity("");
      }
    } else {
      setAvailableCities([]);
      setCity("");
    }
  }, [country]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height", default: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 88, android: 0, default: 0 }) ?? 0}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Pressable onPress={() => pick("cover")} style={s.cover}>
          {cover ? <Image source={{uri: cover}} style={s.coverImg}/> : <Camera />}
        </Pressable>

        <Pressable onPress={() => pick("avatar")} style={s.avatarWrap}>
          {avatar ? <Image source={{uri: avatar}} style={s.avatar}/> : <UserRound size={28} />}
        </Pressable>

        <View style={s.form}>
          <Field icon={<UserRound size={18}/>} value={fullName} onChangeText={setFullName} placeholder="Nom complet" returnKeyType="next" />
          <Field icon={<Mail size={18}/>} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" returnKeyType="next" />
          <Field icon={<Phone size={18}/>} value={phone} onChangeText={setPhone} placeholder="Téléphone" keyboardType="phone-pad" returnKeyType="next" />
          
          <Pressable onPress={() => setShowCountryPicker(true)} style={s.row}>
            <View style={s.icon}>
              <Globe2 size={18}/>
            </View>
            <Text style={[s.pickerText, !country && s.placeholder]}>
              {country || "Pays"}
            </Text>
            <ChevronDown size={18} color="#6b7280" />
          </Pressable>

          <Pressable onPress={() => country ? setShowCityPicker(true) : null} style={[s.row, !country && s.disabled]}>
            <View style={s.icon}>
              <MapPin size={18} color={!country ? "#d1d5db" : "#000"}/>
            </View>
            <Text style={[s.pickerText, !city && s.placeholder, !country && s.disabledText]}>
              {city || "Ville"}
            </Text>
            <ChevronDown size={18} color={!country ? "#d1d5db" : "#6b7280"} />
          </Pressable>
          <Text style={s.label}>Bio</Text>
          <View style={s.bioContainer}>
            <TextInput style={[s.input, s.multiline]} multiline numberOfLines={5} value={bio} onChangeText={setBio} placeholder="Présentez-vous…" textAlignVertical="top" returnKeyType="done" />
          </View>
          
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

      <BottomSheet visible={showCountryPicker} onClose={() => setShowCountryPicker(false)} maxHeight={0.7}>
        <Text style={s.sheetTitle}>Sélectionner un pays</Text>
        <ScrollView style={s.pickerList}>
          {allCountries.map((c) => (
            <Pressable
              key={c.code}
              onPress={() => {
                setCountry(c.name);
                setShowCountryPicker(false);
              }}
              style={s.pickerItem}
            >
              <Text style={[s.pickerItemText, country === c.name && s.pickerItemSelected]}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </BottomSheet>

      <BottomSheet visible={showCityPicker} onClose={() => setShowCityPicker(false)} maxHeight={0.7}>
        <Text style={s.sheetTitle}>Sélectionner une ville</Text>
        <ScrollView style={s.pickerList}>
          {availableCities.map((cityName) => (
            <Pressable
              key={cityName}
              onPress={() => {
                setCity(cityName);
                setShowCityPicker(false);
              }}
              style={s.pickerItem}
            >
              <Text style={[s.pickerItemText, city === cityName && s.pickerItemSelected]}>
                {cityName}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
}

function Field(props: any) {
  const { icon, ...ti } = props;
  return (
    <View style={s.row}>
      <View style={s.icon}>
        {icon}
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
        {icon}
      </View>
      <TextInput 
        style={s.input} 
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        returnKeyType="done"
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
  bioContainer: { borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, paddingHorizontal:12, backgroundColor:"#fff" },
  multiline:{ height:120, paddingTop:12, textAlignVertical:"top" },
  cta:{ margin:16, height:52, backgroundColor:"#1F2937", borderRadius:14, alignItems:"center", justifyContent:"center", flexDirection:"row", gap:8 },
  ctaTxt:{ color:"#fff", fontWeight:"700" },
  eyeIcon: { padding: 4, marginLeft: 8 },
  pickerText: { flex: 1, height: 48, lineHeight: 48, fontSize: 16 },
  placeholder: { color: "#9ca3af" },
  disabled: { opacity: 0.5 },
  disabledText: { color: "#d1d5db" },
  sheetTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  pickerList: { maxHeight: 400 },
  pickerItem: { paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  pickerItemText: { fontSize: 16 },
  pickerItemSelected: { fontWeight: "700", color: "#0C5A45" },
});