import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockProperties } from "@/constants/data";
import Colors from "@/constants/colors";

export default function PropertyDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const property = mockProperties.find(p => p.id === id);

  if (!property) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Bien introuvable</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.errorText}>Ce bien n&apos;existe pas ou a été supprimé.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image principale */}
        <Image 
          source={{ uri: property.images[0] }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          {/* En-tête */}
          <View style={styles.header}>
            <Text style={styles.title}>{property.title}</Text>
            <Text style={styles.price}>
              {property.price.toLocaleString()} {property.currency}
              {property.type === 'rent' && '/mois'}
            </Text>
          </View>

          {/* Localisation */}
          <View style={styles.locationSection}>
            <Text style={styles.location}>
              📍 {property.location.address}, {property.location.city}, {property.location.country}
            </Text>
          </View>

          {/* Caractéristiques */}
          <View style={styles.specsSection}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>🛏️ Chambres</Text>
              <Text style={styles.specValue}>{property.bedrooms}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>🛁 Salles de bain</Text>
              <Text style={styles.specValue}>{property.bathrooms}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>📐 Surface</Text>
              <Text style={styles.specValue}>{property.area}m²</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Équipements */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Équipements</Text>
            <View style={styles.featuresList}>
              {property.features.map((feature) => (
                <View key={feature} style={styles.featureItem}>
                  <Text style={styles.featureText}>✓ {feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Prestataire */}
          <View style={styles.providerSection}>
            <Text style={styles.sectionTitle}>Prestataire</Text>
            <View style={styles.providerCard}>
              <Image 
                source={{ uri: property.provider.avatar }}
                style={styles.providerAvatar}
              />
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{property.provider.name}</Text>
                <Text style={styles.providerType}>
                  {property.provider.type === 'agency' ? 'Agence' : 'Agent'}
                </Text>
                <Text style={styles.providerRating}>
                  ⭐ {property.provider.rating} ({property.provider.reviewCount} avis)
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  heroImage: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  locationSection: {
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 22,
  },
  specsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  specItem: {
    alignItems: "center",
  },
  specLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  specValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 20,
  },
  featuresList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: "#475569",
  },
  providerSection: {
    marginBottom: 20,
  },
  providerCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  providerType: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  providerRating: {
    fontSize: 14,
    color: "#64748B",
  },
  errorText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
});