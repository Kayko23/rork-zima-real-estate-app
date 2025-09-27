import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { AccountForm, ProfileForm, DocsForm, accountSchema, profileSchema, docsSchema } from "@/lib/signupSchema";
import DocItem from "@/components/upload/DocItem";
import { authApi } from "@/lib/authApi";
import { useSession } from "@/hooks/useSession";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } as any,
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

  const next = async () => {
    try {
      if (step === 1) {
        const isValid = await f1.trigger();
        if (!isValid) return;
      }
      if (step === 2) {
        const isValid = await f2.trigger(["country", "city"]);
        if (!isValid) return;
      }
      if (step === 3) {
        const isValid = await f3.trigger();
        if (!isValid) return;
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

      const okAccount = await f1.trigger();
      const okProfile = await f2.trigger(["country", "city"]);
      const okDocs = await f3.trigger();
      if (!okAccount || !okProfile || !okDocs) {
        if (!okProfile) setStep(2);
        if (!okAccount) setStep(1);
        return;
      }

      const acc = f1.getValues();
      const pro = f2.getValues();
      const docs = f3.getValues();

      const validatedAccount = accountSchema.parse(acc);
      const validatedProfile = profileSchema.parse(pro);
      const validatedDocs = docsSchema.parse(docs);

      const uploads: Record<string, any> = {};
      for (const k of Object.keys(validatedDocs) as (keyof DocsForm)[]) {
        const file = validatedDocs[k];
        if (file) {
          uploads[k] = await authApi.upload(file);
        }
      }

      const payload = { 
        ...validatedAccount, 
        ...validatedProfile, 
        documents: uploads 
      };

      const { token, user } = await authApi.register(payload);
      await setSession(user, token);
      router.replace("/");
    } catch (e: any) {
      const issues: string[] = Array.isArray(e?.issues)
        ? e.issues.map((i: any) => `${i.path?.join('.') ?? ''}: ${i.message}`)
        : [e?.message ?? 'Réessayez'];
      Alert.alert('Inscription', issues.join('\n'));
      console.error("Registration error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                  <TextInput 
                    style={styles.input} 
                    value={value ?? ""} 
                    onChangeText={onChange} 
                    placeholder="Côte d'Ivoire…" 
                    testID="signup-country-input"
                  />
                )}
              />

              <Text style={styles.label}>Ville</Text>
              <Controller 
                control={f2.control} 
                name="city"
                rules={{ required: true, minLength: 1 }} 
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    style={styles.input} 
                    value={value ?? ""} 
                    onChangeText={onChange} 
                    placeholder="Abidjan…" 
                    testID="signup-city-input"
                  />
                )}
              />

              <Text style={styles.label}>Date de naissance (optionnel)</Text>
              <Controller 
                control={f2.control} 
                name="birthdate" 
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    style={styles.input} 
                    value={value ?? ""} 
                    onChangeText={onChange} 
                    placeholder="YYYY-MM-DD" 
                    testID="signup-birthdate-input"
                  />
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
              
              <DocItem 
                label="Pièce d'identité (recto)" 
                value={f3.watch("idFront")} 
                onChange={(f) => f3.setValue("idFront", f)} 
              />
              
              <DocItem 
                label="Pièce d'identité (verso)" 
                value={f3.watch("idBack")} 
                onChange={(f) => f3.setValue("idBack", f)} 
              />
              
              <DocItem 
                label="Justificatif de domicile (< 3 mois)" 
                value={f3.watch("proofAddress")} 
                onChange={(f) => f3.setValue("proofAddress", f)} 
              />

              {f1.watch("role") === "provider" && (
                <>
                  <DocItem 
                    label="Registre Commerce / RCCM (PDF ou image)" 
                    value={f3.watch("proRegistration")} 
                    onChange={(f) => f3.setValue("proRegistration", f)} 
                  />
                  
                  <DocItem 
                    label="Licence / Agrément pro" 
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
});