import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
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

  const handleZiMessagePress = () => {
    onClose();
    const conversationId = `conv-${providerId}`;
    router.push({
      pathname: `/chat/${conversationId}`,
      params: {
        name: providerName,
      }
    } as any);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={0.8}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacter {providerName}</Text>
        <Text style={styles.subtitle}>Choisissez votre méthode de contact</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsContainer}>
          <Pressable style={styles.option} onPress={handleWhatsAppPress} testID="contact-option-whatsapp">
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

          <Pressable style={styles.option} onPress={handleZiMessagePress} testID="contact-option-zimessage">
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
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
});