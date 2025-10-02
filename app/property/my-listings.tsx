import React from 'react';
import { View, Text, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'expo-router';

const CURRENT_PROVIDER_ID = 'pro_1';

export default function MyListings(){
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const qc = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['my-listings', CURRENT_PROVIDER_ID],
    queryFn: () => api.listProviderProperties(CURRENT_PROVIDER_ID),
  });

  const pause   = useMutation({ mutationFn: api.pauseProperty,   onSuccess:()=>qc.invalidateQueries({ predicate: () => true }) });
  const publish = useMutation({ mutationFn: api.publishProperty, onSuccess:()=>qc.invalidateQueries({ predicate: () => true }) });
  const del     = useMutation({ mutationFn: api.softDeleteProperty, onSuccess:()=>qc.invalidateQueries({ predicate: () => true }) });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes annonces</Text>
      </View>

      <FlatList
        data={(data as any[]).filter((p)=>!p.deletedAt)}
        keyExtractor={(i:any)=>String(i.id)}
        contentContainerStyle={{ padding:16, paddingBottom: insets.bottom + 16 }}
        ListEmptyComponent={!isLoading ? <Text style={styles.empty}>Aucune annonce.</Text> : null}
        renderItem={({ item })=> (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title ?? 'Annonce'}</Text>
            <Text style={styles.cardMeta}>{item.city}, {item.country}</Text>
            <Text style={[styles.status, { color: item.visible ? '#0B6B53' : '#B91C1C' }]}>
              {item.visible ? 'Publié' : 'En pause'}
            </Text>
            <View style={styles.rowBtns}>
              <Btn onPress={()=>router.push({ pathname:'/property/edit/[id]', params:{ id:item.id }})}>Modifier</Btn>
              {item.visible ? (
                <BtnGhost onPress={()=>pause.mutate(item.id)}>Mettre en pause</BtnGhost>
              ) : (
                <BtnGhost onPress={()=>publish.mutate(item.id)}>Publier</BtnGhost>
              )}
              <BtnDanger onPress={()=>{
                Alert.alert('Supprimer', 'Confirmer la suppression ?', [
                  { text:'Annuler' }, { text:'Supprimer', style:'destructive', onPress:()=>del.mutate(item.id) }
                ]);
              }}>Supprimer</BtnDanger>
            </View>
          </View>
        )}
      />
    </View>
  );
}

function Btn({ children, onPress }:{children:React.ReactNode; onPress:()=>void}) {
  return <Pressable onPress={onPress} style={styles.btn}><Text style={styles.btnTxt}>{children}</Text></Pressable>;
}
function BtnGhost({ children, onPress }:{children:React.ReactNode; onPress:()=>void}) {
  return <Pressable onPress={onPress} style={styles.btnGhost}><Text style={styles.btnGhostTxt}>{children}</Text></Pressable>;
}
function BtnDanger({ children, onPress }:{children:React.ReactNode; onPress:()=>void}) {
  return <Pressable onPress={onPress} style={styles.btnDanger}><Text style={styles.btnDangerTxt}>{children}</Text></Pressable>;
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  header: { height:56, justifyContent:'center', paddingHorizontal:16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor:'#E5E7EB' },
  headerTitle: { fontWeight:'800', fontSize:18 },
  empty: { color:'#64748B' },
  card: { borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, padding:12, marginBottom:12 },
  cardTitle: { fontWeight:'800' },
  cardMeta: { color:'#6B7280', marginTop:2 },
  status: { marginTop:4, fontWeight:'700' },
  rowBtns: { flexDirection:'row', gap:8, marginTop:10, flexWrap:'wrap' as const },
  btn: { backgroundColor:'#0B6B53', paddingVertical:10, paddingHorizontal:14, borderRadius:10 },
  btnTxt: { color:'#fff', fontWeight:'800' },
  btnGhost: { backgroundColor:'#F1F5F4', paddingVertical:10, paddingHorizontal:14, borderRadius:10 },
  btnGhostTxt: { color:'#0B6B53', fontWeight:'800' },
  btnDanger: { backgroundColor:'#FEE2E2', paddingVertical:10, paddingHorizontal:14, borderRadius:10 },
  btnDangerTxt: { color:'#B91C1C', fontWeight:'800' },
});
