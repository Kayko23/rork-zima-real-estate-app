import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { MessageCircle, Send } from 'lucide-react-native';
import BottomSheet from '@/components/BottomSheet';
import Colors from '@/constants/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  providerName: string;
  whatsappNumber?: string;
  providerId: string;
};

const quickMessages = [
  "Puis-je voir la documentation ?",
  "Puis-je avoir un rendez-vous ?",
  "Quels sont vos tarifs ?",
  "Êtes-vous disponible cette semaine ?"
];

export default function WhatsAppChoiceSheet({ 
  visible, 
  onClose, 
  providerName, 
  whatsappNumber, 
  providerId 
}: Props) {
  const router = useRouter();

  const handleWhatsAppPress = () => {
    if (whatsappNumber) {
      Linking.openURL(`https://wa.me/${whatsappNumber}`);
      onClose();
    } else {
      Alert.alert('WhatsApp', 'Numéro WhatsApp indisponible');
    }
  };

  const handleZiMessagePress = (quickMessage?: string) => {
    if (!quickMessage?.trim()) {
      // Navigate to messages tab to start conversation
      router.push('/(tabs)/messages');
    } else {
      // For now, navigate to messages with alert showing the quick message
      Alert.alert(
        'Message rapide',
        `Démarrer une conversation avec ${providerName}: "${quickMessage.trim()}"`,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Envoyer', 
            onPress: () => {
              router.push('/(tabs)/messages');
            }
          }
        ]
      );
    }
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={0.75}>
      <View style={styles.container}>
        <Text style={styles.title}>Contacter {providerName}</Text>
        <Text style={styles.subtitle}>Choisissez votre méthode de contact</Text>

        <View style={styles.optionsContainer}>
          {/* WhatsApp Option */}
          <Pressable style={styles.option} onPress={handleWhatsAppPress}>
            <View style={[styles.iconContainer, { backgroundColor: '#25D366' }]}>
              <MessageCircle size={24} color="white" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Via WhatsApp</Text>
              <Text style={styles.optionDescription}>
                Contacter directement via WhatsApp
              </Text>
            </View>
          </Pressable>

          {/* Zi-Message Option */}
          <Pressable style={styles.option} onPress={() => handleZiMessagePress()}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
              <Send size={24} color="white" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Via Zi-Message</Text>
              <Text style={styles.optionDescription}>
                Échanger via la messagerie ZIMA
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Quick Messages */}
        <View style={styles.quickMessagesContainer}>
          <Text style={styles.quickMessagesTitle}>Messages rapides :</Text>
          <View style={styles.quickMessagesGrid}>
            {quickMessages.map((message, index) => (
              <Pressable
                key={index}
                style={styles.quickMessage}
                onPress={() => handleZiMessagePress(message)}
              >
                <Text style={styles.quickMessageText}>{message}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    minHeight: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  quickMessagesContainer: {
    flex: 1,
  },
  quickMessagesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  quickMessagesGrid: {
    gap: 8,
  },
  quickMessage: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  quickMessageText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});