import React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, ViewStyle } from "react-native";

// Logo ZIMA avec fond transparent
const LOGO_SRC = require("@/assets/images/white_logo_transparent_background.png");

type Props = { style?: ViewStyle; widthPct?: number };

export default function ZimaLogo({ style, widthPct = 0.70 }: Props) {
  const logoStyle = {
    width: `${Math.round(widthPct * 100)}%` as const,
    aspectRatio: 1280 / 768 as const,
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