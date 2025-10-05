import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import MediaCarousel from '@/components/detail/MediaCarousel';
import Section from '@/components/detail/Section';
import Chip from '@/components/detail/Chip';
import Divider from '@/components/detail/Divider';
import { Star, MapPin, Calendar, Shield, Users, Award } from 'lucide-react-native';

export type VehicleDetailParams = {
  id: string;
  title: string;
  city: string;
  country?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  forRent?: boolean;
  pricePerDay?: number;
  price?: number;
  currency?: string;
  seats?: number;
  fuel?: 'diesel'|'essence'|'electrique'|'hybride'|'gpl'|'autre';
  transmission?: 'auto'|'manuelle';
  doors?: number;
  luggage?: number;
  description?: string;
  agency?: { name?: string; verified?: boolean; address?: string; phone?: string };
  driver?: { name?: string; years?: number; languages?: string[]; trips?: number };
  contact?: { phone?: string; whatsapp?: string; email?: string };
  amenities?: string[];
  policies?: string[];
  availability?: { available: boolean; nextAvailable?: string };
  insurance?: boolean;
  gps?: boolean;
  airConditioning?: boolean;
  bluetooth?: boolean;
};

const fuelLabel = {diesel:'Diesel', essence:'Essence', electrique:'Électrique', hybride:'Hybride', gpl:'GPL', autre:'Autre'};
const transLabel = {auto:'Auto', manuelle:'Manuelle'};

