import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  Linking,
  Platform,
  Share,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Heart,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Camera,
  ChevronRight,
  Home,
  Bed,
  Bath,
  Maximize2,
  Wifi,
  Car,
  Waves,
  Shield,
  Snowflake,
  ChefHat,
  ArrowUp,
  Trees,
  Mail,
} from "lucide-react-native";
import { Ionicons } from '@expo/vector-icons';
import LiquidGlassView from "@/components/ui/LiquidGlassView";
import WhatsAppChoiceSheet from "@/components/ui/WhatsAppChoiceSheet";

const { width } = Dimensions.get("window");
const CARD = 16;
const R = 20;

type SafetyItem = { title: string; subtitle: string };
type Agent = {
  id: string;
  name: string;
  verified: boolean;
  stats: { reviews: number; rating: number; years: number };
  role: string;
  avatar: string;
};

type PopularItem = { id: string; title: string; info1: string; info2: string };

type PropertyData = {
  id: string | string[] | undefined;
  title: string;
  city: string;
  country: string;
  type: string;
  chips: string[];
  price: number;
  currency: string;
  premium: boolean;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  agent: Agent;
  safety: SafetyItem[];
  popularInCity: PopularItem[];
};

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Text style={{ fontWeight: "800", fontSize: 16, marginBottom: 8 }}>Une erreur est survenue</Text>
        <Text style={{ color: "#475569", textAlign: "center" }}>{error.message}</Text>
        <Pressable testID="retry" onPress={() => setError(null)} style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#0E5A46", borderRadius: 10 }}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }
  try {
    return <>{children}</>;
  } catch (e) {
    const err = e as Error;
    console.log("Property detail render error", err);
    setError(err);
    return null;
  }
}

export default function PropertyDetailRoute() {
  return (
    <ErrorBoundary>
      <PropertyDetailScreen />
    </ErrorBoundary>
  );
}

