import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import MediaCarousel from '@/components/detail/MediaCarousel';
import Section from '@/components/detail/Section';
import Chip from '@/components/detail/Chip';
import Divider from '@/components/detail/Divider';

export type VehicleDetailParams = {
  id: string;
  title: string;
  city: string;
  country?: string;
  images?: string[];
  rating?: number;
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
  agency?: { name?: string; verified?: boolean };
  driver?: { name?: string; years?: number; languages?: string[] };
  contact?: { phone?: string; whatsapp?: string; email?: string };
};

const fuelLabel = {diesel:'Diesel', essence:'Essence', electrique:'Électrique', hybride:'Hybride', gpl:'GPL', autre:'Autre'};
const transLabel = {auto:'Auto', manuelle:'Manuelle'};

export default function VehicleDetail() {
  const params = useLocalSearchParams();
  const v = params as unknown as VehicleDetailParams;

  const openTel = (n?:string)=> n && Linking.openURL(`tel:${n}`);
  const openWA = (n?:string)=> n && Linking.openURL(`https://wa.me/${n.replace(/\D/g,'')}`);
  const openMail = (m?:string)=> m && Linking.openURL(`mailto:${m}`);

  const fmtMoney = (n:number, cur='XOF') =>
    `${new Intl.NumberFormat('fr-FR').format(n)} ${cur}`;

  const images = typeof v.images === 'string' ? JSON.parse(v.images as string) : v.images;
  const contact = typeof v.contact === 'string' ? JSON.parse(v.contact as string) : v.contact;
  const agency = typeof v.agency === 'string' ? JSON.parse(v.agency as string) : v.agency;
  const driver = typeof v.driver === 'string' ? JSON.parse(v.driver as string) : v.driver;

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

      {agency?.name || driver?.name ? (
        <Section title="Opérateur">
          {agency?.name && (
            <Text style={styles.operator}>
              {agency.name} {agency.verified ? '• Vérifiée ✓' : ''}
            </Text>
          )}
          {driver?.name && (
            <View style={{marginTop:6}}>
              <Text style={styles.operator}>{driver.name}</Text>
              {!!driver.years && <Text style={styles.desc}>{driver.years} ans d&apos;expérience</Text>}
              {!!driver.languages?.length && <Text style={styles.desc}>Langues : {driver.languages.join(', ')}</Text>}
            </View>
          )}
        </Section>
      ):null}

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
  desc:{color:'#334155'},
  operator:{color:'#0F172A', fontWeight:'800'},
  btnRow:{flexDirection:'row', gap:12},
  btn:{backgroundColor:'#0F172A', paddingHorizontal:14, paddingVertical:10, borderRadius:10},
  btnTxt:{color:'#fff', fontWeight:'800'}
});
