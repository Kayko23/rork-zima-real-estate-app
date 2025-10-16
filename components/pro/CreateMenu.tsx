import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Bed, Car, X } from 'lucide-react-native';
import { colors, radius } from '@/theme/tokens';

type CreateMenuProps = {
  visible: boolean;
  onClose: () => void;
};

export default function CreateMenu({ visible, onClose }: CreateMenuProps) {
  const router = useRouter();

  const options = [
    {
      id: 'property',
      title: 'Propriété',
      description: 'Maison, appartement, commerce, terrain...',
      icon: Home,
      route: '/property/new' as const,
      color: '#0E9F6E',
    },
    {
      id: 'trip',
      title: 'Hébergement',
      description: 'Hôtel, résidence, villa de vacances...',
      icon: Bed,
      route: '/trip/index' as const,
      color: '#3B82F6',
    },
    {
      id: 'vehicle',
      title: 'Véhicule',
      description: 'Location, vente, avec chauffeur...',
      icon: Car,
      route: '/vehicles/index' as const,
      color: '#8B5CF6',
    },
  ];

  const handleSelect = (route: string) => {
    onClose();
    router.push(route as any);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Créer une annonce</Text>
            <Pressable onPress={onClose} style={styles.closeButton} testID="close-create-menu">
              <X size={24} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <Pressable
                  key={option.id}
                  testID={`create-option-${option.id}`}
                  onPress={() => handleSelect(option.route)}
                  style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                >
                  <View style={[styles.iconWrap, { backgroundColor: `${option.color}15` }]}>
                    <Icon size={28} color={option.color} strokeWidth={2.5} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: 32,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#0F172A',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  content: {
    padding: 20,
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 14,
  },
  optionPressed: {
    backgroundColor: '#F1F5F9',
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#0F172A',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748B',
  },
});
