import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import BottomSheet from './BottomSheet';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (label: string, start?: Date, end?: Date) => void;
};

export default function DateRangeSheet({ visible, onClose, onSubmit }: Props) {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();

  const pick = (d: Date) => {
    if (!start || (start && end)) { setStart(d); setEnd(undefined); }
    else if (d >= start) { setEnd(d); }
    else { setStart(d); setEnd(undefined); }
  };

  // Mini calendrier "7 jours x 6 semaines" pour les 2 prochains mois
  const today = new Date();
  const months = [0,1].map(m => new Date(today.getFullYear(), today.getMonth()+m, 1));
  const daysFor = (month: Date) => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const startIdx = (first.getDay()+6)%7; // lundi=0
    const last = new Date(month.getFullYear(), month.getMonth()+1, 0).getDate();
    const arr: Date[] = [];
    for (let i=0;i<startIdx;i++) arr.push(new Date(NaN)); // blanks
    for (let d=1; d<=last; d++) arr.push(new Date(month.getFullYear(), month.getMonth(), d));
    while (arr.length%7) arr.push(new Date(NaN));
    return arr;
  };

  const fmt = (d?: Date) => d ? d.toLocaleDateString('fr-FR') : '';

  const confirm = () => {
    const lbl = start && end ? `${fmt(start)} – ${fmt(end)}` : start ? fmt(start) : 'Dates flexibles';
    onSubmit(lbl, start, end); onClose();
  };

  const isBetween = (d: Date) => start && end && d >= start && d <= end;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Sélectionner des dates</Text>
      {months.map((m, idx) => (
        <View key={idx} style={styles.monthContainer}>
          <Text style={styles.month}>
            {m.toLocaleDateString('fr-FR', { month:'long', year:'numeric' })}
          </Text>
          <View style={styles.grid}>
            {['L','M','M','J','V','S','D'].map((d)=> <Text key={d} style={styles.hd}>{d}</Text>)}
            {daysFor(m).map((d, i) => {
              const isValid = !Number.isNaN(d.getTime()) && d >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const active = isValid && ((start && d.getTime()===start.getTime()) || (end && d.getTime()===end.getTime()) || isBetween(d));
              return (
                <Pressable key={i} disabled={!isValid} onPress={() => pick(d)} style={[styles.cell, active && styles.cellActive, !isValid && styles.cellDisabled]}>
                  <Text style={[styles.dayTxt, active && styles.dayTxtActive, !isValid && styles.dayTxtDisabled]}>
                    {isValid ? d.getDate() : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <View style={styles.actions}>
        <Pressable onPress={() => { setStart(undefined); setEnd(undefined); }}>
          <Text style={styles.clear}>Tout effacer</Text>
        </Pressable>
        <Pressable onPress={confirm} style={styles.cta}><Text style={styles.ctaTxt}>Valider</Text></Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title:{ fontSize:20, fontWeight:'900', marginHorizontal:20, marginTop:6, color: '#0F172A' },
  monthContainer: { paddingHorizontal:20, marginTop:8 },
  month:{ fontWeight:'900', marginBottom:6, color: '#0F172A' },
  grid:{ flexDirection:'row', flexWrap:'wrap' },
  hd:{ width:'14.285%', textAlign:'center', fontWeight:'900', color:'#98A2B3', marginBottom:6 },
  cell:{ width:'14.285%', aspectRatio:1, alignItems:'center', justifyContent:'center', borderRadius:12, marginVertical:2 },
  cellActive:{ backgroundColor:'#0E5A461A', borderWidth:1, borderColor:'#0E5A46' },
  cellDisabled:{ opacity:0.25 },
  dayTxt:{ fontWeight:'800', color: '#0F172A' },
  dayTxtActive:{ color:'#0E5A46' },
  dayTxtDisabled:{ color:'#9CA3AF' },
  actions:{ marginTop:14, marginHorizontal:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  clear:{ textDecorationLine:'underline', fontWeight:'900', color: '#0F172A' },
  cta:{ backgroundColor:'#FF2D55', paddingHorizontal:18, paddingVertical:12, borderRadius:999 },
  ctaTxt:{ color:'#fff', fontWeight:'900' }
});