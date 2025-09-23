import React from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { BlurView } from 'expo-blur';

interface RouteLoaderProps {
  visible: boolean;
}

export default function RouteLoader({ visible }: RouteLoaderProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.webBlur}>
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/l98in4aolu3j8wa7sd10m' }}
            style={styles.gif}
            resizeMode="contain"
            onError={() => {
              console.log('Route loader GIF failed to load on web');
            }}
          />
        </View>
      ) : (
        <BlurView intensity={8} tint="light" style={styles.blur}>
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/l98in4aolu3j8wa7sd10m' }}
            style={styles.gif}
            resizeMode="contain"
          />
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  webBlur: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(8px)',
  },
  gif: {
    width: 96,
    height: 96,
  },
});