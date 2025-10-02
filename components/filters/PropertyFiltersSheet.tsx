import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COUNTRIES: Record<string,string[]> = {
  "Bénin": ["Cotonou","Porto-Novo","Parakou","Abomey","Bohicon","Ouidah"],
  "Burkina Faso": ["Ouagadougou","Bobo-Dioulasso","Koudougou","Banfora"],
  "Côte d’Ivoire": ["Abidjan","Yamoussoukro","Bouaké","San-Pédro","Daloa","Korhogo"],
  "Guinée-Bissau": ["Bissau","Bafatá","Gabú"],
  "Mali": ["Bamako","Sikasso","Mopti","Kayes","Ségou"],
  "Niger": ["Niamey","Zinder","Maradi","Agadez","Tahoua"],
  "Sénégal": ["Dakar","Thiès","Saint-Louis","Ziguinchor","Kaolack","Mbour"],
  "Togo": ["Lomé","Sokodé","Kara"],
  "Cameroun": ["Douala","Yaoundé","Bafoussam","Garoua"],
  "Gabon": ["Libreville","Port-Gentil","Franceville"],
  "Congo": ["Brazzaville","Pointe-Noire","Dolisie"],
  "RCA": ["Bangui","Bimbo","Berbérati"],
  "Tchad": ["N’Djamena","Moundou","Sarh"],
  "Guinée Équatoriale": ["Malabo","Bata"],
};

const CATEGORIES = ['Appartement','Maison','Villa','Terrain','Immeuble','Bureau','Entrepôt','Commercial'] as const;

export type PropertyFilters = {
  country?: string;
  city?: string;
  trade?: 'sale'|'rent';
  period?: 'monthly'|'daily';
  category?: 'Appartement'|'Maison'|'Villa'|'Terrain'|'Immeuble'|'Bureau'|'Entrepôt'|'Commercial'|undefined;
  rooms?: number;
  baths?: number;
  surfaceMin?: number;
  priceMin?: number;
  priceMax?: number;
  sort?: 'recent'|'priceAsc'|'priceDesc';
};

type Props = {
  visible: boolean;
  initial: PropertyFilters;
  onClose: () => void;
  onApply: (f: PropertyFilters) => void;
  resultCount: number;
  presetKey?: string;
};

