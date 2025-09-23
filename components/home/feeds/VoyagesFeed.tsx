import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VoyagesFeed() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voyages</Text>
      <Text style={styles.subtitle}>
        Découvrez des hébergements exceptionnels à travers l&apos;Afrique
      </Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Section Voyages en cours de développement</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0E1E1B',
    marginBottom: 8,
    paddingHorizontal: 8,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A6B65',
    lineHeight: 22,
    paddingHorizontal: 8,
    marginBottom: 32,
  },
  placeholder: {
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#5A6B65',
    textAlign: 'center',
  },
});