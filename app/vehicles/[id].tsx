import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet, ActivityIndicator} from 'react-native';
import {useLocalSearchParams, Stack} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicle } from '@/hooks/useVehicles';
import MediaCarousel from '@/components/detail/MediaCarousel';
import Section from '@/components/detail/Section';
import Chip from '@/components/detail/Chip';
import Divider from '@/components/detail/Divider';
import { Star, MapPin, Calendar, Shield, Users, Award } from 'lucide-react-native';

const fuelLabel = {Diesel:'Diesel', Essence:'Essence', Electrique:'Électrique', Hybride:'Hybride', GPL:'GPL'};
const transLabel = {auto:'Auto', manuelle:'Manuelle'};

export default function VehicleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: vehicle, isLoading } = useVehicle(id);

  const openTel = (n?:string)=> n && Linking.openURL(`tel:${n}`);
  const openWA = (n?:string)=> n && Linking.openURL(`https://wa.me/${n.replace(/\D/g,'')}`);
  const openMail = (m?:string)=> m && Linking.openURL(`mailto:${m}`);
  const openMap = (address?: string, city?: string) => {
    const q = encodeURIComponent(`${address || city || ''}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  const fmtMoney = (n:number, cur='XOF') =>
    `${new Intl.NumberFormat('fr-FR').format(n)} ${cur}`;

  const mockReviews = [
    { id: '1', author: 'Jean K.', rating: 5, date: '2025-01-15', comment: 'Excellent service, véhicule impeccable et chauffeur très professionnel.' },
    { id: '2', author: 'Marie D.', rating: 4, date: '2025-01-10', comment: 'Très bonne expérience, je recommande vivement.' },
    { id: '3', author: 'Paul A.', rating: 5, date: '2025-01-05', comment: 'Parfait pour mes déplacements professionnels.' },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Détails' }} />
        <ActivityIndicator size="large" color="#0e5a43" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Détails' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Véhicule introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const forRent = vehicle.kind === 'rent' || vehicle.kind === 'vip' || vehicle.kind === 'driver';
  const images = vehicle.image ? [vehicle.image] : [];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: vehicle.title, headerBackTitle: 'Retour' }} />
      <ScrollView>
        <MediaCarousel images={images} />

        <Section title={`${vehicle.title}`}>
          <Text style={styles.subtitle}>
            {vehicle.city} {vehicle.rating?` • ★ ${vehicle.rating}`:''}
          </Text>
          <Text style={styles.price}>{fmtMoney(vehicle.price, vehicle.currency)} {forRent ? '/ jour' : ''}</Text>
          <View style={styles.chipRow}>
            {!!vehicle.seats && <Chip label={`${vehicle.seats} places`} />}
            {!!vehicle.fuel && <Chip label={fuelLabel[vehicle.fuel as keyof typeof fuelLabel] || vehicle.fuel} />}
            {!!vehicle.gearbox && <Chip label={transLabel[vehicle.gearbox]} />}
            {!!vehicle.doors && <Chip label={`${vehicle.doors} portes`} />}
            {!!vehicle.luggage && <Chip label={`${vehicle.luggage} bag.`} />}
          </View>
        </Section>

        {vehicle.description ? (
          <Section title="Description"><Text style={styles.desc}>{vehicle.description}</Text></Section>
        ) : null}

        <Section title="Équipements inclus">
          <View style={styles.chipRow}>
            {vehicle.airConditioning !== false && <Chip label="Climatisation" />}
            {vehicle.gps !== false && <Chip label="GPS" />}
            {vehicle.bluetooth !== false && <Chip label="Bluetooth" />}
            {vehicle.insurance !== false && <Chip label="Assurance" />}
            {vehicle.amenities?.map((a: string, i: number) => <Chip key={i} label={a} />)}
          </View>
        </Section>

        {forRent && (
          <Section title="Réservation">
            <View style={styles.availBox}>
              <View style={styles.availRow}>
                <Calendar size={20} color={vehicle.availability?.available ? '#10B981' : '#EF4444'} />
                <Text style={[styles.availText, { color: vehicle.availability?.available ? '#10B981' : '#EF4444' }]}>
                  {vehicle.availability?.available ? 'Disponible maintenant' : `Disponible à partir du ${vehicle.availability?.nextAvailable || 'sur demande'}`}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bookBtn} onPress={() => console.log('Réserver:', vehicle.id)}>
              <Text style={styles.bookBtnTxt}>Réserver maintenant</Text>
            </TouchableOpacity>
            <Text style={styles.bookNote}>Confirmation immédiate • Annulation flexible</Text>
          </Section>
        )}

        {(vehicle.agency?.name || vehicle.driver?.name) ? (
          <Section title="À propos du prestataire">
            <View style={styles.providerCard}>
              <View style={styles.providerHeader}>
                <View style={styles.providerAvatar}>
                  <Text style={styles.providerInitial}>{(vehicle.agency?.name || vehicle.driver?.name || 'P')[0].toUpperCase()}</Text>
                </View>
                <View style={styles.providerInfo}>
                  {vehicle.agency?.name && (
                    <View style={styles.providerNameRow}>
                      <Text style={styles.providerName}>{vehicle.agency.name}</Text>
                      {vehicle.agency.verified && <Shield size={16} color="#10B981" fill="#10B981" />}
                    </View>
                  )}
                  {vehicle.driver?.name && (
                    <View style={styles.providerNameRow}>
                      <Text style={styles.providerName}>{vehicle.driver.name}</Text>
                      {vehicle.driver.years && vehicle.driver.years >= 5 && <Award size={16} color="#F59E0B" fill="#F59E0B" />}
                    </View>
                  )}
                  <View style={styles.providerStats}>
                    {vehicle.rating && (
                      <View style={styles.statItem}>
                        <Star size={14} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.statText}>{vehicle.rating} ({vehicle.reviewCount || 0} avis)</Text>
                      </View>
                    )}
                    {vehicle.driver?.trips && (
                      <View style={styles.statItem}>
                        <Users size={14} color="#6B7280" />
                        <Text style={styles.statText}>{vehicle.driver.trips} courses</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              
              {vehicle.driver?.years && (
                <Text style={styles.providerDetail}>✓ {vehicle.driver.years} ans d&apos;expérience</Text>
              )}
              {vehicle.driver?.languages?.length && (
                <Text style={styles.providerDetail}>✓ Langues : {vehicle.driver.languages.join(', ')}</Text>
              )}
              {vehicle.agency?.address && (
                <TouchableOpacity style={styles.providerLocation} onPress={() => openMap(vehicle.agency?.address, vehicle.city)}>
                  <MapPin size={16} color="#0E9F6E" />
                  <Text style={styles.providerLocationText}>{vehicle.agency.address}</Text>
                </TouchableOpacity>
              )}
            </View>
          </Section>
        ):null}

        {vehicle.rating && (
          <Section title="Notes et avis">
            <View style={styles.ratingOverview}>
              <View style={styles.ratingScore}>
                <Text style={styles.ratingNumber}>{vehicle.rating}</Text>
                <View style={styles.ratingStars}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} color="#F59E0B" fill={i <= Math.floor(vehicle.rating!) ? "#F59E0B" : "none"} />
                  ))}
                </View>
                <Text style={styles.ratingCount}>{vehicle.reviewCount || 0} avis</Text>
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

        {vehicle.policies?.length ? (
          <Section title="Conditions et politiques">
            {vehicle.policies.map((p: string, i: number) => (
              <Text key={i} style={styles.policyItem}>• {p}</Text>
            ))}
          </Section>
        ) : null}

        <Section title="Contacter">
          <View style={styles.btnRow}>
            <Btn label="Appeler" onPress={()=>openTel(vehicle.agency?.phone)} />
            <Btn label="WhatsApp" onPress={()=>openWA(vehicle.agency?.phone)} />
            <Btn label="Email" onPress={()=>openMail('')} />
          </View>
        </Section>

        <Divider/>
      </ScrollView>
    </SafeAreaView>
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
  loader: { marginTop: 40 },
  notFound: { padding: 16, alignItems: 'center', marginTop: 40 },
  notFoundText: { fontSize: 16, color: '#6b7280' },
  subtitle:{color:'#334155', fontWeight:'700', marginBottom:6},
  price:{fontSize:22, fontWeight:'900', color:'#0F172A', marginTop:4},
  chipRow:{flexDirection:'row', flexWrap:'wrap', marginTop:10},
  desc:{color:'#334155', lineHeight:22},
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
