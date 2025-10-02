import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import TravelFiltersSheet from '@/components/travel/TravelFiltersSheet';
import PropertyFiltersSheet, { type PropertyFilters } from '@/components/filters/PropertyFiltersSheet';

type Mode = 'property'|'trip';

export default function SearchSheet({
  visible, initialTrip, initialProperty, resultCountTrip, resultCountProperty, onClose, onApplyTrip, onApplyProperty, defaultMode='trip'
}:{
  visible:boolean;
  initialTrip: any; initialProperty: PropertyFilters;
  resultCountTrip: number; resultCountProperty: number;
  onClose:()=>void;
  onApplyTrip:(f:any)=>void;
  onApplyProperty:(f:PropertyFilters)=>void;
  defaultMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}/>

      <View style={styles.toggleWrap}>
        <TabBtn label="Voyages" active={mode==='trip'} onPress={()=>setMode('trip')} />
        <TabBtn label="Propriétés" active={mode==='property'} onPress={()=>setMode('property')} />
      </View>

      {mode==='trip' ? (
        <TravelFiltersSheet
          visible={true}
          initial={initialTrip}
          resultCount={resultCountTrip}
          onClose={onClose}
          onApply={onApplyTrip}
          presetKey="zima/travel/lastFilters"
        />
      ) : (
        <PropertyFiltersSheet
          visible={true}
          initial={initialProperty}
          resultCount={resultCountProperty}
          onClose={onClose}
          onApply={onApplyProperty}
          presetKey="zima/property/lastFilters"
        />
      )}
    </Modal>
  );
}

function TabBtn({ label, active, onPress }:{label:string; active:boolean; onPress:()=>void}){
  return (
    <Pressable onPress={onPress} style={[styles.tab, active ? styles.tabActive : null]}>
      <Text style={[styles.tabTxt, active ? styles.tabTxtActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.35)' },
  toggleWrap: { position:'absolute', top:54, left:16, right:16, flexDirection:'row', backgroundColor:'#F3F4F6', borderRadius:12, overflow:'hidden' },
  tab: { flex:1, paddingVertical:10, alignItems:'center', backgroundColor:'#fff', borderWidth:1, borderColor:'#E5E7EB' },
  tabActive: { backgroundColor:'#0B6B53', borderColor:'#0B6B53' },
  tabTxt: { color:'#111827', fontWeight:'800' },
  tabTxtActive: { color:'#fff' },
});