export default function VehicleDetail() {
  const params = useLocalSearchParams();
  const v = params as unknown as VehicleDetailParams;

  const openTel = (n?:string)=> n && Linking.openURL(`tel:${n}`);
  const openWA = (n?:string)=> n && Linking.openURL(`https://wa.me/${n.replace(/\D/g,'')}`);
  const openMail = (m?:string)=> m && Linking.openURL(`mailto:${m}`);
  const openMap = () => {
    const q = encodeURIComponent(`${agency?.address || v.city}, ${v.country || ''}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  const fmtMoney = (n:number, cur='XOF') =>
    `${new Intl.NumberFormat('fr-FR').format(n)} ${cur}`;

  const images = typeof v.images === 'string' ? JSON.parse(v.images as string) : v.images;
  const contact = typeof v.contact === 'string' ? JSON.parse(v.contact as string) : v.contact;
  const agency = typeof v.agency === 'string' ? JSON.parse(v.agency as string) : v.agency;
  const driver = typeof v.driver === 'string' ? JSON.parse(v.driver as string) : v.driver;
  const amenities = typeof v.amenities === 'string' ? JSON.parse(v.amenities as string) : v.amenities;
  const policies = typeof v.policies === 'string' ? JSON.parse(v.policies as string) : v.policies;
  const availability = typeof v.availability === 'string' ? JSON.parse(v.availability as string) : v.availability;

  const mockReviews = [
    { id: '1', author: 'Jean K.', rating: 5, date: '2025-01-15', comment: 'Excellent service, véhicule impeccable et chauffeur très professionnel.' },
    { id: '2', author: 'Marie D.', rating: 4, date: '2025-01-10', comment: 'Très bonne expérience, je recommande vivement.' },
    { id: '3', author: 'Paul A.', rating: 5, date: '2025-01-05', comment: 'Parfait pour mes déplacements professionnels.' },
  ];

  return (
    <ScrollView style={styles.container}>
      <MediaCarousel images={images} />

      <Section title={`${v.title}`}>
        <Text style={styles.subtitle}>
          {v.city}{v.country?` • ${v.country}`:''} {v.rating?` • ★ ${v.rating}`:''}
        </Text>
        {v.forRent && typeof v.pricePerDay==='number' ? (
          <Text style={styles.price}>{fmtMoney(Number(v.pricePerDay), v.currency||'XOF')} / jour</Text>
        ) : (typeof v.price==='number' ? (
          <Text style={styles.price}>{fmtMoney(Number(v.price), v.currency||'XOF')}</Text>
        ) : null)}
        <View style={styles.chipRow}>
          {!!v.seats && <Chip label={`${v.seats} places`} />}
          {!!v.fuel && <Chip label={fuelLabel[v.fuel]} />}
          {!!v.transmission && <Chip label={transLabel[v.transmission]} />}
          {!!v.doors && <Chip label={`${v.doors} portes`} />}
          {!!v.luggage && <Chip label={`${v.luggage} bag.`} />}
        </View>
      </Section>

      {v.description ? (
        <Section title="Description"><Text style={styles.desc}>{v.description}</Text></Section>
      ) : null}

      {/* Équipements */}
      <Section title="Équipements inclus">
        <View style={styles.chipRow}>
          {v.airConditioning !== false && <Chip label="Climatisation" />}
          {v.gps !== false && <Chip label="GPS" />}
          {v.bluetooth !== false && <Chip label="Bluetooth" />}
          {v.insurance !== false && <Chip label="Assurance" />}
          {amenities?.map((a: string, i: number) => <Chip key={i} label={a} />)}
        </View>
      </Section>

      {/* Disponibilité & Réservation */}
      {v.forRent && (
        <Section title="Réservation">
          <View style={styles.availBox}>
            <View style={styles.availRow}>
              <Calendar size={20} color={availability?.available ? '#10B981' : '#EF4444'} />
              <Text style={[styles.availText, { color: availability?.available ? '#10B981' : '#EF4444' }]}>
                {availability?.available ? 'Disponible maintenant' : `Disponible à partir du ${availability?.nextAvailable || 'sur demande'}`}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={() => {
            console.log('Réserver:', v.id);
          }}>
            <Text style={styles.bookBtnTxt}>Réserver maintenant</Text>
          </TouchableOpacity>
          <Text style={styles.bookNote}>Confirmation immédiate • Annulation flexible</Text>
        </Section>
      )}

      {/* Carte du prestataire */}
      {agency?.name || driver?.name ? (
        <Section title="À propos du prestataire">
          <View style={styles.providerCard}>
            <View style={styles.providerHeader}>
              <View style={styles.providerAvatar}>
                <Text style={styles.providerInitial}>{(agency?.name || driver?.name || 'P')[0].toUpperCase()}</Text>
              </View>
              <View style={styles.providerInfo}>
                {agency?.name && (
                  <View style={styles.providerNameRow}>
                    <Text style={styles.providerName}>{agency.name}</Text>
                    {agency.verified && <Shield size={16} color="#10B981" fill="#10B981" />}
                  </View>
                )}
                {driver?.name && (
                  <View style={styles.providerNameRow}>
                    <Text style={styles.providerName}>{driver.name}</Text>
                    {driver.years && driver.years >= 5 && <Award size={16} color="#F59E0B" fill="#F59E0B" />}
                  </View>
                )}
                <View style={styles.providerStats}>
                  {v.rating && (
                    <View style={styles.statItem}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.statText}>{v.rating} ({v.reviewCount || 0} avis)</Text>
                    </View>
                  )}
                  {driver?.trips && (
                    <View style={styles.statItem}>
                      <Users size={14} color="#6B7280" />
                      <Text style={styles.statText}>{driver.trips} courses</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            {driver?.years && (
              <Text style={styles.providerDetail}>✓ {driver.years} ans d&apos;expérience</Text>
            )}
            {driver?.languages?.length && (
              <Text style={styles.providerDetail}>✓ Langues : {driver.languages.join(', ')}</Text>
            )}
            {agency?.address && (
              <TouchableOpacity style={styles.providerLocation} onPress={openMap}>
                <MapPin size={16} color="#0E9F6E" />
                <Text style={styles.providerLocationText}>{agency.address}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Section>
      ):null}

      {/* Notes et avis */}
      {v.rating && (
        <Section title="Notes et avis">
          <View style={styles.ratingOverview}>
            <View style={styles.ratingScore}>
              <Text style={styles.ratingNumber}>{v.rating}</Text>
              <View style={styles.ratingStars}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} color="#F59E0B" fill={i <= Math.floor(v.rating!) ? "#F59E0B" : "none"} />
                ))}
              </View>
              <Text style={styles.ratingCount}>{v.reviewCount || 0} avis</Text>
            </View>
          </View>
          
          {mockReviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewInitial}>{review.author[0]}</Text>
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewAuthor}>{review.author}</Text>
                  <View style={styles.reviewStars}>
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={12} color="#F59E0B" fill={i <= review.rating ? "#F59E0B" : "none"} />
                    ))}
                    <Text style={styles.reviewDate}> • {review.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
          
          <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>Voir tous les avis</Text>
          </TouchableOpacity>
        </Section>
      )}

      {/* Politiques */}
      {policies?.length ? (
        <Section title="Conditions et politiques">
          {policies.map((p: string, i: number) => (
            <Text key={i} style={styles.policyItem}>• {p}</Text>
          ))}
        </Section>
      ) : null}

      <Section title="Contacter">
        <View style={styles.btnRow}>
          <Btn label="Appeler" onPress={()=>openTel(contact?.phone)} />
          <Btn label="WhatsApp" onPress={()=>openWA(contact?.whatsapp||contact?.phone)} />
          <Btn label="Email" onPress={()=>openMail(contact?.email)} />
        </View>
      </Section>

      <Divider/>
    </ScrollView>
  );
}

function Btn({label,onPress}:{label:string; onPress:()=>void}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn}>
      <Text style={styles.btnTxt}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#fff'},
  subtitle:{color:'#334155', fontWeight:'700', marginBottom:6},
  price:{fontSize:22, fontWeight:'900', color:'#0F172A'},
  chipRow:{flexDirection:'row', flexWrap:'wrap', marginTop:10},
  desc:{color:'#334155', lineHeight:22},
  operator:{color:'#0F172A', fontWeight:'800'},
  btnRow:{flexDirection:'row', gap:12, flexWrap:'wrap'},
  btn:{backgroundColor:'#0F172A', paddingHorizontal:14, paddingVertical:10, borderRadius:10},
  btnTxt:{color:'#fff', fontWeight:'800'},
  
  availBox:{backgroundColor:'#F9FAFB', padding:12, borderRadius:12, marginBottom:12},
  availRow:{flexDirection:'row', alignItems:'center', gap:8},
  availText:{fontSize:15, fontWeight:'700'},
  bookBtn:{backgroundColor:'#0F172A', padding:16, borderRadius:12, alignItems:'center', marginTop:8},
  bookBtnTxt:{color:'#fff', fontSize:16, fontWeight:'800'},
  bookNote:{textAlign:'center', color:'#6B7280', fontSize:13, marginTop:8},
  
  providerCard:{backgroundColor:'#F9FAFB', padding:16, borderRadius:12},
  providerHeader:{flexDirection:'row', gap:12, marginBottom:12},
  providerAvatar:{width:56, height:56, borderRadius:28, backgroundColor:'#0F172A', alignItems:'center', justifyContent:'center'},
  providerInitial:{color:'#fff', fontSize:24, fontWeight:'800'},
  providerInfo:{flex:1},
  providerNameRow:{flexDirection:'row', alignItems:'center', gap:6, marginBottom:4},
  providerName:{fontSize:18, fontWeight:'800', color:'#0F172A'},
  providerStats:{flexDirection:'row', gap:12, marginTop:4},
  statItem:{flexDirection:'row', alignItems:'center', gap:4},
  statText:{fontSize:13, color:'#6B7280', fontWeight:'600'},
  providerDetail:{color:'#334155', fontSize:14, marginBottom:6},
  providerLocation:{flexDirection:'row', alignItems:'center', gap:6, marginTop:8},
  providerLocationText:{color:'#0E9F6E', fontSize:14, fontWeight:'700'},
  
  ratingOverview:{marginBottom:16},
  ratingScore:{alignItems:'center', padding:16, backgroundColor:'#F9FAFB', borderRadius:12},
  ratingNumber:{fontSize:48, fontWeight:'900', color:'#0F172A'},
  ratingStars:{flexDirection:'row', gap:4, marginVertical:8},
  ratingCount:{fontSize:14, color:'#6B7280', fontWeight:'600'},
  
  reviewCard:{backgroundColor:'#F9FAFB', padding:14, borderRadius:12, marginBottom:12},
  reviewHeader:{flexDirection:'row', gap:10, marginBottom:8},
  reviewAvatar:{width:40, height:40, borderRadius:20, backgroundColor:'#E5E7EB', alignItems:'center', justifyContent:'center'},
  reviewInitial:{color:'#6B7280', fontSize:16, fontWeight:'700'},
  reviewMeta:{flex:1},
  reviewAuthor:{fontSize:15, fontWeight:'800', color:'#0F172A', marginBottom:4},
  reviewStars:{flexDirection:'row', alignItems:'center', gap:2},
  reviewDate:{fontSize:12, color:'#9CA3AF', marginLeft:4},
  reviewComment:{color:'#334155', fontSize:14, lineHeight:20},
  
  seeAllBtn:{alignItems:'center', padding:12, marginTop:8},
  seeAllText:{color:'#0F172A', fontWeight:'800', fontSize:15},
  
  policyItem:{color:'#334155', fontSize:14, marginBottom:8, lineHeight:20},
});
