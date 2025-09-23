import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LiquidGlassView from './LiquidGlassView';
import Colors from '@/constants/colors';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function HeroSection({ title, subtitle, children }: HeroSectionProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.gradient}
      >
        {/* Background blobs */}
        <View style={styles.blobContainer}>
          <View style={[styles.blob, styles.blob1]} />
          <View style={[styles.blob, styles.blob2]} />
          <View style={[styles.blob, styles.blob3]} />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>ZIMA</Text>
            </View>
          </View>

          <LiquidGlassView style={styles.glassCard}>
            <View style={styles.cardContent}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
              {children}
            </View>
          </LiquidGlassView>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 320,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  blobContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blob: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 9999,
  },
  blob1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  blob2: {
    width: 150,
    height: 150,
    bottom: -30,
    left: -30,
  },
  blob3: {
    width: 100,
    height: 100,
    top: 100,
    left: '30%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  glassCard: {
    flex: 1,
    minHeight: 160,
  },
  cardContent: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: 20,
  },
});