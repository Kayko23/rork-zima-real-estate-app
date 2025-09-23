import React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, ViewStyle } from "react-native";

// Logo ZIMA avec fond transparent
const LOGO_SRC = { uri: "https://r2-pub.rork.com/generated-images/ed3f0fbb-0aa3-4b35-8b97-4548615f5c1d.png" };

type Props = { style?: ViewStyle; widthPct?: number };

export default function ZimaLogo({ style, widthPct = 0.70 }: Props) {
  const logoStyle = {
    width: `${Math.round(widthPct * 100)}%` as const,
    aspectRatio: 1,
  };

  return (
    <View style={[styles.wrap, style]}>
      <Image
        source={LOGO_SRC}
        style={logoStyle}
        contentFit="contain"
        transition={0}
        tintColor={undefined as any}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
});