export default function PropertyFiltersSheet({
  visible, initial, onClose, onApply, resultCount, presetKey = 'zima/property/lastFilters'
}: Props) {
  const insets = useSafeAreaInsets();
  const [f, setF] = useState<PropertyFilters>(initial);
  const [openCountry, setOpenCountry] = useState<boolean>(false);
  const [openCity, setOpenCity] = useState<boolean>(false);
  const [qCountry, setQCountry] = useState<string>('');
  const [qCity, setQCity] = useState<string>('');

  useEffect(()=>{ (async()=>{
    try { const raw = await AsyncStorage.getItem(presetKey); if (raw) setF(JSON.parse(raw) as PropertyFilters); } catch(e){ console.log('filters/preset read error', e); }
  })(); }, [presetKey]);

  useEffect(()=>{ AsyncStorage.setItem(presetKey, JSON.stringify(f)).catch((e)=>console.log('filters/preset write error', e)); }, [f, presetKey]);
  useEffect(()=>{ if (visible) setF(prev=>({ ...prev, ...initial })); }, [visible, initial]);

  const cities = useMemo(()=> {
    const list = f.country ? (COUNTRIES[f.country] ?? []) : [];
    return qCity ? list.filter(c=>c.toLowerCase().includes(qCity.toLowerCase())) : list;
  }, [f.country, qCity]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.select({ ios:'padding', android:undefined })} style={styles.flex1}>
        <Pressable testID="property-filters-backdrop" style={styles.backdrop} onPress={onClose}/>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.handleWrap}><View style={styles.handle}/></View>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Filtres Propriétés</Text>
            <Pressable testID="property-filters-reset" onPress={()=>setF(initial)}><Text style={styles.reset}>Réinitialiser</Text></Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator>
            <Section title="Destination">
              <Row>
                <Pill onPress={()=>{ setOpenCountry(true); setQCountry(''); }}>{f.country ?? 'Pays'}</Pill>
                <Pill onPress={()=> f.country && setOpenCity(true)} disabled={!f.country}>{f.city ?? (f.country ? 'Ville' : 'Choisir un pays')}</Pill>
              </Row>
            </Section>

            <Section title="Transaction">
              <Row>
                {(['sale','rent'] as const).map(t=> (
                  <Chip key={t} selected={f.trade===t} onPress={()=>setF(s=>({...s, trade: t}))} label={t==='sale'?'À vendre':'À louer'} />
                ))}
              </Row>
              {f.trade==='rent' && (
                <Row style={{ marginTop:8 }}>
                  {(['monthly','daily'] as const).map(p=> (
                    <Chip key={p} selected={f.period===p} onPress={()=>setF(s=>({...s, period: p}))} label={p==='monthly'?'Mensuel':'Journalier'} />
                  ))}
                </Row>
              )}
            </Section>

            <Section title="Catégorie">
              <Row wrap>
                {CATEGORIES.map((c)=> (
                  <Chip key={c} selected={f.category===c} onPress={()=>setF((s)=>({
                    ...s,
                    category: s.category===c ? undefined : c,
                  }))} label={c} />
                ))}
              </Row>
            </Section>

            <Section title="Caractéristiques">
              <Row>
                <NumberInput label="Chambres" value={f.rooms} onChange={v=>setF(s=>({...s, rooms:v}))}/>
                <NumberInput label="SDB" value={f.baths} onChange={v=>setF(s=>({...s, baths:v}))}/>
                <NumberInput label="Surface min (m²)" value={f.surfaceMin} onChange={v=>setF(s=>({...s, surfaceMin:v}))}/>
              </Row>
            </Section>

            <Section title="Budget">
              <Row>
                <NumberInput label="Min" value={f.priceMin} onChange={v=>setF(s=>({...s, priceMin:v}))}/>
                <NumberInput label="Max" value={f.priceMax} onChange={v=>setF(s=>({...s, priceMax:v}))}/>
              </Row>
            </Section>

            <Section title="Tri">
              <Row>
                {(['recent','priceAsc','priceDesc'] as const).map(k=> (
                  <Chip key={k} selected={f.sort===k} onPress={()=>setF(s=>({...s, sort:k}))} label={k==='recent'?'Plus récents':k==='priceAsc'?'Prix ↑':'Prix ↓'} />
                ))}
              </Row>
            </Section>
          </ScrollView>

          <Pressable testID="property-filters-apply" onPress={()=>onApply(f)} style={styles.applyBtn}>
            <Text style={styles.applyTxt}>Voir les résultats ({resultCount})</Text>
          </Pressable>
        </View>

        <Modal visible={openCountry} transparent animationType="slide">
          <View style={styles.pickerWrap}>
            <View style={[styles.pickerSheet, { paddingBottom: insets.bottom+12 }]}>
              <Text style={styles.pickerTitle}>Pays</Text>
              <Search value={qCountry} onChange={setQCountry} placeholder="Rechercher un pays…" />
              <ScrollView>
                {(qCountry?Object.keys(COUNTRIES).filter(c=>c.toLowerCase().includes(qCountry.toLowerCase())):Object.keys(COUNTRIES)).map(c=> (
                  <Pressable key={c} onPress={()=>{ setF(s=>({...s, country:c, city:undefined })); setOpenCountry(false); }} style={styles.rowPick}><Text>{c}</Text></Pressable>
                ))}
              </ScrollView>
              <Close onPress={()=>setOpenCountry(false)} />
            </View>
          </View>
        </Modal>

        <Modal visible={openCity} transparent animationType="slide">
          <View style={styles.pickerWrap}>
            <View style={[styles.pickerSheet, { paddingBottom: insets.bottom+12 }]}>
              <Text style={styles.pickerTitle}>Villes — {f.country}</Text>
              <Search value={qCity} onChange={setQCity} placeholder="Rechercher une ville…" />
              <ScrollView>
                {(f.country?cities:[]).map(c=> (
                  <Pressable key={c} onPress={()=>{ setF(s=>({...s, city:c })); setOpenCity(false); }} style={styles.rowPick}><Text>{c}</Text></Pressable>
                ))}
              </ScrollView>
              <Close onPress={()=>setOpenCity(false)} />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Section({ title, children }:{title:string, children:React.ReactNode}){ return <View style={{ marginBottom:16 }}><Text style={{ fontSize:16, fontWeight:'800', marginBottom:8 }}>{title}</Text>{children}</View>; }
