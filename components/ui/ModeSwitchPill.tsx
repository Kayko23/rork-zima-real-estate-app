import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  Platform,
  Alert,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ArrowLeftRight } from 'lucide-react-native';
import { useAppStore } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function ModeSwitchPill() {
  const { userMode, toggleAppMode } = useAppStore();
  const insets = useSafeAreaInsets();
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));

  const label = userMode === 'user' 
    ? 'Passer en mode prestataire' 
    : 'Passer en mode voyageur';

  const handlePress = async () => {
    if (isAnimating) return;

    // Check for dirty forms (placeholder for future implementation)
    const isDirty = false; // This would be set by form contexts
    
    if (isDirty) {
      Alert.alert(
        'Modifications non enregistrées',
        'Vous avez des modifications non enregistrées. Changer de mode maintenant ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Changer de mode', 
            style: 'destructive',
            onPress: performSwitch
          }
        ]
      );
      return;
    }

    performSwitch();
  };

  const performSwitch = async () => {
    setIsAnimating(true);

    // Haptic feedback
    if (Platform.OS !== 'web') {
      try {
        await Haptics.selectionAsync();
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }

    // Rotation animation
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.96,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Reset rotation
      rotateAnim.setValue(0);
      setIsAnimating(false);
    });

    // Switch mode
    await toggleAppMode();

    // Fire custom event for telemetry
    if (Platform.OS === 'web') {
      const newMode = userMode === 'user' ? 'provider' : 'user';
      window.dispatchEvent(new CustomEvent('appModeChanged', {
        detail: { from: userMode, to: newMode, source: 'pill' }
      }));
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const PillContent = () => (
    <View style={styles.content}>
      <Animated.View 
        style={[
          styles.iconContainer,
          { 
            transform: [
              { rotate: spin },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <ArrowLeftRight size={18} color={Colors.text.primary} />
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { bottom: Math.max(insets.bottom, 12) + 64 + 20 }
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Basculer entre les modes utilisateur et prestataire"
    >
      {Platform.OS === 'web' ? (
        <View style={styles.webGlass}>
          <PillContent />
        </View>
      ) : (
        <BlurView intensity={30} tint="light" style={styles.glass}>
          <PillContent />
        </BlurView>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    marginLeft: -100,
    zIndex: 1000,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  glass: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  webGlass: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(30px)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
});