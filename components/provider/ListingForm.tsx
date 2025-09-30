import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Image, KeyboardAvoidingView, Platform, Modal, TouchableOpacity, Keyboard } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Save, MapPin, Check, FilePlus, ChevronDown, ChevronDown as KeyboardHide, Calendar } from "lucide-react-native";
import { Listing, ListingType, RentPeriod } from "@/services/annonces.api";
import CountryPickerSheet from "@/components/search/CountryPickerSheet";
import CityPickerSheet from "@/components/search/CityPickerSheet";
import { pickPdfOrImage } from "@/components/upload/PickFile";

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

const categories = [
  { key: "residential", label: "Résidentiel", types: ["Appartement", "Studio", "Villa", "Maison", "Penthouse", "Duplex", "Triplex", "Immeuble"] },
  { key: "offices", label: "Bureaux", types: ["Bureau", "Plateau", "Coworking", "Espace de travail", "Salle de réunion"] },
  { key: "retail", label: "Commerces & Retail", types: ["Boutique", "Magasin", "Showroom", "Centre commercial", "Local commercial"] },
  { key: "land", label: "Terrains", types: ["Terrain urbain", "Terrain agricole", "Lotissement", "Terrain constructible", "Terrain industriel"] },
  { key: "industrial", label: "Industriel & Logistique", types: ["Entrepôt", "Usine", "Atelier", "Hangar", "Zone industrielle"] },
  { key: "hotel", label: "Hôtellerie & Événementiel", types: ["Hôtel", "Auberge", "Maison d'hôte", "Salle événementielle", "Espace événementiel"] },
] as const;

const amenitiesByCategory: Record<string, { key: string; label: string }[]> = {
  residential: [
    { key: "wifi", label: "Wifi gratuit" },
    { key: "parking", label: "Parking gratuit" },
    { key: "ac", label: "Climatisation" },
    { key: "balcony", label: "Balcon/Terrasse" },
    { key: "pool", label: "Piscine" },
    { key: "security24", label: "Sécurité 24h" },
    { key: "garden", label: "Jardin privé" },
    { key: "elevator", label: "Ascenseur" },
    { key: "kitchen", label: "Cuisine équipée" },
    { key: "furnished", label: "Meublé" },
  ],
  offices: [
    { key: "parking", label: "Parking" },
    { key: "elevator", label: "Ascenseur" },
    { key: "security24", label: "Sécurité 24h" },
    { key: "kitchen", label: "Kitchenette" },
    { key: "wifi", label: "Wifi haut débit" },
    { key: "ac", label: "Climatisation" },
    { key: "meeting_room", label: "Salle de réunion" },
    { key: "reception", label: "Réception" },
  ],
  retail: [
    { key: "corner", label: "Emplacement d'angle" },
    { key: "frontage", label: "Belle vitrine" },
    { key: "parking", label: "Parking clientèle" },
    { key: "storage", label: "Espace stockage" },
    { key: "ac", label: "Climatisation" },
    { key: "security", label: "Système sécurité" },
    { key: "high_traffic", label: "Zone de passage" },
  ],
  land: [
    { key: "titled", label: "Terrain borné" },
    { key: "electricity", label: "Électricité disponible" },
    { key: "water", label: "Eau disponible" },
    { key: "road_access", label: "Accès routier" },
    { key: "flat", label: "Terrain plat" },
    { key: "corner_lot", label: "Terrain d'angle" },
  ],
  industrial: [
    { key: "height", label: "Grande hauteur sous plafond" },
    { key: "dock", label: "Quai de déchargement" },
    { key: "security24", label: "Sécurité 24h" },
    { key: "crane", label: "Pont roulant" },
    { key: "truck_access", label: "Accès poids lourds" },
    { key: "power", label: "Alimentation électrique industrielle" },
  ],
  hotel: [
    { key: "wifi", label: "Wifi gratuit" },
    { key: "breakfast", label: "Petit-déjeuner inclus" },
    { key: "parking", label: "Parking gratuit" },
    { key: "pool", label: "Piscine" },
    { key: "ac", label: "Climatisation" },
    { key: "restaurant", label: "Restaurant" },
    { key: "spa", label: "Spa/Wellness" },
    { key: "conference", label: "Salle de conférence" },
    { key: "room_service", label: "Service en chambre" },
  ],
};