function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        console.log("[PropertyDetail] Loading property with ID:", id);
        
        let allListings: any[] = [];
        let pendingListings: any[] = [];
        let mockProperties: any[] = [];
        
        try {
          const annoncesModule = await import("@/services/annonces.api");
          const dataModule = await import("@/constants/data");
          
          if (annoncesModule && typeof annoncesModule.fetchListings === 'function') {
            try {
              allListings = await annoncesModule.fetchListings("active");
              console.log("[PropertyDetail] Active listings loaded:", allListings.length);
            } catch (err) {
              console.error("[PropertyDetail] Error fetching active listings:", err);
            }
            
            try {
              pendingListings = await annoncesModule.fetchListings("pending");
              console.log("[PropertyDetail] Pending listings loaded:", pendingListings.length);
            } catch (err) {
              console.error("[PropertyDetail] Error fetching pending listings:", err);
            }
          }
          
          if (dataModule && Array.isArray(dataModule.mockProperties)) {
            mockProperties = dataModule.mockProperties;
          }
        } catch (importErr) {
          console.error("[PropertyDetail] Error importing modules:", importErr);
        }
        
        const all = [...allListings, ...pendingListings];
        
        let foundListing = all.find(l => l && l.id === id);
        
        if (!foundListing && Array.isArray(mockProperties)) {
          const mockProp = mockProperties.find(p => p && p.id === id);
          if (mockProp) {
            foundListing = {
              id: mockProp.id,
              title: mockProp.title,
              city: mockProp.location.city,
              country: mockProp.location.country,
              price: mockProp.price,
              currency: mockProp.currency,
              type: mockProp.type === 'sale' ? 'sale' : 'rent',
              surface: mockProp.area,
              beds: mockProp.bedrooms,
              baths: mockProp.bathrooms,
              photos: mockProp.images,
              status: 'active',
            } as any;
          }
        }
        
        const chips: string[] = [];
        if (foundListing) {
          if ((foundListing as any).subtype) chips.push((foundListing as any).subtype);
          if (foundListing.beds) chips.push(`${foundListing.beds} pièces`);
          if (foundListing.baths) chips.push(`${foundListing.baths} SDB`);
          if (foundListing.surface) chips.push(`${foundListing.surface} m²`);
        }
        
        const propertyData: PropertyData = {
          id: foundListing?.id || id,
          title: foundListing?.title || "Bien immobilier",
          city: foundListing?.city || "Ville",
          country: foundListing?.country || "Pays",
          type: (foundListing as any)?.subtype || foundListing?.type || "bien",
          chips,
          price: foundListing?.price || 0,
          currency: foundListing?.currency || "XOF",
          premium: foundListing?.premium || false,
          rating: foundListing?.rating || 4.5,
          reviewsCount: foundListing?.reviews || 0,
          images: foundListing?.photos && foundListing.photos.length > 0 ? foundListing.photos : [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
          ],
          description: (foundListing as any)?.description || "Magnifique bien immobilier situé dans un quartier recherché. Ce bien offre un cadre de vie exceptionnel avec des finitions de qualité et des équipements modernes.",
          agent: {
            id: "p1",
            name: "Agent Zima",
            verified: true,
            stats: { reviews: 100, rating: 4.7, years: 3 },
            role: "Agent immobilier",
            avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
          },
          safety: [
            { title: "Politique de vérification", subtitle: "Tous nos agents sont vérifiés et certifiés" },
            { title: "Sécurité des visites", subtitle: "Visites accompagnées et sécurisées" },
          ],
          popularInCity: [
            { id: "pop1", title: "Villa Moderne", info1: "3 pièces", info2: "150 m²" },
            { id: "pop2", title: "Appartement Standing", info1: "2 pièces", info2: "85 m²" },
            { id: "pop3", title: "Duplex Luxueux", info1: "4 pièces", info2: "200 m²" },
          ],
        };
        
        console.log("Property data loaded:", propertyData.title);
        setData(propertyData);
      } catch (error) {
        console.error("Error loading property:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        const fallbackData: PropertyData = {
          id: id || "unknown",
          title: "Bien immobilier",
          city: "Ville",
          country: "Pays",
          type: "bien",
          chips: [],
          price: 0,
          currency: "XOF",
          premium: false,
          rating: 4.5,
          reviewsCount: 0,
          images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
          ],
          description: "Bien immobilier",
          agent: {
            id: "p1",
            name: "Agent Zima",
            verified: true,
            stats: { reviews: 0, rating: 4.5, years: 1 },
            role: "Agent immobilier",
            avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
          },
          safety: [
            { title: "Politique de vérification", subtitle: "Tous nos agents sont vérifiés et certifiés" },
            { title: "Sécurité des visites", subtitle: "Visites accompagnées et sécurisées" },
          ],
          popularInCity: [
            { id: "pop1", title: "Villa Moderne", info1: "3 pièces", info2: "150 m²" },
            { id: "pop2", title: "Appartement Standing", info1: "2 pièces", info2: "85 m²" },
            { id: "pop3", title: "Duplex Luxueux", info1: "4 pièces", info2: "200 m²" },
          ],
        };
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      loadProperty();
    } else {
      setLoading(false);
    }
  }, [id]);

  const [imgIndex, setImgIndex] = useState<number>(0);
  const [showAllAmenities, setShowAllAmenities] = useState<boolean>(false);
  const [showWhatsAppChoice, setShowWhatsAppChoice] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const listRef = useRef<FlatList<string> | null>(null);
  const heroH = Math.min(420, Math.round(width * 0.72));

  const allAmenities = [
    { label: "Wifi gratuit", icon: "wifi" },
    { label: "Parking gratuit", icon: "car" },
    { label: "Piscine", icon: "waves" },
    { label: "Sécurité 24h", icon: "shield" },
    { label: "Climatisation", icon: "snowflake" },
    { label: "Balcon", icon: "home" },
    { label: "Cuisine équipée", icon: "chef-hat" },
    { label: "Ascenseur", icon: "arrow-up" },
    { label: "Jardin privé", icon: "trees" }
  ];

  const displayedAmenities = showAllAmenities ? allAmenities : allAmenities.slice(0, 4);
  const remainingCount = allAmenities.length - 4;

  const openMaps = () => {
    if (!data) return;
    try {
      const q = encodeURIComponent(`${data.city}, ${data.country}`);
      const url = Platform.OS === "ios" ? `http://maps.apple.com/?q=${q}` : `https://www.google.com/maps/search/?api=1&query=${q}`;
      console.log("Open maps", url);
      Linking.openURL(url).catch(err => console.log("Linking error", err));
    } catch (e) {
      console.log("openMaps error", e);
    }
  };

  const openItinerary = () => {
    if (!data) return;
    try {
      const q = encodeURIComponent(`${data.city}, ${data.country}`);
      const url = Platform.OS === "ios" ? `http://maps.apple.com/?daddr=${q}` : `https://www.google.com/maps/dir/?api=1&destination=${q}`;
      console.log("Open itinerary", url);
      Linking.openURL(url).catch(err => console.log("Linking error", err));
    } catch (e) {
      console.log("openItinerary error", e);
    }
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#6b7280' }}>Chargement...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 16, color: '#b91c1c', fontWeight: '600', textAlign: 'center' }}>Bien introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen} testID="property-detail-screen">
      <View style={styles.heroWrap}>
        <FlatList
          ref={(r) => { listRef.current = r; }}
          data={data.images}
          keyExtractor={(uri, i) => `${uri}-${i}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            setImgIndex(idx);
            console.log("image index", idx);
          }}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={{ width, height: heroH }} resizeMode="cover" />
          )}
        />

        <View style={styles.heroOverlays} pointerEvents="box-none">
          <View style={[styles.topActions, { top: Math.max(insets.top + 8, 44) }]}>
            <LiquidGlassView style={styles.glassCircle} intensity={18} tint="light">
              <Pressable 
                testID="back" 
                onPress={() => {
                  console.log("Back button pressed");
                  router.back();
                }} 
                style={styles.roundBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft size={20} color="#0b3b35" />
              </Pressable>
            </LiquidGlassView>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <LiquidGlassView style={styles.glassCircle} intensity={18} tint="light">
                <Pressable 
                  testID="share" 
                  onPress={async () => {
                    console.log("Share button pressed");
                    try {
                      const shareUrl = `https://zima.com/property/${data.id}`;
                      const shareMessage = `Découvrez ce magnifique bien: ${data.title} à ${data.city}, ${data.country} - ${data.price.toLocaleString('en-US')} ${data.currency}`;
                      
                      if (Platform.OS === 'web') {
                        if (navigator.share) {
                          await navigator.share({
                            title: data.title,
                            text: shareMessage,
                            url: shareUrl,
                          });
                        } else {
                          await navigator.clipboard.writeText(`${shareMessage} - ${shareUrl}`);
                          Alert.alert('Succès', 'Lien copié dans le presse-papiers!');
                        }
                      } else {
                        await Share.share({
                          message: `${shareMessage} - ${shareUrl}`,
                          url: shareUrl,
                          title: data.title,
                        });
                      }
                    } catch (error) {
                      console.log('Share error:', error);
                      Alert.alert('Erreur', 'Impossible de partager ce bien.');
                    }
                  }} 
                  style={styles.roundBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="share-outline" size={20} color="#0E3B33" />
                </Pressable>
              </LiquidGlassView>
              <LiquidGlassView style={styles.glassCircle} intensity={18} tint="light">
                <Pressable 
                  testID="fav" 
                  onPress={() => {
                    console.log("Favorite button pressed");
                    setIsFavorite(!isFavorite);
                    Alert.alert(
                      isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
                      isFavorite 
                        ? 'Ce bien a été retiré de vos favoris' 
                        : 'Ce bien a été ajouté à vos favoris'
                    );
                  }} 
                  style={styles.roundBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Heart size={18} color="#0b3b35" fill={isFavorite ? "#0b3b35" : "transparent"} />
                </Pressable>
              </LiquidGlassView>
            </View>
          </View>

          <LiquidGlassView style={styles.pagerGlass} intensity={16} tint="light">
            <View style={styles.pagerContent}>
              <Camera size={14} color="#0b3b35" />
              <Text style={styles.pagerText}>{imgIndex + 1} / {data.images.length}</Text>
            </View>
          </LiquidGlassView>

          <Pressable accessibilityLabel="prev" testID="prev" style={styles.navLeft} onPress={() => {
            const next = Math.max(0, imgIndex - 1);
            listRef.current?.scrollToOffset({ offset: next * width, animated: true });
            setImgIndex(next);
          }}>
            <LiquidGlassView style={styles.navBtn} intensity={14} tint="light"><ChevronLeft size={18} color="#0b3b35" /></LiquidGlassView>
          </Pressable>
          <Pressable accessibilityLabel="next" testID="next" style={styles.navRight} onPress={() => {
            const next = Math.min(data.images.length - 1, imgIndex + 1);
            listRef.current?.scrollToOffset({ offset: next * width, animated: true });
            setImgIndex(next);
          }}>
            <LiquidGlassView style={styles.navBtn} intensity={14} tint="light"><ChevronRight size={18} color="#0b3b35" /></LiquidGlassView>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: CARD, paddingTop: 14 }}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.chipsRow}>
            {data.chips.map((c) => (
              <Chip key={c} label={c} />
            ))}
          </View>
          <Pressable style={styles.locationRow} onPress={openMaps} testID="open-maps">
            <MapPin size={18} color="#0f6b5e" />
            <Text style={styles.locationText}>{data.city}, {data.country}</Text>
          </Pressable>
          <View style={styles.ratingRow}>
            <Star size={16} color="#f0b429" fill="#f0b429" />
            <Text style={styles.ratingText}>{data.rating.toFixed(1)} • <Text style={styles.linkText}>{data.reviewsCount} avis</Text></Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: CARD, gap: 12, marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Points forts</Text>
          <View style={styles.amenitiesGrid}>
            {displayedAmenities.map((amenity, index) => (
              <Amenity key={index} label={amenity.label} iconType={amenity.icon} />
            ))}
          </View>
          {!showAllAmenities && remainingCount > 0 && (
            <Pressable 
              style={{ marginTop: 6 }} 
              testID="show-amenities"
              onPress={() => setShowAllAmenities(true)}
            >
              <Text style={styles.linkText}>Afficher les {allAmenities.length} équipements</Text>
            </Pressable>
          )}
          {showAllAmenities && (
            <Pressable 
              style={{ marginTop: 6 }} 
              testID="hide-amenities"
              onPress={() => setShowAllAmenities(false)}
            >
              <Text style={styles.linkText}>Masquer les équipements</Text>
            </Pressable>
          )}
        </View>

        <View style={{ paddingHorizontal: CARD, gap: 12, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.body}>{data.description}</Text>
          <Pressable testID="read-more" onPress={() => {
            console.log("Expanding description");
            // Could implement modal or expanded view
          }}><Text style={styles.linkText}>Lire la suite</Text></Pressable>
        </View>

        <View style={{ paddingHorizontal: CARD, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Faites connaissance avec votre conseiller</Text>
        </View>
        <View style={{ paddingHorizontal: CARD }}>
          <AgentCard
            agent={data.agent}
            onProfile={() => {
              console.log("Opening agent profile for:", data.agent.name, "ID:", data.agent.id);
              router.push(`/provider/${data.agent.id}`);
            }}
            onAll={() => {
              console.log("Booking appointment with:", data.agent.name);
              router.push({
                pathname: "/appointment/book",
                params: {
                  agent: data.agent.name,
                  property: String(data.id ?? ""),
                },
              });
            }}
          />
        </View>

        <View style={{ paddingHorizontal: CARD, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Détails du bien</Text>
          <View style={styles.detailCard}>
            <DetailRow label="Type" value="villa" />
            <DetailRow label="Numéro Zima" value="#45782" />
            <DetailRow label="Étage" value="2ème étage" />
            <DetailRow label="Année" value="2020" />
            <DetailRow label="Charges" value="50 USD/mois" />
            <DetailRow label="Titre foncier" value="Oui" />
            <DetailRow label="Orientation" value="Sud-Est" last />
          </View>
        </View>

        <View style={{ paddingHorizontal: CARD, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Où se situe le bien</Text>
          <View style={styles.mapCard}>
            <View style={styles.mapInner}>
              <MapPin size={28} color="#7da096" />
              <Text style={styles.mapLabel}>Carte interactive</Text>
            </View>
            <View style={styles.mapActions}>
              <ButtonOutline onPress={openItinerary} label="Itinéraire" />
              <Button onPress={openMaps} label="Voir dans Maps" />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: CARD, marginTop: 24 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>{data.rating.toFixed(1)} • {data.reviewsCount} avis</Text>
            <Pressable testID="all-reviews" onPress={() => {
            console.log("Opening all reviews for property:", data.id);
            // TODO: Create reviews page or implement modal
          }}><Text style={styles.linkText}>Tous les avis</Text></Pressable>
          </View>
          <ReviewCard name="Moussa Ba" date="15/11/2024" text="Excellent appartement, très bien situé et l’agent était très professionnel. Je recommande vivement !" />
        </View>

        <View style={{ paddingHorizontal: CARD, marginTop: 24 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Biens populaires • {data.city}</Text>
            <Pressable testID="see-all-popular" onPress={() => {
            console.log("Opening all popular properties in", data.city);
            router.push(`/browse?city=${encodeURIComponent(data.city)}`);
          }}><Text style={styles.linkText}>Voir tout</Text></Pressable>
          </View>
        </View>
        <FlatList
          data={data.popularInCity}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: CARD, paddingBottom: 8 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => {
              console.log("Opening property:", item.id);
              router.push(`/property/${item.id}`);
            }}>
              <PopularCard item={item} />
            </Pressable>
          )}
        />

        <View style={{ paddingHorizontal: CARD, marginTop: 16, marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Infos & sécurité</Text>
          <View style={styles.infoSecCard}>
            {data.safety.map((s, idx) => (
              <View key={String(idx)} style={styles.infoRow}>
                <View style={styles.bullet}><Text>🛡️</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>{s.title}</Text>
                  <Text style={styles.infoSubtitle}>{s.subtitle}</Text>
                </View>
              </View>
            ))}
            <Pressable testID="report" onPress={() => {
              console.log("Opening report form for property:", data.id);
              // TODO: Create report page or implement modal
            }}><Text style={[styles.linkText, { marginTop: 8 }]}>Signaler cette annonce</Text></Pressable>
          </View>
        </View>
      </ScrollView>

      <LiquidGlassView style={styles.stickyGlass} intensity={26} tint="light">
        <View style={styles.sticky} testID="sticky-bar">
          <Text style={styles.price}>{data.price.toLocaleString('en-US')} {data.currency}</Text>
          <View style={styles.stickyActions}>
            <Pressable testID="mail" onPress={() => Linking.openURL("mailto:contact@zima.com?subject=Demande%20d'information%20-%20Appartement%20Moderne").catch(err => console.log("mail error", err))} style={styles.iconOnly}>
              <Mail size={18} color="#0b3b35" />
            </Pressable>
            <Pressable testID="call" onPress={() => Linking.openURL("tel:+221700000000").catch(err => console.log("call error", err))} style={styles.iconOnly}>
              <Phone size={18} color="#0b3b35" />
            </Pressable>
            <Pressable testID="whatsapp" onPress={() => setShowWhatsAppChoice(true)} style={styles.iconOnly}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            </Pressable>
          </View>
        </View>
      </LiquidGlassView>
      
      <WhatsAppChoiceSheet
        visible={showWhatsAppChoice}
        onClose={() => setShowWhatsAppChoice(false)}
        providerName={data.agent.name}
        whatsappNumber="221700000000"
        providerId={data.agent.name.toLowerCase().replace(/\s+/g, '-')}
      />
    </View>
  );
}

function Chip({ label }: { label: string }) {
  const getChipIcon = (chipLabel: string) => {
    const lowerLabel = chipLabel.toLowerCase();
    if (lowerLabel.includes('villa') || lowerLabel.includes('maison') || lowerLabel.includes('appartement')) {
      return <Home size={14} color="#0b3b35" />;
    }
    if (lowerLabel.includes('pièce') || lowerLabel.includes('chambre')) {
      return <Bed size={14} color="#0b3b35" />;
    }
    if (lowerLabel.includes('sdb') || lowerLabel.includes('salle de bain')) {
      return <Bath size={14} color="#0b3b35" />;
    }
    if (lowerLabel.includes('m²') || lowerLabel.includes('surface')) {
      return <Maximize2 size={14} color="#0b3b35" />;
    }
    return null;
  };

  const icon = getChipIcon(label);
  
  return (
    <View style={styles.chip}>
      {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.btn} onPress={onPress} testID={`btn-${label}`}>
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

function ButtonOutline({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.btnOutline} onPress={onPress} testID={`btn-outline-${label}`}>
      <Text style={styles.btnOutlineText}>{label}</Text>
    </Pressable>
  );
}

function AgentCard({ agent, onProfile, onAll }: { agent: Agent; onProfile: () => void; onAll: () => void }) {
  return (
    <View style={styles.agentCard}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <Image source={{ uri: agent.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Text style={styles.agentName}>{agent.name}</Text>
            {agent.verified && (
              <View style={styles.verified}><Text style={styles.verifiedText}>Vérifié</Text></View>
            )}
          </View>
          <Text style={styles.agentRole}>{agent.role}</Text>
        </View>
      </View>
      <View style={styles.agentStats}>
        <Stat label="Évaluations" value={String(agent.stats.reviews)} />
        <Stat label="Note Globale" value={agent.stats.rating.toFixed(2)} />
        <Stat label="Année D’activité" value={String(agent.stats.years)} />
      </View>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
        <ButtonOutline label="Voir le profil" onPress={onProfile} />
        <Button label="Rendez-vous" onPress={onAll} />
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ReviewCard({ name, date, text }: { name: string; date: string; text: string }) {
  return (
    <View style={styles.reviewCard}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={styles.reviewAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewName}>{name}</Text>
          <Text style={styles.reviewDate}>{date}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={String(i)} size={14} color="#f0b429" fill="#f0b429" />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{text}</Text>
    </View>
  );
}

function PopularCard({ item }: { item: PopularItem }) {
  const propertyImages = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop",
  ];
  
  const randomImage = propertyImages[Math.floor(Math.random() * propertyImages.length)];
  
  return (
    <View style={styles.popularCard}>
      <Image source={{ uri: randomImage }} style={styles.popularImg} resizeMode="cover" />
      <View style={{ position: "absolute", left: 12, bottom: 46 }}>
        <Text style={styles.popularTitle}>{item.title}</Text>
      </View>
      <View style={styles.popularBadges}>
        <Text style={styles.popBadge}>{item.info1}</Text>
        <Text style={styles.popBadge}>{item.info2}</Text>
      </View>
      <Pressable style={styles.likeBtn} testID={`like-${item.id}`} onPress={() => {
        console.log("Toggling favorite for property:", item.id);
        // Could implement favorite toggle functionality
      }}>
        <Heart size={16} color="#fff" />
      </Pressable>
    </View>
  );
}

function Amenity({ label, iconType }: { label: string; iconType: string }) {
  const getAmenityIcon = (type: string) => {
    const iconProps = { size: 18, color: "#0f6b5e" };
    switch (type) {
      case "wifi": return <Wifi {...iconProps} />;
      case "car": return <Car {...iconProps} />;
      case "waves": return <Waves {...iconProps} />;
      case "shield": return <Shield {...iconProps} />;
      case "snowflake": return <Snowflake {...iconProps} />;
      case "chef-hat": return <ChefHat {...iconProps} />;
      case "arrow-up": return <ArrowUp {...iconProps} />;
      case "trees": return <Trees {...iconProps} />;
      default: return <Home {...iconProps} />;
    }
  };

  return (
    <View style={styles.amenity}>
      <View style={styles.amenityIconContainer}>
        {getAmenityIcon(iconType)}
      </View>
      <Text style={styles.amenityText}>{label}</Text>
    </View>
  );
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detailRow, last ? null : styles.detailDivider]}>
      <Text style={styles.detailLabelRow}>{label}</Text>
      <Text style={styles.detailValueRow}>{value}</Text>
    </View>
  );
}

const brand = {
  bg: "#F3F7F5",
  deep: "#0b3b35",
  primary: "#0f6b5e",
  card: "#ffffff",
  text: "#0e1b18",
  sub: "#5e726e",
  chip: "#eef2f1",
} as const;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: brand.bg },
  heroWrap: { borderBottomLeftRadius: R, borderBottomRightRadius: R, overflow: "hidden", backgroundColor: "#e7efec" },
  heroOverlays: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  topActions: { position: "absolute", left: 14, right: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  glassCircle: { borderRadius: 999 },
  roundBtn: { height: 40, width: 40, alignItems: "center", justifyContent: "center" },
  pagerGlass: { position: "absolute", right: 14, bottom: 12, borderRadius: 999 },
  pagerContent: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6 },
  pagerText: { color: brand.deep, fontWeight: "800", fontSize: 12 },
  navBtn: { borderRadius: 999, padding: 10 },
  navLeft: { position: "absolute", left: 10, top: "48%" },
  navRight: { position: "absolute", right: 10, top: "48%" },

  content: { flex: 1 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: "900", color: brand.text, marginBottom: 8 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: brand.chip, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, flexDirection: "row", alignItems: "center" },
  chipText: { color: brand.deep, fontWeight: "700", fontSize: 12 },

  locationRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  locationText: { color: brand.primary, fontWeight: "700" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  ratingText: { color: brand.deep, fontWeight: "700" },
  linkText: { color: brand.primary, fontWeight: "700" },

  sectionTitle: { fontSize: 18, fontWeight: "800", color: brand.text },
  body: { color: brand.deep, lineHeight: 20 },

  amenitiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  amenity: { flexDirection: "row", alignItems: "center", backgroundColor: "#f6f8f7", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, width: "48%", minHeight: 44 },
  amenityIconContainer: { width: 24, alignItems: "center", marginRight: 10 },
  amenityText: { color: brand.deep, fontWeight: "700", fontSize: 13, flex: 1 },

  agentCard: { backgroundColor: brand.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#E7EFEA" },
  avatar: { height: 54, width: 54, borderRadius: 27 },
  agentName: { fontWeight: "800", color: brand.text, fontSize: 16 },
  verified: { backgroundColor: "#e9f3ff", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  verifiedText: { color: "#1d4ed8", fontWeight: "700", fontSize: 12 },
  agentRole: { color: brand.sub, marginTop: 2 },
  agentStats: { flexDirection: "row", gap: 10, marginTop: 12, backgroundColor: "#f6f8f7", borderRadius: 12, paddingVertical: 8 },
  statValue: { fontWeight: "800", color: brand.text },
  statLabel: { color: brand.sub, fontSize: 12, marginTop: 2 },

  detailCard: { backgroundColor: brand.card, borderRadius: 20, borderWidth: 1, borderColor: "#E7EFEA", marginTop: 10 },
  detailRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, justifyContent: "space-between" },
  detailDivider: { borderBottomWidth: 1, borderBottomColor: "#EDF3F0" },
  detailLabelRow: { color: brand.sub, fontWeight: "700" },
  detailValueRow: { color: brand.text, fontWeight: "800" },

  mapCard: { backgroundColor: brand.card, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "#E7EFEA" },
  mapInner: { height: 180, justifyContent: "center", alignItems: "center", backgroundColor: "#F1F5F3" },
  mapLabel: { color: "#7da096", marginTop: 8, fontWeight: "700" },
  mapActions: { flexDirection: "row", gap: 10, padding: 12, backgroundColor: "#e7efec" },

  btn: { flex: 1, backgroundColor: brand.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800" },
  btnOutline: { flex: 1, borderWidth: 1.5, borderColor: brand.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center", backgroundColor: "#fff" },
  btnOutlineText: { color: brand.primary, fontWeight: "800" },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reviewCard: { marginTop: 12, backgroundColor: brand.card, borderRadius: 18, padding: 16, gap: 10, borderWidth: 1, borderColor: "#E7EFEA" },
  reviewAvatar: { height: 36, width: 36, borderRadius: 18, backgroundColor: "#dfe7e4" },
  reviewName: { fontWeight: "800", color: brand.text },
  reviewDate: { color: brand.sub, fontSize: 12 },
  reviewText: { color: brand.deep },

  popularCard: { height: 200, width: 200, borderRadius: 18, backgroundColor: "#dfe7e4", marginRight: 14, overflow: "hidden" },
  popularImg: { flex: 1, backgroundColor: "#cdd7d3" },
  popularTitle: { color: "#fff", fontWeight: "800" },
  popularBadges: { position: "absolute", left: 12, bottom: 12, flexDirection: "row", gap: 8 },
  popBadge: { backgroundColor: "rgba(0,0,0,0.65)", color: "#fff", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, overflow: "hidden", fontWeight: "700" },
  likeBtn: { position: "absolute", right: 12, top: 12, height: 34, width: 34, backgroundColor: "rgba(0,0,0,0.35)", borderRadius: 17, alignItems: "center", justifyContent: "center" },

  infoSecCard: { backgroundColor: brand.card, borderRadius: 20, padding: 18, gap: 14, borderWidth: 1, borderColor: "#E7EFEA" },
  infoRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  bullet: { height: 36, width: 36, borderRadius: 10, backgroundColor: "#f1f5f4", alignItems: "center", justifyContent: "center" },
  infoTitle: { fontWeight: "800", color: brand.text },
  infoSubtitle: { color: brand.sub, marginTop: 2 },

  stickyGlass: { position: "absolute", left: CARD, right: CARD, bottom: 16, borderRadius: 24 },
  sticky: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 },
  price: { fontWeight: "900", color: brand.text, fontSize: 18 },
  stickyActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconOnly: { width: 44, height: 44, borderRadius: 12, borderWidth: 1.5, borderColor: "#CFE1DA", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
});
