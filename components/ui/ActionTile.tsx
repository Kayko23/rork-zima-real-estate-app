import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/colors';

interface ActionTileProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export default function ActionTile({ title, icon, onPress, variant = 'primary' }: ActionTileProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isPrimary ? styles.primaryContainer : styles.secondaryContainer
      ]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.iconContainer}>
        {React.isValidElement(icon) ? icon : null}
      </View>
      <Text style={[
        styles.title,
        isPrimary ? styles.primaryTitle : styles.secondaryTitle
      ]} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(22px)',
    }),
  },
  primaryContainer: {
    backgroundColor: 'rgba(14, 90, 69, 0.1)',
    borderColor: 'rgba(14, 90, 69, 0.2)',
  },
  secondaryContainer: {
    backgroundColor: 'rgba(158, 122, 43, 0.1)',
    borderColor: 'rgba(158, 122, 43, 0.2)',
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryTitle: {
    color: Colors.primary,
  },
  secondaryTitle: {
    color: Colors.gold,
  },
});