type DocType =
  | "titre_foncier"
  | "certificat_foncier"
  | "permis_construire"
  | "attestation_villageoise"
  | "certificat_cession"
  | "autre";

const baseDocOptions: { key: DocType; label: string }[] = [
  { key: "titre_foncier", label: "Titre foncier" },
  { key: "certificat_foncier", label: "Certificat foncier" },
  { key: "permis_construire", label: "Permis de construire" },
  { key: "attestation_villageoise", label: "Attestation villageoise" },
  { key: "certificat_cession", label: "Certificat de cession" },
  { key: "autre", label: "Autre" },
];

const docOptionsByCountry: Record<string, { key: DocType; label: string }[]> = {
  CI: [
    { key: "attestation_villageoise", label: "Attestation villageoise" },
    { key: "certificat_foncier", label: "Certificat foncier rural" },
  ],
  SN: [
    { key: "titre_foncier", label: "Titre foncier" },
    { key: "certificat_foncier", label: "Certificat d'occupation" },
  ],
  BJ: [
    { key: "certificat_foncier", label: "Certificat foncier" },
    { key: "permis_construire", label: "Permis de construire" },
  ],
  TG: [
    { key: "titre_foncier", label: "Titre foncier" },
    { key: "certificat_cession", label: "Acte de cession" },
  ],
  CM: [
    { key: "titre_foncier", label: "Titre foncier" },
    { key: "certificat_foncier", label: "Certificat d'occupation" },
    { key: "permis_construire", label: "Permis de construire" },
  ],
  NG: [
    { key: "certificat_foncier", label: "Certificate of Occupancy" },
    { key: "titre_foncier", label: "Deed of Assignment" },
  ],
  GH: [
    { key: "titre_foncier", label: "Land Title Certificate" },
    { key: "certificat_foncier", label: "Lease Agreement" },
  ],
  FR: [
    { key: "titre_foncier", label: "Acte de propriété" },
    { key: "permis_construire", label: "Permis de construire" },
  ],
  US: [
    { key: "titre_foncier", label: "Property Deed" },
    { key: "permis_construire", label: "Building Permit" },
  ],
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
  const [salons, setSalons] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const [cover, setCover] = useState<string | undefined>(initial?.photos?.[0]);
  const [countryVisible, setCountryVisible] = useState<boolean>(false);
  const [cityVisible, setCityVisible] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [category, setCategory] = useState<string>("residential");
  const [subtype, setSubtype] = useState<string>(categories[0].types[0]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [yearDate, setYearDate] = useState<string>("");
  const [docType, setDocType] = useState<DocType | null>(null);
  const [docTypeOther, setDocTypeOther] = useState<string>("");
  const [exactAddress, setExactAddress] = useState<string>("");
  const [orientation, setOrientation] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<{ uri: string; name: string; type: string }[]>([]);
  const [subtypePickerVisible, setSubtypePickerVisible] = useState<boolean>(false);
  const [amenitiesPickerVisible, setAmenitiesPickerVisible] = useState<boolean>(false);
  const [categoryPickerVisible, setCategoryPickerVisible] = useState<boolean>(false);
  const [docTypePickerVisible, setDocTypePickerVisible] = useState<boolean>(false);
  const [transactionPickerVisible, setTransactionPickerVisible] = useState<boolean>(false);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

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

  const availableAmenities = amenitiesByCategory[category] ?? [];

  const docOptions = useMemo(() => {
    const extras = docOptionsByCountry[countryCode] ?? [];
    const merged = [...baseDocOptions, ...extras];
    const seen = new Set<string>();
    return merged.filter(d => (seen.has(d.key) ? false : (seen.add(d.key), true)));
  }, [countryCode]);

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

  const onPickAttachment = useCallback(async () => {
    try {
      const f = await pickPdfOrImage();
      if (f) setAttachments(a => [...a, f]);
    } catch (e) {
      console.log("pick attachment error", e);
    }
  }, []);

  const validatePhone = (val: string) => /^\+?[0-9 ()-]{7,}$/.test(val.trim());
  const validateDate = (val: string) => {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/.test(val.trim());
    if (!regex) return false;
    const [, day, month, year] = val.match(/^(\d{2})-(\d{2})-(\d{4})$/) || [];
    const d = parseInt(day), m = parseInt(month), y = parseInt(year);
    return d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= new Date().getFullYear() + 10;
  };
  const limitLandmarkWords = (val: string) => val.trim().split(/[\s]+/).slice(0, 5).join(" ");

  const handleSubmit = useCallback(() => {
    if (!title.trim()) { setErrorText("Veuillez saisir un titre."); return; }
    if (!consent) { setErrorText("Vous devez lire et approuver les conditions."); return; }
    if (phone && !validatePhone(phone)) { setErrorText("Numéro de téléphone invalide."); return; }
    if (yearDate && !validateDate(yearDate)) { setErrorText("Date au format JJ-MM-AAAA requise."); return; }

    setSubmitting(true);
    setErrorText(null);
    try {
      const payload: Partial<Listing> & Record<string, any> = {
        title: title.trim(),
        type,
        price: Number(price || 0),
        currency,
        city: city.trim(),
        country: country.trim(),
        surface: Number(surface || 0),
        beds: Number(beds || 0),
        baths: Number(baths || 0),
        salons: Number(salons || 0),
        photos: photos.length ? photos : (cover ? [cover] : []),
        category,
        subtype,
        amenities,
        yearDate,
        docType: docType || "",
        docTypeOther: docType === "autre" ? docTypeOther : "",
        exactAddress,
        orientation,
        landmark,
        phone,
        description: desc,
        attachmentsCount: attachments.length,
        consent,
      };
      if (type === "rent") payload.rentPeriod = rentPeriod;

      console.log("Submitting listing:", JSON.stringify(payload, null, 2));
      onSubmit(payload);
    } catch (e) {
      console.log("submit error", e);
      setErrorText("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }, [title, type, price, currency, city, country, surface, beds, baths, salons, photos, cover, rentPeriod, category, subtype, amenities, yearDate, docType, docTypeOther, exactAddress, orientation, landmark, phone, attachments.length, consent, desc, onSubmit]);

  const currentTypes = useMemo(() => {
    const found = categories.find(c => c.key === category);
    return found ? found.types : [];
  }, [category]);

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : "height"} testID="listingForm-root">
      <Pressable
        style={s.keyboardDismiss}
        onPress={() => Keyboard.dismiss()}
      >
        <KeyboardHide size={20} color="#6b7280" />
      </Pressable>
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={s.section}>Médias</Text>
        <View style={s.row}>
          <Pressable onPress={pickCover} style={[s.cover, !cover && s.coverEmpty]} testID="cover-picker">
            {cover ? <Image source={{ uri: cover }} style={s.coverImg} /> : <Text style={s.coverHint}>+ Couverture</Text>}
          </Pressable>
          <Pressable onPress={addPhoto} style={s.galleryBtn} testID="gallery-picker">
            <Text style={s.btnText}>+ Galerie</Text>
          </Pressable>
          <Pressable onPress={onPickAttachment} style={s.docBtn} testID="attachment-picker">
            <FilePlus color="#fff" />
            <Text style={s.btnText}> Ajouter pièces</Text>
          </Pressable>
        </View>
        {photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.galleryStrip}>
            {photos.map((u, i) => (
              <Image key={`photo-${i}`} source={{ uri: u }} style={s.photo} />
            ))}
          </ScrollView>
        )}
        {attachments.length > 0 && (
          <Text style={s.hint}>{attachments.length} pièce(s) jointe(s)</Text>
        )}

        <Text style={s.section}>Informations</Text>
        <Text style={s.label}>Titre</Text>
        <Input value={title} onChangeText={setTitle} placeholder="Ex: Villa · Accra" testID="input-title" />

        <Text style={s.label}>Catégorie de bien</Text>
        <Pressable style={s.pickerButton} onPress={() => setCategoryPickerVisible(true)} testID="picker-category">
          <Text style={s.pickerButtonText}>{categories.find(c => c.key === category)?.label || "Sélectionner une catégorie"}</Text>
          <ChevronDown size={20} color="#6b7280" />
        </Pressable>

        <Text style={s.label}>Type de bien</Text>
        <Pressable style={s.pickerButton} onPress={() => setSubtypePickerVisible(true)} testID="picker-subtype">
          <Text style={s.pickerButtonText}>{subtype || "Sélectionner un type"}</Text>
          <ChevronDown size={20} color="#6b7280" />
        </Pressable>

        <Text style={s.label}>Transaction</Text>
        <Pressable style={s.pickerButton} onPress={() => setTransactionPickerVisible(true)} testID="picker-transaction">
          <Text style={s.pickerButtonText}>
            {type === "sale" ? "Vente" : type === "rent" && rentPeriod === "monthly" ? "Location mensuelle" : "Location journalière"}
          </Text>
          <ChevronDown size={20} color="#6b7280" />
        </Pressable>

        <Text style={s.label}>Prix et devise</Text>
        <View style={s.row}>
          <Input style={s.flex1} value={price} onChangeText={setPrice} placeholder="Montant" keyboardType="numeric" testID="input-price" />
          <Input style={s.currency} value={currency} onChangeText={setCurrency} placeholder="Devise" testID="input-currency" />
        </View>
        {!!formattedPrice && <Text style={s.hint}>Aperçu: {formattedPrice}{type === "rent" ? (rentPeriod === "daily" ? " / jour" : " / mois") : ""}</Text>}

        <Text style={s.label}>Surface / Chambres / SDB / Salons</Text>
        <View style={s.row}>
          <Input style={s.flex1} value={surface} onChangeText={setSurface} placeholder="m²" keyboardType="numeric" testID="input-surface" />
          <Input style={s.flex1} value={beds} onChangeText={setBeds} placeholder="chambres" keyboardType="numeric" testID="input-beds" />
          <Input style={s.flex1} value={baths} onChangeText={setBaths} placeholder="SDB" keyboardType="numeric" testID="input-baths" />
          <Input style={s.flex1} value={salons} onChangeText={setSalons} placeholder="salons" keyboardType="numeric" testID="input-salons" />
        </View>
        {(surface || beds || baths || salons) && (
          <Text style={s.previewText}>
            Aperçu: {surface ? `${surface} m²` : ""}{surface && (beds || baths || salons) ? ", " : ""}
            {beds ? `${beds} chambre${Number(beds) > 1 ? "s" : ""}` : ""}{beds && (baths || salons) ? ", " : ""}
            {baths ? `${baths} salle${Number(baths) > 1 ? "s" : ""} de bain${Number(baths) > 1 ? "s" : ""}` : ""}{baths && salons ? ", " : ""}
            {salons ? `${salons} salon${Number(salons) > 1 ? "s" : ""}` : ""}
            {beds || salons ? ` · ${beds || 0}+${salons || 0}` : ""}
          </Text>
        )}

        <Text style={s.label}>Points forts (équipements)</Text>
        <Pressable style={s.pickerButton} onPress={() => setAmenitiesPickerVisible(true)} testID="picker-amenities">
          <Text style={s.pickerButtonText}>
            {amenities.length > 0 ? `${amenities.length} équipement(s) sélectionné(s)` : "Sélectionner des équipements"}
          </Text>
          <ChevronDown size={20} color="#6b7280" />
        </Pressable>
        {amenities.length > 0 && (
          <View style={s.selectedAmenities}>
            {amenities.map(k => {
              const found = availableAmenities.find(a => a.key === k);
              return found ? (
                <View key={k} style={s.selectedChip}>
                  <Text style={s.selectedChipText}>{found.label}</Text>
                </View>
              ) : null;
            })}
          </View>
        )}

        <Text style={s.label}>Année de construction/certification (JJ-MM-AAAA)</Text>
        <Pressable style={s.pickerButton} onPress={() => setCalendarVisible(true)} testID="picker-calendar">
          <Text style={s.pickerButtonText}>{yearDate || "Sélectionner une date"}</Text>
          <Calendar size={20} color="#6b7280" />
        </Pressable>
        {yearDate && !validateDate(yearDate) && <Text style={s.error}>Format requis: JJ-MM-AAAA (ex: 15-03-2020)</Text>}

        <Text style={s.label}>Type de document</Text>
        <Pressable style={s.pickerButton} onPress={() => setDocTypePickerVisible(true)} testID="picker-doctype">
          <Text style={s.pickerButtonText}>{docType ? docOptions.find(d => d.key === docType)?.label || "Sélectionner un type" : "Sélectionner un type"}</Text>
          <ChevronDown size={20} color="#6b7280" />
        </Pressable>
        {docType === "autre" && (
          <Input value={docTypeOther} onChangeText={setDocTypeOther} placeholder="Préciser le type de document" testID="input-doc-other" />
        )}

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
        <Text style={s.label}>Adresse exacte</Text>
        <Input value={exactAddress} onChangeText={setExactAddress} placeholder="Rue, quartier, numéro" testID="input-exact-address" />

        <Text style={s.label}>Orientation</Text>
        <Input value={orientation} onChangeText={setOrientation} placeholder="Ex: Sud-Est" testID="input-orientation" />

        <Text style={s.label}>Repère pour localiser facilement (5 mots max)</Text>
        <Input value={landmark} onChangeText={(t: string) => setLandmark(limitLandmarkWords(t))} placeholder="Ex: près mosquée centrale" testID="input-landmark" />
        <Text style={s.hint}>Décrivez un point de repère connu pour faciliter la localisation</Text>

        <Text style={s.label}>Description</Text>
        <Input multiline style={s.textarea} value={desc} onChangeText={setDesc} placeholder="Décrivez le bien…" testID="input-desc" />

        <Text style={s.label}>Téléphone de contact</Text>
        <Input value={phone} onChangeText={setPhone} placeholder="Ex: +221 77 123 45 67" keyboardType="phone-pad" testID="input-phone" />

        <Pressable onPress={() => setConsent(v => !v)} style={[s.consent, consent && s.consentActive]} testID="input-consent">
          <View style={[s.checkbox, consent && s.checkboxActive]}>
            {consent && <Check color="#fff" size={16} />}
          </View>
          <Text style={s.consentText}>
            Lu et approuvé les conditions de confidentialité et j’assure que toutes les informations renseignées sont correctes. En cas de fraude, j’assumerai l’entière responsabilité.
          </Text>
        </Pressable>

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

      <Modal visible={subtypePickerVisible} transparent animationType="slide" onRequestClose={() => setSubtypePickerVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Type de bien</Text>
              <TouchableOpacity onPress={() => setSubtypePickerVisible(false)}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={s.modalScroll}>
              {currentTypes.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.modalItem, subtype === t && s.modalItemActive]}
                  onPress={() => {
                    setSubtype(t);
                    setSubtypePickerVisible(false);
                  }}
                >
                  <Text style={[s.modalItemText, subtype === t && s.modalItemTextActive]}>{t}</Text>
                  {subtype === t && <Check size={20} color="#065f46" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={amenitiesPickerVisible} transparent animationType="slide" onRequestClose={() => setAmenitiesPickerVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Équipements</Text>
              <TouchableOpacity onPress={() => setAmenitiesPickerVisible(false)}>
                <Text style={s.modalDone}>Terminé</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={s.modalScroll}>
              {availableAmenities.map(a => {
                const active = amenities.includes(a.key);
                return (
                  <TouchableOpacity
                    key={a.key}
                    style={s.modalItem}
                    onPress={() => setAmenities(prev => active ? prev.filter(k => k !== a.key) : [...prev, a.key])}
                  >
                    <Text style={s.modalItemText}>{a.label}</Text>
                    <View style={[s.modalCheckbox, active && s.modalCheckboxActive]}>
                      {active && <Check size={16} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={categoryPickerVisible} transparent animationType="slide" onRequestClose={() => setCategoryPickerVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Catégorie de bien</Text>
              <TouchableOpacity onPress={() => setCategoryPickerVisible(false)}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={s.modalScroll}>
              {categories.map(c => (
                <TouchableOpacity
                  key={c.key}
                  style={[s.modalItem, category === c.key && s.modalItemActive]}
                  onPress={() => {
                    setCategory(c.key);
                    setSubtype(c.types[0]);
                    setAmenities([]);
                    setCategoryPickerVisible(false);
                  }}
                >
                  <Text style={[s.modalItemText, category === c.key && s.modalItemTextActive]}>{c.label}</Text>
                  {category === c.key && <Check size={20} color="#065f46" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={docTypePickerVisible} transparent animationType="slide" onRequestClose={() => setDocTypePickerVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Type de document</Text>
              <TouchableOpacity onPress={() => setDocTypePickerVisible(false)}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={s.modalScroll}>
              {docOptions.map(d => (
                <TouchableOpacity
                  key={d.key}
                  style={[s.modalItem, docType === d.key && s.modalItemActive]}
                  onPress={() => {
                    setDocType(d.key);
                    setDocTypePickerVisible(false);
                  }}
                >
                  <Text style={[s.modalItemText, docType === d.key && s.modalItemTextActive]}>{d.label}</Text>
                  {docType === d.key && <Check size={20} color="#065f46" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={transactionPickerVisible} transparent animationType="slide" onRequestClose={() => setTransactionPickerVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Transaction</Text>
              <TouchableOpacity onPress={() => setTransactionPickerVisible(false)}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={s.modalScroll}>
              <TouchableOpacity
                style={[s.modalItem, type === "sale" && s.modalItemActive]}
                onPress={() => {
                  setType("sale");
                  setTransactionPickerVisible(false);
                }}
              >
                <Text style={[s.modalItemText, type === "sale" && s.modalItemTextActive]}>Vente</Text>
                {type === "sale" && <Check size={20} color="#065f46" />}
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalItem, type === "rent" && rentPeriod === "monthly" && s.modalItemActive]}
                onPress={() => {
                  setType("rent");
                  setRentPeriod("monthly");
                  setTransactionPickerVisible(false);
                }}
              >
                <Text style={[s.modalItemText, type === "rent" && rentPeriod === "monthly" && s.modalItemTextActive]}>Location mensuelle</Text>
                {type === "rent" && rentPeriod === "monthly" && <Check size={20} color="#065f46" />}
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalItem, type === "rent" && rentPeriod === "daily" && s.modalItemActive]}
                onPress={() => {
                  setType("rent");
                  setRentPeriod("daily");
                  setTransactionPickerVisible(false);
                }}
              >
                <Text style={[s.modalItemText, type === "rent" && rentPeriod === "daily" && s.modalItemTextActive]}>Location journalière</Text>
                {type === "rent" && rentPeriod === "daily" && <Check size={20} color="#065f46" />}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={calendarVisible} transparent animationType="slide" onRequestClose={() => setCalendarVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Sélectionner une date</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={s.calendarContainer}>
              <View style={s.calendarRow}>
                <View style={s.calendarColumn}>
                  <Text style={s.calendarLabel}>Jour</Text>
                  <ScrollView style={s.calendarScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <TouchableOpacity
                        key={day}
                        style={[s.calendarItem, selectedDay === day && s.calendarItemActive]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[s.calendarItemText, selectedDay === day && s.calendarItemTextActive]}>
                          {String(day).padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={s.calendarColumn}>
                  <Text style={s.calendarLabel}>Mois</Text>
                  <ScrollView style={s.calendarScroll} showsVerticalScrollIndicator={false}>
                    {[
                      { num: 1, name: 'Janvier' },
                      { num: 2, name: 'Février' },
                      { num: 3, name: 'Mars' },
                      { num: 4, name: 'Avril' },
                      { num: 5, name: 'Mai' },
                      { num: 6, name: 'Juin' },
                      { num: 7, name: 'Juillet' },
                      { num: 8, name: 'Août' },
                      { num: 9, name: 'Septembre' },
                      { num: 10, name: 'Octobre' },
                      { num: 11, name: 'Novembre' },
                      { num: 12, name: 'Décembre' },
                    ].map(month => (
                      <TouchableOpacity
                        key={month.num}
                        style={[s.calendarItem, selectedMonth === month.num && s.calendarItemActive]}
                        onPress={() => setSelectedMonth(month.num)}
                      >
                        <Text style={[s.calendarItemText, selectedMonth === month.num && s.calendarItemTextActive]}>
                          {month.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={s.calendarColumn}>
                  <Text style={s.calendarLabel}>Année</Text>
                  <ScrollView style={s.calendarScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: new Date().getFullYear() + 10 - 1900 + 1 }, (_, i) => 1900 + i).reverse().map(year => (
                      <TouchableOpacity
                        key={year}
                        style={[s.calendarItem, selectedYear === year && s.calendarItemActive]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[s.calendarItemText, selectedYear === year && s.calendarItemTextActive]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <TouchableOpacity
                style={s.calendarConfirm}
                onPress={() => {
                  const formatted = `${String(selectedDay).padStart(2, '0')}-${String(selectedMonth).padStart(2, '0')}-${selectedYear}`;
                  setYearDate(formatted);
                  setCalendarVisible(false);
                }}
              >
                <Text style={s.calendarConfirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function Input(props: any) {
  return <TextInput {...props} style={[s.input, props.style]} />;
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 120 },
  section: { fontSize: 16, fontWeight: "800", marginTop: 4, marginBottom: 6 },
  hint: { color: "#6b7280", marginTop: 4 },
  previewText: { color: "#065f46", marginTop: 6, fontWeight: "600", fontSize: 14 },
  coverHint: { color: "#6b7280", fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10 },
  rowWrap: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  horizontalChips: { paddingVertical: 6, gap: 8 },
  label: { fontWeight: "800", marginTop: 4 },
  galleryStrip: { paddingVertical: 8, gap: 10 },
  photo: { width: 90, height: 90, borderRadius: 12, marginRight: 10 },
  cover: { width: 120, height: 90, borderRadius: 12, overflow: "hidden", marginRight: 8, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  coverEmpty: { backgroundColor: "#F9FAFB" },
  coverImg: { width: "100%", height: "100%" },
  galleryBtn: { paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "#0f5132", borderRadius: 12 },
  docBtn: { paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "#155e75", borderRadius: 12, flexDirection: "row", alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "600" },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", paddingHorizontal: 12, backgroundColor: "#fff" },
  flex1: { flex: 1 },
  currency: { width: 110 },
  btnLike: { justifyContent: "center" },
  textarea: { height: 120, textAlignVertical: "top", paddingTop: 12 },
  locationHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "#F3F4F6" },
  chipActive: { backgroundColor: "#064e3b" },
  chipTxt: { fontWeight: "700" },
  chipTxtActive: { color: "#fff", fontWeight: "800" },
  consent: { flexDirection: "row", gap: 10, alignItems: "flex-start", paddingVertical: 8 },
  consentActive: {},
  consentText: { flex: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  checkboxActive: { backgroundColor: "#065f46", borderColor: "#065f46" },
  cta: { marginTop: 12, height: 52, backgroundColor: "#1F2937", borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  ctaDisabled: { opacity: 0.6 },
  ctaTxt: { color: "#fff", fontWeight: "800" },
  error: { color: "#b91c1c", marginTop: 6, fontWeight: "700" },
  pickerButton: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", paddingHorizontal: 12, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pickerButtonText: { flex: 1, color: "#1f2937" },
  selectedAmenities: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  selectedChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#d1fae5", borderWidth: 1, borderColor: "#065f46" },
  selectedChipText: { fontSize: 12, fontWeight: "600", color: "#065f46" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "70%", paddingBottom: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  modalTitle: { fontSize: 18, fontWeight: "800" },
  modalClose: { fontSize: 24, color: "#6b7280" },
  modalDone: { fontSize: 16, fontWeight: "700", color: "#065f46" },
  modalScroll: { maxHeight: 400 },
  modalItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  modalItemActive: { backgroundColor: "#f0fdf4" },
  modalItemText: { fontSize: 16, color: "#1f2937" },
  modalItemTextActive: { fontWeight: "700", color: "#065f46" },
  modalCheckbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  modalCheckboxActive: { backgroundColor: "#065f46", borderColor: "#065f46" },
  keyboardDismiss: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  calendarContainer: { paddingHorizontal: 20, paddingVertical: 16 },
  calendarRow: { flexDirection: "row", gap: 12, height: 300 },
  calendarColumn: { flex: 1 },
  calendarLabel: { fontSize: 14, fontWeight: "700", color: "#1f2937", marginBottom: 8, textAlign: "center" },
  calendarScroll: { flex: 1 },
  calendarItem: { paddingVertical: 12, paddingHorizontal: 8, alignItems: "center", borderRadius: 8, marginBottom: 4 },
  calendarItemActive: { backgroundColor: "#f0fdf4" },
  calendarItemText: { fontSize: 15, color: "#1f2937" },
  calendarItemTextActive: { fontWeight: "700", color: "#065f46" },
  calendarConfirm: { marginTop: 16, height: 48, backgroundColor: "#065f46", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  calendarConfirmText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});