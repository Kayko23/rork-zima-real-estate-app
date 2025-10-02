import React, { useState, useRef, useMemo } from 'react';
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
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function ModeSwitchPill() {
  const { userMode, toggleAppMode } = useApp();
  const insets = useSafeAreaInsets();
  const [isAnimating, setIsAnimating] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const label = userMode === 'user' 
    ? 'Passer en mode prestataire' 
    : 'Passer en mode voyageur';

  const handlePress = async () => {
    if (isAnimating) return;

    const isDirty = false;
    
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

    if (Platform.OS !== 'web') {
      try {
        await Haptics.selectionAsync();
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }

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
      rotateAnim.setValue(0);
      setIsAnimating(false);
    });

    await toggleAppMode();

    if (Platform.OS === 'web') {
      const newMode = userMode === 'user' ? 'provider' : 'user';
      window.dispatchEvent(new CustomEvent('appModeChanged', {
        detail: { from: userMode, to: newMode, source: 'pill' }
      }));
    }
  };

  const spin = useMemo(
    () => rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    }),
    [rotateAnim]
  );

  const iconTransform = [
    { rotate: spin },
    { scale: scaleAnim }
  ];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { bottom: Math.max(insets.bottom, 12) + 64 + 120 }
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Basculer entre les modes utilisateur et prestataire"
    >
      <View style={styles.wrapper}>
        {Platform.OS === 'web' ? (
          <View style={styles.webGlass}>
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Animated.View style={{ transform: iconTransform }}>
                  <ArrowLeftRight size={18} color={Colors.text.primary} />
                </Animated.View>
              </View>
              <Text style={styles.label}>{label}</Text>
            </View>
          </View>
        ) : (
          <BlurView intensity={30} tint="light" style={styles.glass}>
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Animated.View style={{ transform: iconTransform }}>
                  <ArrowLeftRight size={18} color={Colors.text.primary} />
                </Animated.View>
              </View>
              <Text style={styles.label}>{label}</Text>
            </View>
          </BlurView>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    marginLeft: -100,
    zIndex: 1000,
  },
  wrapper: {
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