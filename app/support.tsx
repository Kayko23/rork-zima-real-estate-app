import { Stack } from "expo-router";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Linking } from "react-native";
import { MessageCircle, Mail, Phone, FileText, HelpCircle, AlertCircle } from "lucide-react-native";

type SupportOption = {
  id: string;
  title: string;
  description: string;
  icon: typeof MessageCircle;
  action: () => void;
  color: string;
};

export default function SupportScreen() {
  const supportOptions: SupportOption[] = [
    {
      id: "whatsapp",
      title: "WhatsApp",
      description: "Chattez avec notre équipe support",
      icon: MessageCircle,
      color: "#25D366",
      action: () => {
        const phoneNumber = "2250709090909";
        const message = "Bonjour, j'ai besoin d'aide avec l'application Zima";
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
          Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
        });
      },
    },
    {
      id: "email",
      title: "Email",
      description: "support@zima.app",
      icon: Mail,
      color: "#0C5A45",
      action: () => {
        Linking.openURL("mailto:support@zima.app?subject=Demande de support");
      },
    },
    {
      id: "phone",
      title: "Téléphone",
      description: "+225 07 09 09 09 09",
      icon: Phone,
      color: "#0C5A45",
      action: () => {
        Linking.openURL("tel:+2250709090909");
      },
    },
    {
      id: "faq",
      title: "FAQ",
      description: "Questions fréquemment posées",
      icon: HelpCircle,
      color: "#666",
      action: () => {
        console.log("FAQ section - Coming soon");
      },
    },
    {
      id: "docs",
      title: "Documentation",
      description: "Guides et tutoriels",
      icon: FileText,
      color: "#666",
      action: () => {
        console.log("Documentation - Coming soon");
      },
    },
    {
      id: "report",
      title: "Signaler un problème",
      description: "Rapportez un bug ou une erreur",
      icon: AlertCircle,
      color: "#E53E3E",
      action: () => {
        Linking.openURL("mailto:support@zima.app?subject=Signalement de problème");
      },
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "Aide & Support",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#0C5A45",
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Comment pouvons-nous vous aider ?</Text>
          <Text style={styles.subtitle}>
            Notre équipe est disponible pour répondre à toutes vos questions
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {supportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={option.action}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: option.color + "15" }]}>
                  <Icon size={24} color={option.color} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Heures d&apos;ouverture</Text>
          <Text style={styles.infoText}>Lundi - Vendredi: 8h00 - 18h00</Text>
          <Text style={styles.infoText}>Samedi: 9h00 - 14h00</Text>
          <Text style={styles.infoText}>Dimanche: Fermé</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
    color: "#1A1A1A",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
  infoBox: {
    backgroundColor: "#0C5A45",
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 6,
    opacity: 0.9,
  },
});