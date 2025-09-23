import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";

// Using the generated ZIMA logo
const LOGO_URL = "https://r2-pub.rork.com/generated-images/0b1d6d6e-d682-4024-af47-dd716453a6ea.png";

export default function ZimaBrand() {
  return (
    <View style={styles.wrap}>
      <Image
        source={{ uri: LOGO_URL }}
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
    height: 60,           // hauteur fixe pour un bon rendu
    maxWidth: 300,
  },
});