function Row({ children, wrap, style }:{children:React.ReactNode, wrap?:boolean, style?:any}){ return <View style={[{ flexDirection:'row', gap:10, flexWrap: wrap?'wrap':'nowrap' }, style]}>{children}</View>; }
function Pill({ children, onPress, disabled }:{children:React.ReactNode, onPress:()=>void, disabled?:boolean}){ return <Pressable onPress={onPress} disabled={disabled} style={{ flex:1, paddingVertical:12, paddingHorizontal:14, borderRadius:12, borderWidth:1, borderColor: disabled?'#EEE':'#D9D9D9', backgroundColor:'#fff', opacity: disabled?0.6:1 }}><Text style={{ fontSize:15 }}>{children}</Text></Pressable>; }
function Chip({ label, selected, onPress }:{label:string, selected?:boolean, onPress:()=>void}){ return <Pressable onPress={onPress} style={{ paddingVertical:8, paddingHorizontal:12, borderRadius:999, borderWidth:1, borderColor:selected?'#0B6B53':'#DADADA', backgroundColor:selected?'#0B6B53':'#fff' }}><Text style={{ color:selected?'#fff':'#111827', fontWeight:selected?'700':'400' }}>{label}</Text></Pressable>; }
function NumberInput({ label, value, onChange }:{label:string, value?:number, onChange:(v:number|undefined)=>void}){ return <View style={{ flex:1 }}>
  <Text style={{ fontSize:12, color:'#6B7280' }}>{label}</Text>
  <TextInput value={value!=null?String(value):''} onChangeText={t=>onChange(t?Number(t.replace(/[^\d]/g,''))||0:undefined)} keyboardType="numeric"
    style={{ borderWidth:1, borderColor:'#D9D9D9', borderRadius:12, paddingHorizontal:12, paddingVertical:10, marginTop:6 }}/>
</View>; }
function Search({ value, onChange, placeholder }:{value:string, onChange:(s:string)=>void, placeholder:string}){ return <TextInput value={value} onChangeText={onChange} placeholder={placeholder} style={{ borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, paddingHorizontal:12, paddingVertical:10, marginBottom:10 }} />; }
function Close({ onPress }:{onPress:()=>void}){ return <Pressable onPress={onPress} style={{ alignSelf:'center', marginTop:10, paddingVertical:10, paddingHorizontal:16, backgroundColor:'#0B6B53', borderRadius:10 }}><Text style={{ color:'#fff', fontWeight:'800' }}>Fermer</Text></Pressable>; }

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  backdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor:'#fff', borderTopLeftRadius:20, borderTopRightRadius:20, paddingTop:12, paddingHorizontal:16, maxHeight:'86%' as unknown as number },
  handleWrap: { alignItems:'center', marginBottom:8 },
  handle: { width:44, height:5, backgroundColor:'#E6E8EB', borderRadius:3 },
  headerRow: { flexDirection:'row', alignItems:'center', marginBottom:8 },
  headerTitle: { fontWeight:'800', fontSize:18, flex:1 },
  reset: { color:'#0B6B53', fontWeight:'700' },
  scrollInner: { paddingBottom:16 },
  applyBtn: { backgroundColor:'#0B6B53', paddingVertical:14, borderRadius:12, alignItems:'center' },
  applyTxt: { color:'#fff', fontWeight:'800' },
  pickerWrap: { flex:1, backgroundColor:'rgba(0,0,0,0.35)', justifyContent:'flex-end' },
  pickerSheet: { backgroundColor:'#fff', paddingTop:16, paddingHorizontal:16, borderTopLeftRadius:20, borderTopRightRadius:20, maxHeight:'70%' as unknown as number },
  pickerTitle: { fontWeight:'800', fontSize:16, marginBottom:8 },
  rowPick: { paddingVertical:12, borderBottomWidth:1, borderBottomColor:'#F1F5F9' },
});
