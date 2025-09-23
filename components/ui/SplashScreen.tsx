import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


interface SplashScreenProps {
  minDuration?: number;
  maxDuration?: number;
  onComplete: () => void;
}

export default function SplashScreen({ 
  minDuration = 5000, 
  maxDuration = 5000, 
  onComplete 
}: SplashScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [readyToHide, setReadyToHide] = useState(false);
  const [shouldComplete, setShouldComplete] = useState(false);

  useEffect(() => {
    // Scale in animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Minimum duration timer
    const minTimer = setTimeout(() => {
      setReadyToHide(true);
    }, minDuration);

    // Maximum duration timer (fallback)
    const maxTimer = setTimeout(() => {
      setShouldComplete(true);
    }, maxDuration);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [minDuration, maxDuration, scaleAnim]);

  useEffect(() => {
    if (readyToHide || shouldComplete) {
      // Fade out animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 220,
          useNativeDriver: true,
        })
      ]).start(() => {
        onComplete();
      });
    }
  }, [readyToHide, shouldComplete, fadeAnim, scaleAnim, onComplete]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={['#0E5B4C', '#0B4B3A', '#0E5B4C']}
        locations={[0, 0.6, 1]}
        style={styles.gradient}
      >
        {/* Glass reflection effect */}
        <View style={styles.glassReflection} />
        
        {/* ZIMA Animation GIF */}
        <Image
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ex54o6t6l13a0fig9sdy1' }}
          style={styles.logo}
          resizeMode="contain"
          onError={() => {
            console.log('ZIMA animation GIF failed to load, using fallback');
          }}
        />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassReflection: {
    position: 'absolute',
    width: '60%',
    height: '40%',
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    ...Platform.select({
      web: {
        filter: 'blur(14px)',
      },
      default: {
        opacity: 0.12,
      },
    }),
  },
  logo: {
    width: '56%',
    maxWidth: 320,
    aspectRatio: 1,
  },

});