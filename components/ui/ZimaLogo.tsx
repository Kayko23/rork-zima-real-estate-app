import React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, ViewStyle } from "react-native";

// Logo ZIMA - using existing icon for now
const LOGO_SRC = require("@/assets/images/icon.png");

type Props = { style?: ViewStyle; widthPct?: number };

export default function ZimaLogo({ style, widthPct = 0.70 }: Props) {
  const logoStyle = {
    width: `${Math.round(widthPct * 100)}%`,
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