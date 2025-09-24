import React, { useMemo, useState } from "react";
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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Heart, Share2, Star, MapPin, Phone, MessageCircle } from "lucide-react-native";

const { width } = Dimensions.get("window");
const CARD = 16;
const R = 18;

type SafetyItem = { title: string; subtitle: string };
type Agent = {
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

  const data: PropertyData = useMemo(
    () => ({
      id,
      title: "Appartement Moderne au Centre-ville de Dakar",
      city: "Dakar",
      country: "Senegal",
      type: "villa",
      chips: ["villa", "3 pièces", "2 SDB", "85 m²"],
      price: 125000,
      currency: "$US",
      premium: true,
      rating: 4.8,
      reviewsCount: 23,
      images: [
        "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448075-bb4caa6c1e56?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505691723518-36a5ac3b2bba?q=80&w=1200&auto=format&fit=crop",
      ],
      description:
        "Magnifique villa moderne avec vue imprenable sur la ville. Design contemporain, finitions de haute qualité, et excellent emplacement près du quartier des affaires.",
      agent: {
        name: "Aminata Diallo",
        verified: true,
        stats: { reviews: 150, rating: 4.78, years: 5 },
        role: "Agent immobilier",
        avatar:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
      },
      safety: [
        {
          title: "Politique de vérification",
          subtitle: "Tous nos agents sont vérifiés et certifiés",
        },
        {
          title: "Sécurité des visites",
          subtitle: "Visites accompagnées et sécurisées",
        },
      ],
      popularInCity: [
        { id: "p1", title: "appartement · Lagos", info1: "85 $ pour 2 nuits", info2: "4.6" },
        { id: "p2", title: "boutique · Cotonou", info1: "400 $/mois", info2: "4.3" },
      ],
    }),
    [id]
  );

  const [imgIndex, setImgIndex] = useState<number>(0);

  const openMaps = () => {
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
    try {
      const q = encodeURIComponent(`${data.city}, ${data.country}`);
      const url = Platform.OS === "ios" ? `http://maps.apple.com/?daddr=${q}` : `https://www.google.com/maps/dir/?api=1&destination=${q}`;
      console.log("Open itinerary", url);
      Linking.openURL(url).catch(err => console.log("Linking error", err));
    } catch (e) {
      console.log("openItinerary error", e);
    }
  };

  return (
    <View style={styles.screen} testID="property-detail-screen">
      <View style={styles.topBar}>
        <IconBtn testID="back" onPress={() => { console.log("back press"); router.back(); }}>
          <ChevronLeft size={22} color="#0b3b35" />
        </IconBtn>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <IconBtn testID="share" onPress={() => console.log("share press")}> 
            <Share2 size={20} color="#0b3b35" />
          </IconBtn>
          <IconBtn testID="fav" onPress={() => console.log("favorite press")}> 
            <Heart size={20} color="#0b3b35" />
          </IconBtn>
        </View>
      </View>

      <FlatList
        data={data.images}
        keyExtractor={(_, i) => `img-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setImgIndex(idx);
          console.log("image index", idx);
        }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.hero} />
        )}
      />

      <View style={styles.imgPager}>
        <Text style={styles.pagerText}>{imgIndex + 1} / {data.images.length}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: CARD, paddingTop: 10 }}>
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
            <Text style={styles.ratingText}>
              {data.rating.toFixed(1)} • <Text style={styles.linkText}>{data.reviewsCount} avis</Text>
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: CARD, gap: 12, marginTop: 8 }}>
          <Text style={styles.sectionTitle}>Description</Text>
          <AppCard title="Installer ZIMA" subtitle="Installez l’app ZIMA pour un accès rapide et des notifications" />
          <Text style={styles.body}>{data.description}</Text>
          <Pressable testID="read-more"><Text style={styles.linkText}>Lire la suite</Text></Pressable>
        </View>

        <View style={{ paddingHorizontal: CARD, marginTop: 18 }}>
          <Text style={styles.sectionTitle}>Faites connaissance avec votre conseiller</Text>
        </View>
        <View style={{ paddingHorizontal: CARD }}>
          <AgentCard
            agent={data.agent}
            onProfile={() => console.log("open agent profile")}
            onAll={() => console.log("open agent listings")}
          />
        </View>

        <View style={{ paddingHorizontal: CARD, marginTop: 18, gap: 10 }}>
          <Text style={styles.sectionTitle}>Détails du bien</Text>
          <View style={styles.grid}>
            <DetailCell label="TYPE" value="villa" />
            <DetailCell label="ÉTAGE" value="2ème étage" />
            <DetailCell label="ANNÉE" value="2020" />
            <DetailCell label="CHARGES" value="50 USD/mois" />
            <DetailCell label="TITRE FONCIER" value="Oui" />
            <DetailCell label="ORIENTATION" value="Sud-Est" />
          </View>
        </View>

        <View style={{ paddingHorizontal: CARD, marginTop: 18 }}>
          <Text style={styles.sectionTitle}>Équipements</Text>
          <View style={styles.amenities}>
            <Amenity label="Wifi gratuit" />
            <Amenity label="Parking gratuit" />
            <Amenity label="Piscine" />
            <Amenity label="Sécurité 24h" />
          </View>
          <Pressable style={{ marginTop: 6 }} testID="show-amenities">
            <Text style={styles.linkText}>Afficher les 9 équipements</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: CARD, marginTop: 18 }}>
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

        <View style={{ paddingHorizontal: CARD, marginTop: 18 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>{data.rating.toFixed(1)} • {data.reviewsCount} avis</Text>
            <Pressable testID="all-reviews"><Text style={styles.linkText}>Tous les avis</Text></Pressable>
          </View>
          <ReviewCard name="Moussa Ba" date="15/11/2024" text="Excellent appartement, très bien situé et l’agent était très professionnel. Je recommande vivement !" />
        </View>

        <View style={{ paddingHorizontal: CARD, marginTop: 18 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Biens populaires • {data.city}</Text>
            <Pressable testID="see-all-popular"><Text style={styles.linkText}>Voir tout</Text></Pressable>
          </View>
        </View>
        <FlatList
          data={data.popularInCity}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: CARD, paddingBottom: 8 }}
          renderItem={({ item }) => <PopularCard item={item} />}
        />

        <View style={{ paddingHorizontal: CARD, marginTop: 12, marginBottom: 24 }}>
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
            <Pressable testID="report"><Text style={[styles.linkText, { marginTop: 8 }]}>Signaler cette annonce</Text></Pressable>
          </View>
        </View>
      </ScrollView>

      <StickyBar
        price={data.price}
        currency={data.currency}
        onContact={() => console.log("contact press")}
        onCall={() => Linking.openURL("tel:+221700000000").catch(err => console.log("call error", err))}
        onWhatsApp={() => Linking.openURL("https://wa.me/221700000000?text=Bonjour%20ZIMA").catch(err => console.log("wa error", err))}
      />
    </View>
  );
}

function IconBtn({ children, onPress, testID }: { children: React.ReactNode; onPress: () => void; testID?: string }) {
  return (
    <Pressable testID={testID} onPress={onPress} style={styles.iconBtn}>{children}</Pressable>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
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

function AppCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.appCard}>
      <View style={styles.badgeZ}><Text style={{ color: "#fff", fontWeight: "700" }}>Z</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.appTitle}>{title}</Text>
        <Text style={styles.appSubtitle}>{subtitle}</Text>
      </View>
    </View>
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
        <Stat label="ÉVALUATIONS" value={String(agent.stats.reviews)} />
        <Stat label="NOTE GLOBALE" value={agent.stats.rating.toFixed(2)} />
        <Stat label="ANNÉES D’ACTIVITÉ" value={String(agent.stats.years)} />
      </View>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
        <ButtonOutline label="Voir le profil" onPress={onProfile} />
        <Button label="Tous ses biens" onPress={onAll} />
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

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailCell}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function Amenity({ label }: { label: string }) {
  return (
    <View style={styles.amenity}>
      <Text style={styles.amenityIcon}>•</Text>
      <Text style={styles.amenityText}>{label}</Text>
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
  return (
    <View style={styles.popularCard}>
      <View style={styles.popularImg} />
      <View style={{ position: "absolute", left: 12, bottom: 46 }}>
        <Text style={styles.popularTitle}>{item.title}</Text>
      </View>
      <View style={styles.popularBadges}>
        <Text style={styles.popBadge}>{item.info1}</Text>
        <Text style={styles.popBadge}>{item.info2}</Text>
      </View>
      <Pressable style={styles.likeBtn} testID={`like-${item.id}`}>
        <Heart size={16} color="#fff" />
      </Pressable>
    </View>
  );
}

function StickyBar({ price, currency, onContact, onCall, onWhatsApp }: { price: number; currency: string; onContact: () => void; onCall: () => void; onWhatsApp: () => void }) {
  return (
    <View style={styles.sticky} testID="sticky-bar">
      <Text style={styles.price}>{Intl.NumberFormat("en-US").format(price)} {currency}</Text>
      <View style={styles.stickyActions}>
        <Button label="Contacter" onPress={onContact} />
        <IconBtn testID="call" onPress={onCall}><Phone size={18} color="#0b3b35" /></IconBtn>
        <IconBtn testID="whatsapp" onPress={onWhatsApp}><MessageCircle size={18} color="#0b3b35" /></IconBtn>
      </View>
    </View>
  );
}

const brand = {
  bg: "#eef4f1",
  deep: "#0b3b35",
  primary: "#0f6b5e",
  gold: "#9c7831",
  card: "#ffffff",
  text: "#0e1b18",
  sub: "#5e726e",
  chip: "#f0f3f2",
} as const;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: brand.bg },
  topBar: { position: "absolute", top: 10, left: 10, right: 10, zIndex: 10, flexDirection: "row", justifyContent: "space-between" },
  iconBtn: { height: 38, width: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.92)", justifyContent: "center", alignItems: "center" },
  hero: { width, height: 240, resizeMode: "cover" },
  imgPager: { position: "absolute", right: 14, top: 212, backgroundColor: "rgba(0,0,0,0.4)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  pagerText: { color: "#fff", fontWeight: "600" },
  content: { flex: 1 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: "800", color: brand.text, marginBottom: 8 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: brand.chip, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  chipText: { color: brand.deep, fontWeight: "600" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  locationText: { color: brand.primary, fontWeight: "700" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  ratingText: { color: brand.deep, fontWeight: "700" },
  linkText: { color: brand.primary, fontWeight: "700" },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: brand.text, marginBottom: 8 },
  body: { color: brand.deep, lineHeight: 20 },
  appCard: { flexDirection: "row", gap: 12, padding: 12, backgroundColor: brand.card, borderRadius: R, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  badgeZ: { height: 36, width: 36, borderRadius: 18, backgroundColor: brand.primary, justifyContent: "center", alignItems: "center" },
  appTitle: { fontWeight: "800", color: brand.text },
  appSubtitle: { color: brand.sub, marginTop: 4 },
  agentCard: { backgroundColor: brand.card, borderRadius: R, padding: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  avatar: { height: 54, width: 54, borderRadius: 27 },
  agentName: { fontWeight: "800", color: brand.text, fontSize: 16 },
  verified: { backgroundColor: "#e9f3ff", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  verifiedText: { color: "#1d4ed8", fontWeight: "700", fontSize: 12 },
  agentRole: { color: brand.sub, marginTop: 2 },
  agentStats: { flexDirection: "row", gap: 10, marginTop: 12, backgroundColor: "#f6f8f7", borderRadius: 12, paddingVertical: 8 },
  statValue: { fontWeight: "800", color: brand.text },
  statLabel: { color: brand.sub, fontSize: 12, marginTop: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  detailCell: { width: (width - CARD * 2 - 10) / 2, backgroundColor: brand.card, borderRadius: 14, padding: 12 },
  detailLabel: { color: brand.sub, fontSize: 12, fontWeight: "700" },
  detailValue: { color: brand.text, fontWeight: "800", marginTop: 6 },
  amenities: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 6 },
  amenity: { flexDirection: "row", gap: 8, alignItems: "center", backgroundColor: "#f6f8f7", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  amenityIcon: { fontSize: 18 },
  amenityText: { color: brand.deep, fontWeight: "700" },
  mapCard: { backgroundColor: brand.card, borderRadius: R, overflow: "hidden" },
  mapInner: { height: 150, justifyContent: "center", alignItems: "center", backgroundColor: "#eef4f1" },
  mapLabel: { color: "#7da096", marginTop: 8, fontWeight: "700" },
  mapActions: { flexDirection: "row", gap: 10, padding: 12, backgroundColor: "#e7efec" },
  btn: { flex: 1, backgroundColor: brand.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800" },
  btnOutline: { flex: 1, borderWidth: 1.5, borderColor: brand.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center", backgroundColor: "#fff" },
  btnOutlineText: { color: brand.primary, fontWeight: "800" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reviewCard: { marginTop: 10, backgroundColor: brand.card, borderRadius: R, padding: 12, gap: 8 },
  reviewAvatar: { height: 36, width: 36, borderRadius: 18, backgroundColor: "#dfe7e4" },
  reviewName: { fontWeight: "800", color: brand.text },
  reviewDate: { color: brand.sub, fontSize: 12 },
  reviewText: { color: brand.deep },
  popularCard: { height: 210, width: 220, borderRadius: R, backgroundColor: "#dfe7e4", marginRight: 12, overflow: "hidden" },
  popularImg: { flex: 1, backgroundColor: "#cdd7d3" },
  popularTitle: { color: "#fff", fontWeight: "800" },
  popularBadges: { position: "absolute", left: 12, bottom: 12, flexDirection: "row", gap: 8 },
  popBadge: { backgroundColor: "rgba(0,0,0,0.65)", color: "#fff", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, overflow: "hidden", fontWeight: "700" },
  likeBtn: { position: "absolute", right: 12, top: 12, height: 34, width: 34, backgroundColor: "rgba(0,0,0,0.35)", borderRadius: 17, alignItems: "center", justifyContent: "center" },
  infoSecCard: { backgroundColor: brand.card, borderRadius: R, padding: 12, gap: 10 },
  infoRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  bullet: { height: 36, width: 36, borderRadius: 10, backgroundColor: "#f1f5f4", alignItems: "center", justifyContent: "center" },
  infoTitle: { fontWeight: "800", color: brand.text },
  infoSubtitle: { color: brand.sub, marginTop: 2 },
  sticky: { position: "absolute", left: CARD, right: CARD, bottom: 16, backgroundColor: "#ffffff", borderRadius: 20, padding: 12, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 14, elevation: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  price: { fontWeight: "900", color: brand.text, fontSize: 16 },
  stickyActions: { flexDirection: "row", alignItems: "center", gap: 10 },
});