import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Image, KeyboardAvoidingView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Save, MapPin } from "lucide-react-native";
import { Listing, ListingType, RentPeriod } from "@/services/annonces.api";
import CountryPickerSheet from "@/components/search/CountryPickerSheet";
import CityPickerSheet from "@/components/search/CityPickerSheet";

const currencyMap: Record<string, { code: string }> = {
  CI: { code: "XOF" },
  SN: { code: "XOF" },
  BJ: { code: "XOF" },
  TG: { code: "XOF" },
  CM: { code: "XAF" },
  GA: { code: "XAF" },
  GH: { code: "GHS" },
  NG: { code: "NGN" },
  US: { code: "USD" },
  FR: { code: "EUR" },
};

export default function ListingForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<Listing>;
  onSubmit: (payload: Partial<Listing>) => void;
}) {
  const [title, setTitle] = useState<string>(initial?.title ?? "");
  const [type, setType] = useState<ListingType>(initial?.type ?? "sale");
  const [rentPeriod, setRentPeriod] = useState<RentPeriod>(initial?.rentPeriod ?? "monthly");
  const [price, setPrice] = useState<string>(String(initial?.price ?? ""));
  const [currency, setCurrency] = useState<string>(initial?.currency ?? "XOF");
  const [city, setCity] = useState<string>(initial?.city ?? "");
  const [country, setCountry] = useState<string>(initial?.country ?? "");
  const [countryCode, setCountryCode] = useState<string>("");
  const [surface, setSurface] = useState<string>(String(initial?.surface ?? ""));
  const [beds, setBeds] = useState<string>(String(initial?.beds ?? ""));
  const [baths, setBaths] = useState<string>(String(initial?.baths ?? ""));
  const [desc, setDesc] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const [cover, setCover] = useState<string | undefined>(initial?.photos?.[0]);
  const [countryVisible, setCountryVisible] = useState<boolean>(false);
  const [cityVisible, setCityVisible] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (countryCode) {
      const c = currencyMap[countryCode]?.code;
      if (c) setCurrency(c);
    }
  }, [countryCode]);

  const formattedPrice = useMemo(() => {
    const n = Number(price || 0);
    if (!n || !currency) return "";
    try {
      return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(n);
    } catch {
      return `${n} ${currency}`;
    }
  }, [price, currency]);

  const addPhoto = useCallback(async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, quality: 0.85 });
      if (!res.canceled) {
        const uris = res.assets.map(a => a.uri);
        setPhotos(p => [...p, ...uris]);
        if (!cover && uris[0]) setCover(uris[0]);
      }
    } catch (err) {
      console.log("addPhoto error", err);
      setErrorText("Impossible d'ajouter des photos.");
    }
  }, [cover]);

  const pickCover = useCallback(async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
      if (!res.canceled) {
        setCover(res.assets[0]?.uri);
        if (res.assets[0]?.uri) setPhotos(prev => [res.assets[0].uri, ...prev.filter(u => u !== res.assets[0].uri)]);
      }
    } catch (err) {
      console.log("pickCover error", err);
      setErrorText("Impossible de sélectionner la couverture.");
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) {
      setErrorText("Veuillez saisir un titre.");
      return;
    }
    setSubmitting(true);
    setErrorText(null);
    try {
      const payload: Partial<Listing> = {
        title: title.trim(),
        type,
        price: Number(price || 0),
        currency,
        city: city.trim(),
        country: country.trim(),
        surface: Number(surface || 0),
        beds: Number(beds || 0),
        baths: Number(baths || 0),
        photos: photos.length ? photos : (cover ? [cover] : []),
      };
      if (type === "rent") payload.rentPeriod = rentPeriod;
      onSubmit(payload);
    } catch (e) {
      console.log("submit error", e);
      setErrorText("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }, [title, type, price, currency, city, country, surface, beds, baths, photos, cover, rentPeriod, onSubmit]);

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : "height"} testID="listingForm-root">
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={s.section}>Médias</Text>
        <View style={s.row}>
          <Pressable onPress={pickCover} style={[s.cover, !cover && s.coverEmpty]} testID="cover-picker">
            {cover ? <Image source={{ uri: cover }} style={s.coverImg} /> : <Text style={s.coverHint}>+ Couverture</Text>}
          </Pressable>
          <Pressable onPress={addPhoto} style={s.galleryBtn} testID="gallery-picker">
            <Text style={s.btnText}>+ Galerie</Text>
          </Pressable>
        </View>
        {photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.galleryStrip}>
            {photos.map((u, i) => (
              <Image key={`photo-${i}`} source={{ uri: u }} style={s.photo} />
            ))}
          </ScrollView>
        )}

        <Text style={s.section}>Informations</Text>
        <Text style={s.label}>Titre</Text>
        <Input value={title} onChangeText={setTitle} placeholder="Ex: Villa · Accra" testID="input-title" />

        <Text style={s.label}>Type</Text>
        <View style={s.segmentRow}>
          <Seg active={type === "sale"} onPress={() => setType("sale")} label="Vente" testID="seg-sale" />
          <Seg active={type === "rent"} onPress={() => setType("rent")} label="Location" testID="seg-rent" />
          {type === "rent" && (
            <>
              <Seg active={rentPeriod === "monthly"} onPress={() => setRentPeriod("monthly")} label="Mensuel" testID="seg-monthly" />
              <Seg active={rentPeriod === "daily"} onPress={() => setRentPeriod("daily")} label="Journalier" testID="seg-daily" />
            </>
          )}
        </View>

        <Text style={s.label}>Prix et devise</Text>
        <View style={s.row}>
          <Input style={s.flex1} value={price} onChangeText={setPrice} placeholder="Montant" keyboardType="numeric" testID="input-price" />
          <Input style={s.currency} value={currency} onChangeText={setCurrency} placeholder="Devise" testID="input-currency" />
        </View>
        {!!formattedPrice && <Text style={s.hint}>Aperçu: {formattedPrice}</Text>}

        <Text style={s.label}>Surface / Chambres / SDB</Text>
        <View style={s.row}>
          <Input style={s.flex1} value={surface} onChangeText={setSurface} placeholder="m²" keyboardType="numeric" testID="input-surface" />
          <Input style={s.flex1} value={beds} onChangeText={setBeds} placeholder="chambres" keyboardType="numeric" testID="input-beds" />
          <Input style={s.flex1} value={baths} onChangeText={setBaths} placeholder="SDB" keyboardType="numeric" testID="input-baths" />
        </View>

        <View style={s.locationHeader}>
          <MapPin size={16} />
          <Text style={s.label}>Localisation</Text>
        </View>
        <View style={s.row}>
          <Pressable style={[s.input, s.btnLike]} onPress={() => setCountryVisible(true)} testID="picker-country">
            <Text>{country || "Choisir le pays"}</Text>
          </Pressable>
          <Pressable style={[s.input, s.btnLike]} onPress={() => setCityVisible(true)} disabled={!country} testID="picker-city">
            <Text>{city || "Ville"}</Text>
          </Pressable>
        </View>

        <Text style={s.label}>Description</Text>
        <Input multiline style={s.textarea} value={desc} onChangeText={setDesc} placeholder="Décrivez le bien…" testID="input-desc" />

        {!!errorText && <Text style={s.error}>{errorText}</Text>}

        <Pressable onPress={handleSubmit} style={[s.cta, submitting && s.ctaDisabled]} disabled={submitting} testID="btn-save">
          <Save color="#fff" />
          <Text style={s.ctaTxt}>Enregistrer</Text>
        </Pressable>
      </ScrollView>

      <CountryPickerSheet
        visible={countryVisible}
        onClose={() => setCountryVisible(false)}
        onSelect={(c) => {
          setCountry(c.name);
          setCountryCode(c.code);
          setCity("");
          setCountryVisible(false);
        }}
      />
      <CityPickerSheet
        visible={cityVisible}
        countryCode={countryCode || null}
        onClose={() => setCityVisible(false)}
        onSelect={(v) => {
          setCity(v.name);
          setCityVisible(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

function Input(props: any) {
  return <TextInput {...props} style={[s.input, props.style]} />;
}

function Seg({ label, active, onPress, testID }: { label: string; active?: boolean; onPress?: () => void; testID?: string }) {
  return (
    <Pressable testID={testID} onPress={onPress} style={[s.segBtn, active && s.segBtnActive]}>
      <Text style={[s.segTxt, active && s.segTxtActive]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 120 },
  section: { fontSize: 16, fontWeight: "800", marginTop: 4, marginBottom: 6 },
  hint: { color: "#6b7280", marginTop: 4 },
  coverHint: { color: "#6b7280", fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10 },
  label: { fontWeight: "800", marginTop: 4 },
  galleryStrip: { paddingVertical: 8, gap: 10 },
  photo: { width: 90, height: 90, borderRadius: 12, marginRight: 10 },
  cover: { width: 120, height: 90, borderRadius: 12, overflow: "hidden", marginRight: 8, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  coverEmpty: { backgroundColor: "#F9FAFB" },
  coverImg: { width: "100%", height: "100%" },
  galleryBtn: { paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "#0f5132", borderRadius: 12 },
  btnText: { color: "#fff", fontWeight: "600" },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", paddingHorizontal: 12, backgroundColor: "#fff" },
  flex1: { flex: 1 },
  currency: { width: 110 },
  btnLike: { justifyContent: "center" },
  textarea: { height: 120, textAlignVertical: "top", paddingTop: 12 },
  segmentRow: { flexDirection: "row", gap: 10, alignItems: "center", flexWrap: "wrap" },
  segBtn: { paddingHorizontal: 14, height: 36, borderRadius: 999, backgroundColor: "#F3F4F6", justifyContent: "center" },
  segBtnActive: { backgroundColor: "#064e3b" },
  segTxt: { fontWeight: "700" },
  segTxtActive: { color: "#fff", fontWeight: "800" },
  locationHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cta: { marginTop: 12, height: 52, backgroundColor: "#1F2937", borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  ctaDisabled: { opacity: 0.6 },
  ctaTxt: { color: "#fff", fontWeight: "800" },
  error: { color: "#b91c1c", marginTop: 6, fontWeight: "700" },
});