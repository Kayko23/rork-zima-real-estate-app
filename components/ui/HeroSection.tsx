import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";

const GREEN = "#19715C";

export default function HeroSection() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  return (
    <>
      {/* Carte verte avec logo intégré */}
      <View style={styles.hero}>
        {/* Décors ronds en arrière-plan */}
        <View style={[styles.bubble, { top: 20, left: 20, width: 60, height: 60, opacity: 0.1 }]} />
        <View style={[styles.bubble, { top: 30, right: 15, width: 100, height: 100, opacity: 0.15 }]} />
        
        {/* Logo ZIMA avec image ou fallback */}
        <View style={styles.logoContainer}>
          {!imageError ? (
            <Image
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/6kl9gdfog1qcmvxe8ydse' }}
              style={styles.logoImage}
              resizeMode="contain"
              onError={() => {
                console.log('Logo loading error, switching to fallback');
                setImageError(true);
              }}
              onLoad={() => console.log('Logo loaded successfully')}
            />
          ) : (
            // Fallback avec texte stylisé
            <View style={styles.logoFallback}>
              <View style={styles.logoTextContainer}>
                <Text style={styles.logoZi}>zi</Text>
                <View style={styles.underline} />
                <Text style={styles.logoZima}>zima</Text>
              </View>
              <Text style={styles.logoSubtext}>L&apos;agence de propriété de rêve</Text>
            </View>
          )}
        </View>

        <Text style={styles.heading}>
          Trouvez votre propriété idéale partout{"\n"}en Afrique
        </Text>
      </View>

      {/* Chips en dessous de la carte */}
      <View style={styles.chipsRow}>
        <Pressable 
          style={[styles.chip, styles.chipPrimary]} 
          onPress={() => router.push("/(tabs)/categories")}
        >
          <Text style={[styles.chipText, styles.chipTextPrimary]}>🏠  Biens immobiliers</Text>
        </Pressable>
        <Pressable 
          style={styles.chip} 
          onPress={() => router.push("/services")}
        >
          <Text style={styles.chipText}>💼  Services</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: GREEN,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    overflow: "hidden",
    position: "relative",
    minHeight: 200,
  },
  
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  
  /* Logo ZIMA avec image */
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    zIndex: 3,
  },
  logoImage: {
    width: 240,
    height: 120,
    // Suppression du tintColor qui peut causer des problèmes sur iOS
  },
  
  // Styles pour le fallback logo
  logoFallback: {
    alignItems: "center",
  },
  logoTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  logoZi: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "400",
    fontStyle: "italic",
    marginRight: 8,
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  logoZima: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "600",
  },
  logoSubtext: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.8,
    fontStyle: "italic",
  },
  
  heading: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 24,
    zIndex: 2,
  },
  
  chipsRow: {
    marginTop: -12,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  chip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: { elevation: 3 },
      web: { boxShadow: "0 8px 16px rgba(0,0,0,0.06)" } as any,
    }),
  },
  chipText: { color: "#0F172A", fontWeight: "600" },
  chipPrimary: { borderWidth: 2, borderColor: GREEN },
  chipTextPrimary: { color: GREEN },
});