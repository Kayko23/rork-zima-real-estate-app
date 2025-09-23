import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/hooks/useAppStore";

type Language = "fr" | "en" | "pt";

const LANGUAGES: { code: Language; title: string; subtitle: string }[] = [
  { code: "fr", title: "Français", subtitle: "French" },
  { code: "en", title: "English", subtitle: "English" },
  { code: "pt", title: "Português", subtitle: "Portuguese" },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { language, setLanguage } = useApp();
  const [selected, setSelected] = useState<Language | null>(language);

  const canContinue = useMemo(() => !!selected, [selected]);

  function onContinue() {
    if (!selected) return;
    setLanguage(selected);
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top progress */}
      <View style={styles.progressWrap}>
        <Text style={styles.progressLabel}>Configuration</Text>
        <Text style={styles.progressPct}>100%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={styles.progressBarFg} />
      </View>

      <Text style={styles.title}>Choose your language</Text>
      <Text style={styles.subtitle}>Select the interface language</Text>

      <View style={styles.spacer} />

      {LANGUAGES.map((lang) => {
        const active = selected === lang.code;
        return (
          <Pressable
            key={lang.code}
            onPress={() => setSelected(lang.code)}
            style={[styles.card, active && styles.cardActive]}
            testID={`language-${lang.code}`}
          >
            <View>
              <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                {lang.title}
              </Text>
              <Text style={styles.cardSub}>{lang.subtitle}</Text>
            </View>
            <View style={[styles.check, active && styles.checkActive]}>
              {active && (
                <Text style={styles.checkText}>✓</Text>
              )}
            </View>
          </Pressable>
        );
      })}

      <Text style={styles.hint}>You can change this later in Settings</Text>

      <Pressable
        disabled={!canContinue}
        onPress={onContinue}
        style={[styles.cta, !canContinue && styles.ctaDisabled]}
        testID="continue-button"
      >
        <Text style={[styles.ctaText, !canContinue && styles.ctaTextDisabled]}>
          Start using ZIMA
        </Text>
      </Pressable>

      <Text style={[styles.hint, styles.hintBottom]}>
        You can change this later in Settings
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  progressWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "600",
  },
  progressPct: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "#E6E8EB",
  },
  progressBarFg: {
    width: "100%",
    height: 4,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  title: {
    marginTop: 32,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#475569",
    lineHeight: 22,
  },
  card: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E8EB",
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardSub: {
    color: "#64748B",
    marginTop: 2,
    fontSize: 14,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hint: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 20,
    fontSize: 14,
    lineHeight: 20,
  },
  cta: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  ctaDisabled: {
    backgroundColor: "#E6E8EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  ctaText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  spacer: {
    height: 24,
  },
  cardTitleActive: {
    color: Colors.primary,
  },
  checkText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  ctaTextDisabled: {
    opacity: 0.5,
  },
  hintBottom: {
    marginTop: 8,
  },
});