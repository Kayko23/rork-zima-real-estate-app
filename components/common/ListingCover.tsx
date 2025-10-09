import React from 'react';
import { Image, View, StyleSheet, ImageStyle, StyleProp } from 'react-native';

const placeholder = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

interface ListingCoverProps {
  url?: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export default function ListingCover({ url, style, resizeMode = 'cover' }: ListingCoverProps) {
  const hasUrl = !!url && url.trim().length > 0;
  const source = hasUrl ? { uri: url } : { uri: placeholder };

  return (
    <View style={[styles.container, style]}>
      <Image source={source} resizeMode={resizeMode} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
});
