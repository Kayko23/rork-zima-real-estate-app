import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";

// URL du logo ZIMA en couleur
const SRC = { uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/customcolor_logo_transparent_background.png' };
// ratio du png joint: 1280x768
const RATIO = 1280 / 768;

export default function ZimaBrand() {
  return (
    <View style={styles.wrap}>
      <Image
        source={SRC}
        style={styles.img}
        contentFit="contain"
        transition={0}
        tintColor={undefined as any}   // ✔️ empêche tout recoloriage iOS
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 12,       // un peu d'air en haut
    paddingHorizontal: 16,
    alignItems: "center",
  },
  img: {
    width: "72%",         // ajuste 60–80% selon ton goût
    aspectRatio: RATIO,   // conserve les proportions
  },
});