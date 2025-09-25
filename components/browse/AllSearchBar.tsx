import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Search, Filter, Building2, BedDouble } from 'lucide-react-native';
import type { Kind } from '@/lib/all-api';

export default function AllSearchBar({
  scope, onScope, onOpenSearch, onOpenFilters,
}: {
  scope: Kind | undefined;
  onScope: (k?: Kind) => void;
  onOpenSearch: () => void;
  onOpenFilters: () => void;
}) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      <Pressable onPress={onOpenSearch} style={s.search} testID="all.searchbar">
        <Search size={18} color="#0F172A" />
        <Text style={s.placeholder}>Rechercher tout</Text>
      </Pressable>

      <View style={s.row}>
        <Segment label="Tous"       active={!scope}           onPress={() => onScope(undefined)} />
        <Segment label="Propriétés" active={scope==='property'} onPress={() => onScope('property')}  icon={<Building2 size={14}/>}/>
        <Segment label="Pros"       active={scope==='pro'}      onPress={() => onScope('pro')} />
        <Segment label="Voyages"    active={scope==='trip'}     onPress={() => onScope('trip')} icon={<BedDouble size={14}/>}/>
        <Pressable onPress={onOpenFilters} style={s.filters} testID="all.filters">
          <Filter size={16} color="#0B3B2E"/>
          <Text style={s.filtersText}>Filtres</Text>
        </Pressable>
      </View>
    </View>
  );
}
function Segment({ label, active, onPress, icon }:{ label:string; active:boolean; onPress:()=>void; icon?:React.ReactNode }) {
  return (
    <Pressable onPress={onPress} style={[s.seg, active && s.segActive]}>
      {icon}<Text style={[s.segText, active && s.segTextActive]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  search: { flexDirection:'row', alignItems:'center', gap:8, backgroundColor:'#fff', paddingHorizontal:12, paddingVertical:12, borderRadius:20 },
  placeholder: { color:'#64748B', fontWeight:'600' },
  row: { flexDirection:'row', alignItems:'center', gap:8, marginTop:10 },
  seg: { flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, borderRadius:999, backgroundColor:'#F2F4F7' },
  segActive: { backgroundColor:'#0B3B2E' },
  segText: { color:'#0F172A', fontWeight:'700' },
  segTextActive: { color:'#fff' },
  filters: { marginLeft:'auto', flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#ECFDF5', paddingHorizontal:12, paddingVertical:8, borderRadius:999 },
  filtersText: { color:'#0B3B2E', fontWeight:'800' },
});
