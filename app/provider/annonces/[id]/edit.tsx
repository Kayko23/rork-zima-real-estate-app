import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import ListingForm from "@/components/provider/ListingForm";
import { updateListing, fetchListings, Listing } from "@/services/annonces.api";

export default function EditListing(){
  const { id } = useLocalSearchParams<{id:string}>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadListing() {
      if (!id) return;
      try {
        setLoading(true);
        const allListings = await fetchListings("active");
        const pendingListings = await fetchListings("pending");
        const expiredListings = await fetchListings("expired");
        const all = [...allListings, ...pendingListings, ...expiredListings];
        const found = all.find(l => l.id === id);
        if (found) {
          setListing(found);
        } else {
          setError("Bien introuvable");
        }
      } catch (err) {
        console.error("Error loading listing:", err);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [id]);
  
  const handleSubmit = async (payload: any) => {
    if (!id) return;
    await updateListing(id, payload); 
    router.back();
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#065f46" />
        <Text style={s.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error || !listing) {
    return (
      <View style={s.center}>
        <Text style={s.errorText}>{error || "Bien introuvable"}</Text>
      </View>
    );
  }

  return <ListingForm initial={listing} onSubmit={handleSubmit} />;
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, color: "#6b7280" },
  errorText: { fontSize: 16, color: "#b91c1c", fontWeight: "600" },
});