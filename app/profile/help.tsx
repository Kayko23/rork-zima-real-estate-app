import React from "react";
import { View, Text, Pressable, StyleSheet, Linking, ScrollView } from "react-native";

import Colors from "@/constants/colors";

export default function HelpScreen() {
  const supportOptions = [
    {
      id: "whatsapp",
      title: "WhatsApp",
      description: "Chattez avec notre équipe support",
      action: () => Linking.openURL("https://wa.me/2250709090909?text=Bonjour, j'ai besoin d'aide"),
    },
    {
      id: "email",
      title: "Email",
      description: "support@zima.app",
      action: () => Linking.openURL("mailto:support@zima.app?subject=Demande de support"),
    },
    {
      id: "phone",
      title: "Téléphone",
      description: "+225 07 09 09 09 09",
      action: () => Linking.openURL("tel:+2250709090909"),
    },
    {
      id: "faq",
      title: "FAQ",
      description: "Questions fréquemment posées",
      action: () => console.log("FAQ - Coming soon"),
    },
    {
      id: "documentation",
      title: "Documentation",
      description: "Guides et tutoriels",
      action: () => console.log("Documentation - Coming soon"),
    },
    {
      id: "report",
      title: "Signaler un problème",
      description: "Rapportez un bug ou une erreur",
      action: () => Linking.openURL("mailto:support@zima.app?subject=Signalement de problème"),
    },
  ];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.header}>
        <Text style={s.title}>Comment pouvons-nous vous aider ?</Text>
        <Text style={s.desc}>
          Notre équipe est disponible pour répondre à toutes vos questions
        </Text>
      </View>

      <View style={s.optionsContainer}>
        {supportOptions.map((option) => (
          <Pressable
            key={option.id}
            style={s.optionCard}
            onPress={option.action}
            android_ripple={{ color: Colors.primary + "20" }}
          >
            <View style={s.optionContent}>
              <Text style={s.optionTitle}>{option.title}</Text>
              <Text style={s.optionDescription}>{option.description}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={s.infoBox}>
        <Text style={s.infoTitle}>Heures d&apos;ouverture</Text>
        <Text style={s.infoText}>Lundi - Vendredi: 8h00 - 18h00</Text>
        <Text style={s.infoText}>Samedi: 9h00 - 14h00</Text>
        <Text style={s.infoText}>Dimanche: Fermé</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.text.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  desc: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  infoBox: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.background.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.background.primary,
    marginBottom: 6,
    opacity: 0.9,
  },
});