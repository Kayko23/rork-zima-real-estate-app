import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const { userMode, toggleAppMode } = useAppStore();
  const insets = useSafeAreaInsets();

  const handleToggleMode = () => {
    toggleAppMode();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil Prestataire</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.modeSection}>
          <Text style={styles.modeLabel}>Mode actuel: {userMode === 'provider' ? 'Prestataire' : 'Utilisateur'}</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={handleToggleMode}>
            <Text style={styles.toggleButtonText}>
              ⤿ Revenir au mode utilisateur
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modeSection: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  modeLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: Colors.background.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});