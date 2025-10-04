import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { AccountForm, ProfileForm, DocsForm, accountSchema, createProfileSchemaForRole, createDocsSchemaForRole } from "@/lib/signupSchema";
import DocItem from "@/components/upload/DocItem";
import { authApi } from "@/lib/authApi";
import { useSession } from "@/hooks/useSession";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CountryPicker from "@/components/inputs/CountryPicker";
import { Calendar, ChevronDown } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BottomSheet from "@/components/BottomSheet";
import { loadCitiesByCountry, CityItem } from "@/data/cities";
import { normalize } from "@/utils/text";

export default function SignupWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [cityQuery, setCityQuery] = useState("");

  // Étape 1 — Compte
  const f1 = useForm<AccountForm>({ 
    defaultValues: { role: "user" } as any 
  });
  
  // Étape 2 — Profil
  const f2 = useForm<ProfileForm>({
    defaultValues: {
      country: "",
      city: "",
      birthdate: "",
      companyName: "",
      category: "",
      languages: [],
    },
  });
  
  // Étape 3 — Docs
  const f3 = useForm<DocsForm>({ 
    defaultValues: { 
      idFront: null,
      idBack: null,
      proofAddress: null,
      proRegistration: null,
      proLicense: null 
    } 
  });

  const { setSession } = useSession();

  const selectedCountry = f2.watch("country");

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!selectedCountry) {
        setCities([]);
        return;
      }
      try {
        const data = await loadCitiesByCountry(selectedCountry);
        if (mounted) setCities(data);
      } catch (error) {
        console.error("Error loading cities:", error);
        if (mounted) setCities([]);
      }
    })();
    return () => { mounted = false; };
  }, [selectedCountry]);

  const filteredCities = React.useMemo(() => {
    const q = normalize(cityQuery);
    if (!q) return cities.slice(0, 50);
    return cities
      .filter(c => normalize(c.n).includes(q) || (c.a && normalize(c.a).includes(q)))
      .slice(0, 100);
  }, [cityQuery, cities]);

  const next = async () => {
    try {
      if (step === 1) {
        const isValid = await f1.trigger();
        if (!isValid) {
          console.log("Step 1 validation failed:", f1.formState.errors);
          return;
        }
      }
      if (step === 2) {
        // Valider selon le rôle sélectionné
        const role = f1.getValues("role");
        const requiredFields = ["country", "city"];
        if (role === "provider") {
          requiredFields.push("companyName", "category");
        }
        const isValid = await f2.trigger(requiredFields as any);
        if (!isValid) {
          console.log("Step 2 validation failed:", f2.formState.errors);
          return;
        }
      }
      if (step === 3) {
        // Pour les particuliers, on peut passer cette étape même sans documents
        const role = f1.getValues("role");
        if (role === "user") {
          // Pas de validation stricte pour les particuliers
        } else {
          // Validation pour les prestataires
          const isValid = await f3.trigger();
          if (!isValid) {
            console.log("Step 3 validation failed:", f3.formState.errors);
            return;
          }
        }
      }
      setStep((s) => (s < 4 ? ((s + 1) as any) : s));
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const prev = () => setStep((s) => (s > 1 ? ((s - 1) as any) : s));

  const submit = async () => {
    try {
      setIsSubmitting(true);

      const acc = f1.getValues();
      const pro = f2.getValues();
      const docs = f3.getValues();
      const role = acc.role;

      // Validation avec schémas conditionnels
      const validatedAccount = accountSchema.parse(acc);
      const profileSchema = createProfileSchemaForRole(role);
      const docsSchema = createDocsSchemaForRole(role);
      
      const validatedProfile = profileSchema.parse(pro);
      const validatedDocs = docsSchema.parse(docs);

      // Upload des documents s'ils existent
      const uploads: Record<string, any> = {};
      if (validatedDocs) {
        for (const [key, file] of Object.entries(validatedDocs)) {
          if (file && typeof file === 'object' && 'uri' in file) {
            try {
              uploads[key] = await authApi.upload(file as any);
            } catch (uploadError) {
              console.warn(`Failed to upload ${key}:`, uploadError);
            }
          }
        }
      }

      const payload = { 
        ...validatedAccount, 
        ...validatedProfile, 
        documents: uploads 
      };

      console.log("Submitting registration:", payload);
      const { token, user } = await authApi.register(payload);
      await setSession(user, token);
      router.replace("/");
    } catch (e: any) {
      let errorMessage = "Une erreur s'est produite lors de l'inscription";
      
      if (e?.issues && Array.isArray(e.issues)) {
        const issues = e.issues.map((i: any) => {
          const field = i.path?.join('.') || 'Champ';
          return `${field}: ${i.message}`;
        });
        errorMessage = issues.join('\n');
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      Alert.alert('Erreur d\'inscription', errorMessage);
      console.error("Registration error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
        <View style={styles.wrap}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.step}>Étape {step} / 4</Text>

          {step === 1 && (
            <View>
              <Text style={styles.h2}>Compte</Text>

              <Text style={styles.label}>Vous êtes</Text>
              <View style={styles.segment}>
                <Pressable 
                  onPress={() => f1.setValue("role", "user")} 
                  style={[styles.segBtn, f1.watch("role") === "user" && styles.segActive]}
                  testID="role-user-button"
                >
                  <Text style={[styles.segTxt, f1.watch("role") === "user" && styles.segTxtA]}>
                    Particulier
                  </Text>
                </Pressable>
                <Pressable 
                  onPress={() => f1.setValue("role", "provider")} 
                  style={[styles.segBtn, f1.watch("role") === "provider" && styles.segActive]}
                  testID="role-provider-button"
                >
                  <Text style={[styles.segTxt, f1.watch("role") === "provider" && styles.segTxtA]}>
                    Prestataire
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Email</Text>
              <Controller 
                control={f1.control} 
                name="email" 
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    style={styles.input} 
                    autoCapitalize="none" 
                    keyboardType="email-address"
                    value={value ?? ""} 
                    onChangeText={onChange} 
                    placeholder="nom@exemple.com" 
                    testID="signup-email-input"
                  />
                )}
              />

              <Text style={styles.label}>Téléphone</Text>
              <Controller 
                control={f1.control} 
                name="phone" 
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    style={styles.input} 
                    keyboardType="phone-pad" 
                    value={value ?? ""} 
                    onChangeText={onChange} 
                    placeholder="+225…" 
                    testID="signup-phone-input"
                  />
                )}
              />

              <Text style={styles.label}>Mot de passe</Text>
              <Controller 
                control={f1.control} 
                name="password" 
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    style={styles.input} 
                    secureTextEntry 
                    value={value} 
                    onChangeText={onChange} 
                    placeholder="••••••••" 
                    testID="signup-password-input"
                  />
                )}
              />

              <Text style={styles.label}>Prénom</Text>
              <Controller 
                control={f1.control} 
                name="firstName" 
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    style={styles.input} 
                    value={value ?? ""} 
                    onChangeText={onChange} 
                    testID="signup-firstname-input"
                  />
                )}
              />

              <Text style={styles.label}>Nom</Text>
              <Controller 
                control={f1.control} 
                name="lastName" 
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    style={styles.input} 
                    value={value ?? ""} 
                    onChangeText={onChange} 
                    testID="signup-lastname-input"
                  />
                )}
              />
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.h2}>Profil</Text>
              
              <Text style={styles.label}>Pays</Text>
              <Controller 
                control={f2.control} 
                name="country"
                rules={{ required: true, minLength: 2 }} 
                render={({ field: { onChange, value } }) => (
                  <CountryPicker
                    value={value ?? ""}
                    onChange={onChange}
                    placeholder="Sélectionner un pays"
                  />
                )}
              />

              <Text style={styles.label}>Ville</Text>
              <Controller 
                control={f2.control} 
                name="city"
                rules={{ required: true, minLength: 1 }} 
                render={({ field: { onChange, value } }) => (
                  <Pressable 
                    onPress={() => {
                      if (selectedCountry) {
                        setShowCityPicker(true);
                      } else {
                        Alert.alert("Sélectionnez d'abord un pays", "Veuillez choisir un pays avant de sélectionner une ville.");
                      }
                    }}
                    style={styles.cityPickerButton}
                    testID="signup-city-picker-button"
                  >
                    <Text style={[styles.cityPickerText, !value && styles.cityPickerPlaceholder]}>
                      {value || "Sélectionner une ville"}
                    </Text>
                    <ChevronDown size={20} color="#6B7280" />
                  </Pressable>
                )}
              />

              <Text style={styles.label}>Date de naissance (optionnel)</Text>
              <Controller 
                control={f2.control} 
                name="birthdate" 
                render={({ field: { onChange, value } }) => (
                  <View>
                    <Pressable 
                      onPress={() => setShowDatePicker(true)}
                      style={styles.dateInputContainer}
                    >
                      <TextInput 
                        style={styles.dateInput} 
                        value={value ?? ""} 
                        onChangeText={onChange} 
                        placeholder="JJ/MM/AAAA" 
                        testID="signup-birthdate-input"
                        editable={false}
                        pointerEvents="none"
                      />
                      <View style={styles.calendarIcon}>
                        <Calendar size={20} color="#0B3C2F" />
                      </View>
                    </Pressable>
                    {showDatePicker && (
                      <DateTimePicker
                        value={value ? (() => {
                          const parts = value.split('/');
                          if (parts.length === 3) {
                            const [day, month, year] = parts;
                            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                          }
                          return new Date(2000, 0, 1);
                        })() : new Date(2000, 0, 1)}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(Platform.OS === "ios");
                          if (event.type === 'set' && selectedDate) {
                            const day = String(selectedDate.getDate()).padStart(2, '0');
                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                            const year = selectedDate.getFullYear();
                            onChange(`${day}/${month}/${year}`);
                          }
                        }}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                        testID="signup-date-picker"
                      />
                    )}
                  </View>
                )}
              />

              {f1.watch("role") === "provider" && (
                <>
                  <Text style={styles.label}>Nom de l&apos;entreprise</Text>
                  <Controller 
                    control={f2.control} 
                    name="companyName" 
                    render={({ field: { onChange, value } }) => (
                      <TextInput 
                        style={styles.input} 
                        value={value ?? ""} 
                        onChangeText={onChange} 
                        testID="signup-company-input"
                      />
                    )}
                  />

                  <Text style={styles.label}>Catégorie de services</Text>
                  <Controller 
                    control={f2.control} 
                    name="category" 
                    render={({ field: { onChange, value } }) => (
                      <TextInput 
                        style={styles.input} 
                        value={value ?? ""} 
                        onChangeText={onChange} 
                        placeholder="Agent, Gestionnaire, …" 
                        testID="signup-category-input"
                      />
                    )}
                  />
                </>
              )}
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.h2}>Documents & pièces</Text>
              
              {f1.watch("role") === "user" ? (
                <View style={styles.optionalSection}>
                  <Text style={styles.optionalTitle}>Documents optionnels</Text>
                  <Text style={styles.optionalSubtitle}>
                    En tant que particulier, vous pouvez ajouter ces documents maintenant ou plus tard dans votre profil.
                  </Text>
                </View>
              ) : (
                <View style={styles.requiredSection}>
                  <Text style={styles.requiredTitle}>Documents requis</Text>
                  <Text style={styles.requiredSubtitle}>
                    En tant que prestataire, ces documents sont nécessaires pour valider votre profil.
                  </Text>
                </View>
              )}
              
              <DocItem 
                label={`Pièce d'identité (recto)${f1.watch("role") === "user" ? " - Optionnel" : ""}`}
                value={f3.watch("idFront")} 
                onChange={(f) => f3.setValue("idFront", f)} 
              />
              
              <DocItem 
                label={`Pièce d'identité (verso)${f1.watch("role") === "user" ? " - Optionnel" : ""}`}
                value={f3.watch("idBack")} 
                onChange={(f) => f3.setValue("idBack", f)} 
              />
              
              <DocItem 
                label={`Justificatif de domicile (< 3 mois)${f1.watch("role") === "user" ? " - Optionnel" : ""}`}
                value={f3.watch("proofAddress")} 
                onChange={(f) => f3.setValue("proofAddress", f)} 
              />

              {f1.watch("role") === "provider" && (
                <>
                  <DocItem 
                    label="Registre Commerce / RCCM (PDF ou image) - Optionnel" 
                    value={f3.watch("proRegistration")} 
                    onChange={(f) => f3.setValue("proRegistration", f)} 
                  />
                  
                  <DocItem 
                    label="Licence / Agrément pro - Optionnel" 
                    value={f3.watch("proLicense")} 
                    onChange={(f) => f3.setValue("proLicense", f)} 
                  />
                </>
              )}

              <Text style={styles.docNote}>
                Formats acceptés : PDF, JPG, PNG. Taille max conseillée : 10 Mo par fichier.
              </Text>
            </View>
          )}

          {step === 4 && (
            <View>
              <Text style={styles.h2}>Conditions</Text>
              <Text style={styles.conditionsText}>
                En créant un compte, vous acceptez les Conditions d&apos;utilisation et la Politique de confidentialité de Zima.
              </Text>
            </View>
          )}

          {/* City Picker Bottom Sheet */}
          <BottomSheet visible={showCityPicker} onClose={() => setShowCityPicker(false)} height={0.75}>
            <View style={styles.sheetContent}>
              <Text style={styles.sheetTitle}>Sélectionner une ville</Text>
              <TextInput
                placeholder="Rechercher une ville..."
                value={cityQuery}
                onChangeText={setCityQuery}
                style={styles.searchInput}
                autoFocus
              />
              <FlatList
                data={filteredCities}
                keyExtractor={(item, idx) => item.n + idx}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      f2.setValue("city", item.n);
                      setShowCityPicker(false);
                      setCityQuery("");
                    }}
                    style={styles.cityRow}
                  >
                    <Text style={styles.cityName}>{item.n}</Text>
                    {!!item.a && <Text style={styles.cityAlt}>{item.a}</Text>}
                  </Pressable>
                )}
                style={styles.cityList}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                      {selectedCountry ? "Aucune ville trouvée" : "Sélectionnez d'abord un pays"}
                    </Text>
                  </View>
                }
              />
            </View>
          </BottomSheet>

          {/* Boutons bas */}
          <View style={styles.footer}>
            {step > 1 ? (
              <Pressable style={styles.btnGhost} onPress={prev} testID="signup-back-button">
                <Text style={styles.btnGhostTxt}>Retour</Text>
              </Pressable>
            ) : (
              <View style={styles.spacer} />
            )}

            {step < 4 ? (
              <Pressable style={styles.btn} onPress={next} testID="signup-next-button">
                <Text style={styles.btnTxt}>Continuer</Text>
              </Pressable>
            ) : (
              <Pressable 
                style={[styles.btn, isSubmitting && styles.btnDisabled]} 
                onPress={submit} 
                disabled={isSubmitting}
                testID="signup-submit-button"
              >
                <Text style={styles.btnTxt}>
                  {isSubmitting ? "Création…" : "Créer le compte"}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F6F8FA" 
  },
  scrollContent: {
    paddingBottom: 24,
  },
  wrap: { 
    flex: 1, 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#0B3C2F" 
  },
  step: { 
    color: "#6B7280", 
    marginTop: 4, 
    marginBottom: 12 
  },
  h2: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: "#0B3C2F", 
    marginBottom: 8 
  },
  label: { 
    marginTop: 10, 
    color: "#51626F", 
    fontWeight: "700" 
  },
  input: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: "#E7EDF3", 
    paddingHorizontal: 12, 
    height: 48, 
    marginTop: 6 
  },
  dateInputContainer: {
    position: "relative" as const,
    marginTop: 6,
  },
  dateInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7EDF3",
    paddingHorizontal: 12,
    paddingRight: 44,
    height: 48,
    color: "#0B3C2F",
  },
  calendarIcon: {
    position: "absolute" as const,
    right: 12,
    top: 14,
    zIndex: 1,
  },
  segment: { 
    flexDirection: "row", 
    backgroundColor: "#E9F2EE", 
    borderRadius: 12, 
    padding: 4, 
    gap: 6, 
    marginTop: 6 
  },
  segBtn: { 
    flex: 1, 
    borderRadius: 10, 
    paddingVertical: 10, 
    alignItems: "center" 
  },
  segActive: { 
    backgroundColor: "#0B3C2F" 
  },
  segTxt: { 
    fontWeight: "700", 
    color: "#0B3C2F" 
  },
  segTxtA: { 
    color: "#fff" 
  },
  docNote: { 
    color: "#6B7280", 
    marginTop: 8,
    fontSize: 12,
  },
  conditionsText: { 
    color: "#334155", 
    marginTop: 8,
    lineHeight: 20,
  },
  footer: { 
    marginTop: 16, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  btn: { 
    height: 48, 
    minWidth: 160, 
    borderRadius: 12, 
    backgroundColor: "#0B3C2F", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnTxt: { 
    color: "#fff", 
    fontWeight: "800" 
  },
  btnGhost: { 
    height: 48, 
    width: 100, 
    borderRadius: 12, 
    backgroundColor: "#FFFFFF", 
    alignItems: "center", 
    justifyContent: "center", 
    borderWidth: 1, 
    borderColor: "#E7EDF3" 
  },
  btnGhostTxt: { 
    color: "#0B3C2F", 
    fontWeight: "800" 
  },
  spacer: {
    width: 100,
  },
  optionalSection: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0EA5E9",
  },
  optionalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0369A1",
    marginBottom: 4,
  },
  optionalSubtitle: {
    fontSize: 14,
    color: "#0369A1",
    lineHeight: 20,
  },
  requiredSection: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  requiredTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  requiredSubtitle: {
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
  },
  cityPickerButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7EDF3",
    paddingHorizontal: 12,
    height: 48,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cityPickerText: {
    fontSize: 16,
    color: "#0B3C2F",
    fontWeight: "600",
  },
  cityPickerPlaceholder: {
    color: "#9CA3AF",
    fontWeight: "400",
  },
  sheetContent: {
    flex: 1,
    paddingTop: 8,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0B3C2F",
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  cityList: {
    flex: 1,
  },
  cityRow: {
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cityName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B3C2F",
  },
  cityAlt: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "600",
  },
});