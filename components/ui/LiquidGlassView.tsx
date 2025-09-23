import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/colors';

interface LiquidGlassViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

export default function LiquidGlassView({ 
  children, 
  style, 
  intensity = 14,
  tint = 'light' 
}: LiquidGlassViewProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.webGlass, style]}>
        <View style={styles.overlay}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <BlurView intensity={intensity} tint={tint} style={[styles.container, style]}>
      <View style={styles.overlay}>
        {children}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.glass,
  },
  webGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(14px)',
  },
  overlay: {
    backgroundColor: Colors.background.glass,
    flex: 1,
  },
});