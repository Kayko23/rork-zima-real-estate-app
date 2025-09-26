import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { authApi } from "@/lib/authApi";
import { useSession } from "@/hooks/useSession";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type LoginForm = { 
  emailOrPhone: string; 
  password: string; 
};

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({ 
    defaultValues: { emailOrPhone: "", password: "" } 
  });
  const { setSession } = useSession();
  const [busy, setBusy] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    try {
      setBusy(true);
      
      if (!data.emailOrPhone.trim() || !data.password.trim()) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs");
        return;
      }

      const payload = data.emailOrPhone.includes("@")
        ? { email: data.emailOrPhone.trim(), password: data.password.trim() }
        : { phone: data.emailOrPhone.trim(), password: data.password.trim() };
        
      const { token, user } = await authApi.login(payload);
      await setSession(user, token);
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Connexion échouée", e?.message ?? "Vérifiez vos identifiants");
    } finally { 
      setBusy(false); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.wrap}>
          <Text style={styles.title}>Se connecter</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre compte ZIMA</Text>

          <Text style={styles.label}>Email ou téléphone</Text>
          <Controller
            control={control} 
            name="emailOrPhone"
            rules={{ required: "Ce champ est requis" }}
            render={({ field: { onChange, value } }) => (
              <TextInput 
                autoCapitalize="none" 
                keyboardType="email-address"
                style={[styles.input, errors.emailOrPhone && styles.inputError]} 
                value={value} 
                onChangeText={onChange} 
                placeholder="ex: nom@site.com ou +225…" 
                testID="login-email-phone-input"
              />
            )}
          />
          {errors.emailOrPhone && (
            <Text style={styles.errorText}>{errors.emailOrPhone.message}</Text>
          )}

          <Text style={styles.label}>Mot de passe</Text>
          <Controller
            control={control} 
            name="password"
            rules={{ 
              required: "Ce champ est requis", 
              minLength: { value: 6, message: "Minimum 6 caractères" } 
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput 
                secureTextEntry 
                style={[styles.input, errors.password && styles.inputError]} 
                value={value} 
                onChangeText={onChange} 
                placeholder="••••••••" 
                testID="login-password-input"
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          <Pressable 
            style={[styles.btn, busy && styles.btnDisabled]} 
            disabled={busy} 
            onPress={handleSubmit(onSubmit)}
            testID="login-submit-button"
          >
            <Text style={styles.btnTxt}>{busy ? "Connexion…" : "Se connecter"}</Text>
          </Pressable>

          <Pressable 
            onPress={() => router.push("/signup" as any)} 
            hitSlop={8}
            testID="login-signup-link"
          >
            <Text style={styles.link}>Créer un compte</Text>
          </Pressable>
          
          <Pressable 
            onPress={() => {
              Alert.alert("Mot de passe oublié", "Cette fonctionnalité sera bientôt disponible");
            }} 
            hitSlop={8}
          >
            <Text style={styles.linkSecondary}>Mot de passe oublié ?</Text>
          </Pressable>
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
    flexGrow: 1,
  },
  wrap: { 
    flex: 1, 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#0B3C2F", 
    marginBottom: 8 
  },
  subtitle: {
    fontSize: 16,
    color: "#51626F",
    marginBottom: 24,
  },
  label: { 
    marginTop: 16, 
    marginBottom: 6,
    color: "#51626F", 
    fontWeight: "700" 
  },
  input: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: "#E7EDF3", 
    paddingHorizontal: 12, 
    height: 48 
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  btn: { 
    marginTop: 24, 
    height: 52, 
    borderRadius: 14, 
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
  link: { 
    marginTop: 20, 
    color: "#0B3C2F", 
    fontWeight: "800",
    textAlign: "center",
  },
  linkSecondary: { 
    marginTop: 12, 
    color: "#6B7280", 
    fontWeight: "700",
    textAlign: "center",
  },
});