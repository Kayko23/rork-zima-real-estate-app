import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import MediaCarousel from '@/components/detail/MediaCarousel';
import Section from '@/components/detail/Section';
import Chip from '@/components/detail/Chip';
import Divider from '@/components/detail/Divider';

export type TravelDetailParams = {
  id: string;
  title: string;
  city: string;
  country?: string;
  images?: string[];
  rating?: number;
  pricePerNight?: number;
  currency?: string;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  description?: string;
  addressLine?: string;
  contact?: { phone?: string; whatsapp?: string; email?: string; website?: string };
  policies?: string[];
};

export default function TravelDetail() {
  const params = useLocalSearchParams();
  const d = params as unknown as TravelDetailParams;

  const openTel = (num?:string) => num && Linking.openURL(`tel:${num}`);
  const openWA  = (num?:string) => num && Linking.openURL(`https://wa.me/${num.replace(/\D/g,'')}`);
  const openMail = (m?:string) => m && Linking.openURL(`mailto:${m}`);
  const openWeb = (u?:string) => u && Linking.openURL(u);

  const fmtMoney = (n:number, cur='FCFA') =>
    `${new Intl.NumberFormat('fr-FR').format(n)} ${cur}`;

  const images = typeof d.images === 'string' ? JSON.parse(d.images as string) : d.images;
  const amenities = typeof d.amenities === 'string' ? JSON.parse(d.amenities as string) : d.amenities;
  const contact = typeof d.contact === 'string' ? JSON.parse(d.contact as string) : d.contact;
  const policies = typeof d.policies === 'string' ? JSON.parse(d.policies as string) : d.policies;

  return (
    <ScrollView style={styles.container}>
      <MediaCarousel images={images} />

      <Section title={d.title}>
        <Text style={styles.subtitle}>
          {d.city}{d.country?` • ${d.country}`:''} {d.rating?` • ★ ${d.rating}`:''}
        </Text>
        {typeof d.pricePerNight === 'number' && (
          <Text style={styles.price}>{fmtMoney(Number(d.pricePerNight), d.currency||'FCFA')} / nuit</Text>
        )}
        <View style={styles.chipRow}>
          {!!d.guests && <Chip label={`${d.guests} voyageurs`} />}
          {!!d.bedrooms && <Chip label={`${d.bedrooms} ch`} />}
          {!!d.bathrooms && <Chip label={`${d.bathrooms} sdb`} />}
        </View>
      </Section>

      {d.description ? (
        <Section title="Description"><Text style={styles.desc}>{d.description}</Text></Section>
      ) : null}

      {!!amenities?.length && (
        <Section title="Équipements">
          <View style={styles.chipRow}>
            {amenities.map((a:string,i:number)=><Chip key={i} label={a} />)}
          </View>
        </Section>
      )}

      {!!policies?.length && (
        <Section title="Politiques">
          {policies.map((p:string,i:number)=><Text key={i} style={styles.policy}>• {p}</Text>)}
        </Section>
      )}

      <Section title="Contact">
        <View style={styles.btnRow}>
          <Btn label="Appeler" onPress={()=>openTel(contact?.phone)} />
          <Btn label="WhatsApp" onPress={()=>openWA(contact?.whatsapp||contact?.phone)} />
          <Btn label="Email" onPress={()=>openMail(contact?.email)} />
          <Btn label="Site web" onPress={()=>openWeb(contact?.website)} />
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
  policy:{color:'#334155', marginBottom:6},
  btnRow:{flexDirection:'row', gap:12, flexWrap:'wrap'},
  btn:{backgroundColor:'#0F172A', paddingHorizontal:14, paddingVertical:10, borderRadius:10},
  btnTxt:{color:'#fff', fontWeight:'800'}
});
