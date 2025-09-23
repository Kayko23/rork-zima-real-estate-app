import React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, ViewStyle } from "react-native";

// Logo ZIMA avec fond transparent
const LOGO_SRC = { uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/lnpl9u7k9s6cwo1zhki3e" };

type Props = { style?: ViewStyle; widthPct?: number };

export default function ZimaLogo({ style, widthPct = 0.70 }: Props) {
  const logoStyle = {
    width: `${Math.round(widthPct * 100)}%`,
    aspectRatio: 1,
  } as const;

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