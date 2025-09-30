import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Image, KeyboardAvoidingView, Platform, Modal, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Save, MapPin, Check, FilePlus, ChevronDown } from "lucide-react-native";
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
  const [charges, setCharges] = useState<string>("");
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
        photos: photos.length ? photos : (cover ? [cover] : []),
        category,
        subtype,
        amenities,
        yearDate,
        charges,
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
  }, [title, type, price, currency, city, country, surface, beds, baths, photos, cover, rentPeriod, category, subtype, amenities, yearDate, charges, docType, docTypeOther, exactAddress, orientation, landmark, phone, attachments.length, consent, desc, onSubmit]);

  const currentTypes = useMemo(() => {
    const found = categories.find(c => c.key === category);
    return found ? found.types : [];
  }, [category]);

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
        {!!formattedPrice && <Text style={s.hint}>Aperçu: {formattedPrice}{type === "rent" ? (rentPeriod === "daily" ? " / jour" : " / mois") : ""}</Text>}

        <Text style={s.label}>Charges</Text>
        <Input value={charges} onChangeText={setCharges} placeholder={type === "rent" ? (rentPeriod === "daily" ? "ex: 5 000 XOF / jour" : "ex: 50 USD / mois") : "ex: 50 USD / mois"} testID="input-charges" />

        <Text style={s.label}>Surface / Chambres / SDB</Text>
        <View style={s.row}>
          <Input style={s.flex1} value={surface} onChangeText={setSurface} placeholder="m²" keyboardType="numeric" testID="input-surface" />
          <Input style={s.flex1} value={beds} onChangeText={setBeds} placeholder="chambres" keyboardType="numeric" testID="input-beds" />
          <Input style={s.flex1} value={baths} onChangeText={setBaths} placeholder="SDB" keyboardType="numeric" testID="input-baths" />
        </View>

        <Text style={s.label}>Point fort (équipements)</Text>
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
        <Input value={yearDate} onChangeText={setYearDate} placeholder="ex: 15-03-2020" keyboardType="numbers-and-punctuation" testID="input-yeardate" />
        {yearDate && !validateDate(yearDate) && <Text style={s.error}>Format requis: JJ-MM-AAAA (ex: 15-03-2020)</Text>}

        <Text style={s.label}>Type de document</Text>
        <View style={s.rowWrap}>
          {docOptions.map(d => (
            <Pressable key={d.key} onPress={() => setDocType(d.key)} style={[s.chip, docType === d.key && s.chipActive]} testID={`doc-${d.key}`}>
              <Text style={[s.chipTxt, docType === d.key && s.chipTxtActive]}>{d.label}</Text>
            </Pressable>
          ))}
        </View>
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
  segmentRow: { flexDirection: "row", gap: 10, alignItems: "center", flexWrap: "wrap" },
  segBtn: { paddingHorizontal: 14, height: 36, borderRadius: 999, backgroundColor: "#F3F4F6", justifyContent: "center" },
  segBtnActive: { backgroundColor: "#064e3b" },
  segTxt: { fontWeight: "700" },
  segTxtActive: { color: "#fff", fontWeight: "800" },
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
});