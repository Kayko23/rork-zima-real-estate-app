import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { providerCategories } from '@/lib/api';
import RangeSlider from '@/components/inputs/RangeSlider';


const COUNTRIES: Record<string,string[]> = {
  "Côte d’Ivoire": ["Abidjan","Yamoussoukro","Bouaké","San-Pédro","Daloa","Korhogo"],
  "Sénégal": ["Dakar","Thiès","Saint-Louis","Ziguinchor","Kaolack","Mbour"],
  "Bénin": ["Cotonou","Porto-Novo","Parakou","Abomey","Bohicon","Ouidah"],
  "Cameroun": ["Douala","Yaoundé","Bafoussam","Garoua"],
  "Togo": ["Lomé","Sokodé","Kara"],
};

export type ProFilters = {
  country?: string;
  city?: string;
  category?: typeof providerCategories[number];
  ratingMin?: number;
  services?: string[];
  budgetMin?: number;
  budgetMax?: number;
};

type Props = {
  visible: boolean;
  initial: ProFilters;
  resultCount: number;
  onClose: () => void;
  onApply: (f: ProFilters) => void;
  presetKey?: string;
};

export default function ProFiltersSheet({ visible, initial, resultCount, onClose, onApply, presetKey='zima/pro/lastFilters' }: Props) {
  const insets = useSafeAreaInsets();
  const [f, setF] = useState<ProFilters>(initial);
  const [openCountry, setOpenCountry] = useState<boolean>(false);
  const [openCity, setOpenCity] = useState<boolean>(false);
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const [qCountry, setQCountry] = useState<string>('');
  const [qCity, setQCity] = useState<string>('');
  const [qCategory, setQCategory] = useState<string>('');

  useEffect(()=>{ (async()=>{ try { const raw=await AsyncStorage.getItem(presetKey); if(raw) setF(JSON.parse(raw) as ProFilters); } catch(e){ console.log('pro/preset read error', e);} })(); },[presetKey]);
  useEffect(()=>{ AsyncStorage.setItem(presetKey, JSON.stringify(f)).catch((e)=>console.log('pro/preset write error', e)); },[f, presetKey]);
  useEffect(()=>{ if(visible) setF(prev=>({ ...prev, ...initial })); },[visible, initial]);

  const countries = useMemo(()=> {
    const all = Object.keys(COUNTRIES);
    return qCountry ? all.filter(c=>c.toLowerCase().includes(qCountry.toLowerCase())) : all;
  }, [qCountry]);

  const cities = useMemo(()=> {
    const list = f.country ? (COUNTRIES[f.country] ?? []) : [];
    return qCity ? list.filter(c=>c.toLowerCase().includes(qCity.toLowerCase())) : list;
  }, [f.country, qCity]);

  const categories = useMemo(()=> {
    const all = providerCategories as readonly string[];
    return qCategory ? all.filter(c=>c.toLowerCase().includes(qCategory.toLowerCase())) : all;
  }, [qCategory]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.select({ ios:'padding', android:undefined })} style={styles.flex1}>
        <Pressable style={styles.backdrop} onPress={onClose}/>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.handleWrap}><View style={styles.handle}/></View>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Filtres Professionnels</Text>
            <Pressable onPress={()=>setF(initial)}><Text style={styles.reset}>Réinitialiser</Text></Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator>
            <Section title="Zone">
              <Row>
                <Pill onPress={()=>{ setOpenCountry(true); setQCountry(''); }}>{f.country ?? 'Pays'}</Pill>
                <Pill onPress={()=>f.country && setOpenCity(true)} disabled={!f.country}>{f.city ?? (f.country?'Ville':'Choisir un pays')}</Pill>
              </Row>
            </Section>

            <Section title="Catégorie">
              <Row>
                <Pill onPress={()=>{ setOpenCategory(true); setQCategory(''); }}>{f.category ?? 'Toutes catégories'}</Pill>
              </Row>
            </Section>

            <Section title="Note minimale">
              <Row wrap>
                {[0,3,3.5,4,4.5,5].map(n=> (
                  <Chip key={String(n)} selected={f.ratingMin===n || (n===0 && !f.ratingMin)} onPress={()=>setF(s=>({...s, ratingMin: n===0?undefined:n}))} label={n===0?'Tous':`${n}+`} />
                ))}
              </Row>
            </Section>

            <Section title="Services">
              <Row wrap>
                {['Visite','Estimation','Gestion locative','Conciergerie','Photos/vidéo'].map(s=> (
                  <Chip key={s} selected={(f.services??[]).includes(s)} onPress={()=>{
                    setF(st=>({
                      ...st,
                      services: (st.services??[]).includes(s) ? (st.services??[]).filter(x=>x!==s) : [ ...(st.services??[]), s ]
                    }))
                  }} label={s} />
                ))}
              </Row>
            </Section>

            <Section title="Budget (FCFA)">
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 12 }}>
                  {(f.budgetMin ?? 0).toLocaleString('fr-FR')} - {(f.budgetMax ?? 10000000).toLocaleString('fr-FR')} FCFA
                </Text>
                <RangeSlider
                  min={0}
                  max={10000000}
                  values={[f.budgetMin ?? 0, f.budgetMax ?? 10000000]}
                  onChange={([min, max]) => setF(s => ({ ...s, budgetMin: min === 0 ? undefined : min, budgetMax: max === 10000000 ? undefined : max }))}
                />
              </View>
            </Section>
          </ScrollView>

          <Pressable onPress={()=>onApply(f)} style={styles.applyBtn}>
            <Text style={styles.applyTxt}>Voir les résultats ({resultCount})</Text>
          </Pressable>
        </View>

        <Modal visible={openCountry} transparent animationType="slide">
          <View style={styles.pickerWrap}>
            <View style={[styles.pickerSheet, { paddingBottom: insets.bottom+12 }]}>
              <Text style={styles.pickerTitle}>Pays</Text>
              <Search value={qCountry} onChange={setQCountry} placeholder="Rechercher un pays…" />
              <ScrollView>
                {countries.map(c=> (
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

        <Modal visible={openCategory} transparent animationType="slide">
          <View style={styles.pickerWrap}>
            <View style={[styles.pickerSheet, { paddingBottom: insets.bottom+12 }]}>
              <Text style={styles.pickerTitle}>Catégorie</Text>
              <Search value={qCategory} onChange={setQCategory} placeholder="Rechercher une catégorie…" />
              <ScrollView>
                <Pressable onPress={()=>{ setF(s=>({...s, category:undefined })); setOpenCategory(false); }} style={styles.rowPick}><Text style={{ fontWeight:'700' }}>Toutes catégories</Text></Pressable>
                {categories.map(c=> (
                  <Pressable key={c} onPress={()=>{ setF(s=>({...s, category:c as any })); setOpenCategory(false); }} style={styles.rowPick}><Text>{c}</Text></Pressable>
                ))}
              </ScrollView>
              <Close onPress={()=>setOpenCategory(false)} />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Section({ title, children }:{title:string, children:React.ReactNode}){ return <View style={{ marginBottom:16 }}><Text style={{ fontSize:16, fontWeight:'800', marginBottom:8 }}>{title}</Text>{children}</View>; }
function Row({ children, wrap }:{children:React.ReactNode, wrap?:boolean}){ return <View style={{ flexDirection:'row', gap:10, flexWrap: wrap?'wrap':'nowrap' }}>{children}</View>; }
function Pill({ children, onPress, disabled }:{children:React.ReactNode, onPress:()=>void, disabled?:boolean}){ return <Pressable onPress={onPress} disabled={disabled} style={{ flex:1, paddingVertical:12, paddingHorizontal:14, borderRadius:12, borderWidth:1, borderColor: disabled?'#EEE':'#D9D9D9', backgroundColor:'#fff', opacity: disabled?0.6:1 }}><Text style={{ fontSize:15 }}>{children}</Text></Pressable>; }
function Chip({ label, selected, onPress }:{label:string, selected?:boolean, onPress:()=>void}){ return <Pressable onPress={onPress} style={{ paddingVertical:8, paddingHorizontal:12, borderRadius:999, borderWidth:1, borderColor:selected?'#0B6B53':'#DADADA', backgroundColor:selected?'#0B6B53':'#fff' }}><Text style={{ color:selected?'#fff':'#111827', fontWeight:selected?'700':'400' }}>{label}</Text></Pressable>; }
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
