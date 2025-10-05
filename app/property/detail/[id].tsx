import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import MediaCarousel from '@/components/detail/MediaCarousel';
import Section from '@/components/detail/Section';
import Chip from '@/components/detail/Chip';
import Divider from '@/components/detail/Divider';

export type PropertyDetailParams = {
  id: string;
  title: string;
  city: string;
  country?: string;
  images?: string[];
  price?: number;
  currency?: string;
  listingType: 'A_VENDRE'|'A_LOUER';
  area?: number;
  beds?: number;
  baths?: number;
  rooms?: number;
  rating?: number;
  description?: string;
  amenities?: string[];
  contact?: { phone?: string; whatsapp?: string; email?: string };
  addressLine?: string;
  coordinates?: { lat:number; lng:number };
};

export default function PropertyDetail() {
  const params = useLocalSearchParams();
  const p = params as unknown as PropertyDetailParams;

  const openTel = (num?:string) => num && Linking.openURL(`tel:${num}`);
  const openWA  = (num?:string) => num && Linking.openURL(`https://wa.me/${num.replace(/\D/g,'')}`);
  const openMail = (m?:string) => m && Linking.openURL(`mailto:${m}`);

  const openMap = () => {
    const q = encodeURIComponent(p.addressLine || `${p.city}, ${p.country||''}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  const fmtMoney = (n:number, cur='FCFA') =>
    `${new Intl.NumberFormat('fr-FR').format(n)} ${cur}`;

  const images = typeof p.images === 'string' ? JSON.parse(p.images as string) : p.images;
  const amenities = typeof p.amenities === 'string' ? JSON.parse(p.amenities as string) : p.amenities;
  const contact = typeof p.contact === 'string' ? JSON.parse(p.contact as string) : p.contact;

  return (
    <ScrollView style={styles.container}>
      <MediaCarousel images={images} />

      <Section title={`${p.title}`}>
        <Text style={styles.subtitle}>
          {p.city}{p.country?` • ${p.country}`:''} {p.rating?` • ★ ${p.rating}`:''}
        </Text>
        {typeof p.price === 'number' && (
          <Text style={styles.price}>{fmtMoney(Number(p.price), p.currency||'FCFA')} {p.listingType==='A_LOUER' ? '/ mois' : ''}</Text>
        )}
        <View style={styles.chipRow}>
          {!!p.area && <Chip label={`${p.area} m²`} />}
          {!!p.rooms && <Chip label={`${p.rooms} pièces`} />}
          {!!p.beds && <Chip label={`${p.beds} ch`} />}
          {!!p.baths && <Chip label={`${p.baths} sdb`} />}
          <Chip label={p.listingType === 'A_VENDRE' ? 'À vendre' : 'À louer'} />
        </View>
      </Section>

      {p.description ? (
        <Section title="Description"><Text style={styles.desc}>{p.description}</Text></Section>
      ) : null}

      {!!amenities?.length && (
        <Section title="Équipements">
          <View style={styles.chipRow}>
            {amenities.map((a:string,i:number)=><Chip key={i} label={a} />)}
          </View>
        </Section>
      )}

      <Section title="Localisation">
        <TouchableOpacity onPress={openMap}>
          <Text style={styles.link}>{p.addressLine || `${p.city}, ${p.country||''}`}</Text>
        </TouchableOpacity>
      </Section>

      <Divider/>

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
  link:{color:'#0E9F6E', fontWeight:'800'},
  btnRow:{flexDirection:'row', gap:12},
  btn:{backgroundColor:'#0F172A', paddingHorizontal:14, paddingVertical:10, borderRadius:10},
  btnTxt:{color:'#fff', fontWeight:'800'}
});
