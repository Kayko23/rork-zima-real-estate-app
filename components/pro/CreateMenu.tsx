import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Home, Plane, Car, X } from 'lucide-react-native';

interface CreateMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateMenu({ visible, onClose }: CreateMenuProps) {
  const items = [
    {
      label: 'Propriété',
      description: 'Maison, appartement, terrain, commerce',
      route: '/pro/create/property',
      icon: Home,
      color: '#10B981' as const,
    },
    {
      label: 'Hébergement',
      description: 'Hôtel, résidence, villa de vacances',
      route: '/pro/create/trip',
      icon: Plane,
      color: '#3B82F6' as const,
    },
    {
      label: 'Véhicule',
      description: 'Location, vente, chauffeur',
      route: '/pro/create/vehicle',
      icon: Car,
      color: '#F59E0B' as const,
    },
  ];

  const handleSelect = (route: string) => {
    onClose();
    router.push(route as any);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.container}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheet}>
              <View style={styles.header}>
                <Text style={styles.title}>Créer une annonce</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.items}>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.route}
                      style={styles.item}
                      onPress={() => handleSelect(item.route)}
                    >
                      <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                        <Icon size={28} color="#fff" />
                      </View>
                      <View style={styles.itemText}>
                        <Text style={styles.itemLabel}>{item.label}</Text>
                        <Text style={styles.itemDesc}>{item.description}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  items: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    gap: 16,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#0F172A',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 14,
    color: '#64748B',
  },
});
