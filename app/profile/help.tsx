import React from "react";
import { View, Text, Pressable, StyleSheet, Linking, ScrollView } from "react-native";
import { LifeBuoy, Mail, MessageCircle, Phone, HelpCircle, AlertCircle } from "lucide-react-native";
import { router } from "expo-router";
import Colors from "@/constants/colors";

export default function HelpScreen() {
  const supportOptions = [
    {
      id: "center",
      title: "Centre d'aide",
      description: "Accédez à toutes les ressources d'aide",
      icon: MessageCircle,
      color: Colors.primary,
      action: () => router.push("/support"),
    },
    {
      id: "email",
      title: "Email",
      description: "support@zima.app",
      icon: Mail,
      color: Colors.primary,
      action: () => Linking.openURL("mailto:support@zima.app?subject=Demande de support"),
    },
    {
      id: "phone",
      title: "Téléphone",
      description: "+225 07 09 09 09 09",
      icon: Phone,
      color: Colors.primary,
      action: () => Linking.openURL("tel:+2250709090909"),
    },
    {
      id: "faq",
      title: "FAQ",
      description: "Questions fréquemment posées",
      icon: HelpCircle,
      color: Colors.text.secondary,
      action: () => console.log("FAQ - Coming soon"),
    },
    {
      id: "report",
      title: "Signaler un problème",
      description: "Rapportez un bug ou une erreur",
      icon: AlertCircle,
      color: "#E53E3E",
      action: () => Linking.openURL("mailto:support@zima.app?subject=Signalement de problème"),
    },
  ];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.header}>
        <View style={s.iconWrapper}>
          <LifeBuoy size={48} color={Colors.primary} />
        </View>
        <Text style={s.title}>Comment pouvons-nous vous aider ?</Text>
        <Text style={s.desc}>
          Notre équipe est disponible pour répondre à toutes vos questions
        </Text>
      </View>

      <View style={s.optionsContainer}>
        {supportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Pressable
              key={option.id}
              style={s.optionCard}
              onPress={option.action}
              android_ripple={{ color: Colors.primary + "20" }}
            >
              <View style={[s.iconContainer, { backgroundColor: option.color + "15" }]}>
                <Icon size={24} color={option.color} />
              </View>
              <View style={s.optionContent}>
                <Text style={s.optionTitle}>{option.title}</Text>
                <Text style={s.optionDescription}>{option.description}</Text>
              </View>
            </Pressable>
          );
        })}
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
    marginBottom: 24,
    paddingTop: 8,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  desc: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
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