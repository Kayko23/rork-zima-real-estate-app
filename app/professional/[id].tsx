import React from 'react';
import { View, Text, Pressable, FlatList, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providersApi, api, providerReviewsApi, type ProviderReview } from '@/lib/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '@/hooks/useSettings';
import { useMoney } from '@/lib/money';

function ChatLikeHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', padding:12, borderBottomWidth:1, borderColor:'#E5E7EB', backgroundColor:'#fff' }}>
      <Pressable onPress={onBack} hitSlop={12}><Text style={{ fontSize:20 }}>‹</Text></Pressable>
      <Text style={{ fontWeight:'800', fontSize:16, marginLeft:12 }}>{title}</Text>
    </View>
  );
}

type TabKey = 'overview'|'listings'|'reviews';
function SegmentedTabs({ value, onChange }:{ value:TabKey; onChange:(k:TabKey)=>void }) {
  const items: {key:TabKey; label:string}[] = [
    { key:'overview', label:'Aperçu' },
    { key:'listings', label:'Annonces' },
    { key:'reviews',  label:'Avis' },
  ];
  return (
    <View style={{ flexDirection:'row', padding:8, gap:8, backgroundColor:'#F3F4F6', borderRadius:12, margin:16 }}>
      {items.map(it=>(
        <Pressable key={it.key} onPress={()=>onChange(it.key)} style={{
          flex:1, paddingVertical:10, borderRadius:10,
          backgroundColor: value===it.key ? '#0B6B53' : '#fff',
          alignItems:'center', borderWidth:1, borderColor: value===it.key?'#0B6B53':'#E5E7EB'
        }}>
          <Text style={{ color:value===it.key?'#fff':'#111827', fontWeight:'700' }}>{it.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Tag({ label }:{label:string}) {
  return (
    <View style={{ borderWidth:1, borderColor:'#DADADA', borderRadius:999, paddingHorizontal:10, paddingVertical:6 }}>
      <Text style={{ fontSize:12 }}>{label}</Text>
    </View>
  );
}
function Stars({ rating }:{rating:number}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const arr = Array.from({length:5}).map((_,i)=> i<full ? '★' : (i===full && half ? '☆' : '✩'));
  return <Text style={{ color:'#F59E0B', fontWeight:'700' }}>{arr.join(' ')}</Text>;
}

function ProviderListingCard({ item, currency, onPress }:{ item:any; currency:string; onPress:()=>void }) {
  const { format } = useMoney();
  return (
    <Pressable onPress={onPress} style={{ width:260, borderWidth:1, borderColor:'#E5E7EB', borderRadius:16, overflow:'hidden', backgroundColor:'#fff' }}>
      <View style={{ height:130, backgroundColor:'#E5E7EB' }} />
      <View style={{ padding:12 }}>
        <Text style={{ fontWeight:'800' }}>{item.title ?? 'Annonce'}</Text>
        <Text style={{ color:'#6B7280', marginTop:2 }}>{item.city}, {item.country}</Text>
        <Text style={{ marginTop:8, fontWeight:'700' }}>
          {format(item.price, currency as any)}{item.period==='daily'?' / jour': item.period==='monthly'?' / mois':''}
        </Text>
      </View>
    </Pressable>
  );
}

export default function ProfessionalProfile() {
  const { id } = useLocalSearchParams<{id:string}>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currency } = useSettings();
  const qc = useQueryClient();

  const { data: provider } = useQuery({
    queryKey: ['provider', id],
    queryFn: () => providersApi.get(String(id)),
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['provider-listings', id],
    queryFn: () => api.listProviderProperties(String(id)),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['provider-reviews', id],
    queryFn: () => providerReviewsApi.list(String(id)),
  });

  const [tab, setTab] = React.useState<TabKey>('overview');

  const addReview = useMutation({
    mutationFn: (payload: Omit<ProviderReview,'id'|'providerId'|'createdAt'>) =>
      providerReviewsApi.add(String(id), payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['provider-reviews', id] })
  });
  const [newText, setNewText] = React.useState('');

  if (!provider) return null;

  return (
    <View style={{ flex:1, backgroundColor:'#fff', paddingTop: insets.top }}>
      <ChatLikeHeader title={provider.name} onBack={()=>router.back()} />

      <View style={{ padding:16, gap:10 }}>
        <View style={{ flexDirection:'row', alignItems:'center', gap:12 }}>
          <View style={{ width:64, height:64, borderRadius:16, backgroundColor:'#E5E7EB' }}/>
          <View style={{ flex:1 }}>
            <Text style={{ fontWeight:'800', fontSize:18 }}>{provider.name}</Text>
            <Text style={{ color:'#6B7280' }}>{provider.city}, {provider.country}</Text>
            <Stars rating={provider.rating ?? 0} />
          </View>
        </View>
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
          <Tag label={provider.category} />
          {provider.services?.map((s:string)=><Tag key={s} label={s}/>)}
        </View>
        <View style={{ flexDirection:'row', gap:8 }}>
          <Pressable style={{ flex:1, backgroundColor:'#0B6B53', paddingVertical:12, borderRadius:12, alignItems:'center' }}
            onPress={()=>router.push({ pathname:'/chat/[id]', params:{ id:`pro_${provider.id}` }})}>
            <Text style={{ color:'#fff', fontWeight:'800' }}>Message</Text>
          </Pressable>
          <Pressable style={{ width:56, backgroundColor:'#F1F5F4', borderRadius:12, alignItems:'center', justifyContent:'center' }}
            onPress={()=>router.push('/appointment/book')}>
            <Text>📅</Text>
          </Pressable>
        </View>
      </View>

      <SegmentedTabs value={tab} onChange={setTab} />

      {tab === 'overview' && (
        <ScrollView contentContainerStyle={{ paddingHorizontal:16, paddingBottom: insets.bottom + 20 }}>
          <Text style={{ fontWeight:'800', marginBottom:8 }}>À propos</Text>
          <Text style={{ color:'#374151' }}>
            Prestataire vérifié. Réponse rapide. Expérience locale sur {provider.city}.
          </Text>

          <Text style={{ fontWeight:'800', marginTop:16, marginBottom:8 }}>Services</Text>
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
            {provider.services?.map((s:string)=><Tag key={s} label={s}/>)}
          </View>

          <Text style={{ fontWeight:'800', marginTop:16, marginBottom:8 }}>Localisation</Text>
          <Text style={{ color:'#6B7280' }}>{provider.city}, {provider.country}</Text>
        </ScrollView>
      )}

      {tab === 'listings' && (
        <FlatList
          data={listings as any[]}
          keyExtractor={(i:any)=>String(i.id)}
          contentContainerStyle={{ paddingHorizontal:16, paddingBottom: insets.bottom + 20 }}
          ItemSeparatorComponent={()=><View style={{ height:12 }}/>} 
          renderItem={({item})=> (
            <ProviderListingCard
              item={item}
              currency={currency}
              onPress={()=>router.push({ pathname:'/property/[id]', params:{ id:item.id }})}
            />
          )}
          ListEmptyComponent={<Text style={{ color:'#64748B', paddingHorizontal:16 }}>Aucune annonce.</Text>}
        />
      )}

      {tab === 'reviews' && (
        <View style={{ flex:1 }}>
          <FlatList
            data={reviews as ProviderReview[]}
            keyExtractor={(r)=>r.id}
            contentContainerStyle={{ paddingHorizontal:16, paddingTop:8, paddingBottom: insets.bottom + 96 }}
            ItemSeparatorComponent={()=><View style={{ height:12 }}/>} 
            renderItem={({item})=> (
              <View style={{ borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, padding:12 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                  <Text style={{ fontWeight:'700' }}>{item.author}</Text>
                  <Stars rating={item.rating} />
                </View>
                <Text style={{ color:'#374151', marginTop:6 }}>{item.text}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={{ color:'#64748B' }}>Pas encore d’avis.</Text>}
          />

          <View style={{
            position:'absolute', left:16, right:16, bottom: insets.bottom + 16,
            backgroundColor:'#fff', borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, padding:12, gap:8
          }}>
            <Text style={{ fontWeight:'700' }}>Laisser un avis</Text>
            <TextInput
              value={newText}
              onChangeText={setNewText}
              placeholder="Votre retour…"
              style={{ borderWidth:1, borderColor:'#E5E7EB', borderRadius:10, paddingHorizontal:10, paddingVertical:8 }}
            />
            <View style={{ flexDirection:'row', gap:8 }}>
              {[3,4,4.5,5].map(n=> (
                <Pressable 
                  key={String(n)} 
                  onPress={()=> addReview.mutate({ author:'Moi', rating:n, text:newText||'—' })}
                  style={{ paddingHorizontal:12, paddingVertical:8, borderRadius:999, backgroundColor:'#0B6B53' }}
                >
                  <Text style={{ color:'#fff', fontWeight:'700' }}>{n} ★</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
