import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native";
import { BlurView } from "expo-blur";
import { X, Users, Calendar } from "lucide-react-native";

export default function BookingSheet({
  visible, onClose, nightlyPrice, onRequest
}:{ visible:boolean; onClose:()=>void; nightlyPrice:number; onRequest:(p:{start:string; end:string; guests:number})=>void }) {
  const [start, setStart] = useState<string|null>(null);
  const [end, setEnd] = useState<string|null>(null);
  const [guests, setGuests] = useState(1);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [calendarMode, setCalendarMode] = useState<'start' | 'end'>('start');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  if (!visible) return null;

  const can = !!(start && end);

  return (
    <View style={m.backdrop}>
      <Pressable style={m.flex1} onPress={onClose} testID="booking-backdrop"/>
      <BlurView intensity={40} tint="light" style={m.sheet}>
        <View style={m.header}>
          <Text style={m.title}>Réserver</Text>
          <Pressable onPress={onClose} testID="booking-close"><X size={22}/></Pressable>
        </View>

        <Text style={m.label}>Dates</Text>
        <View style={m.row}>
          <Pressable style={m.pill} onPress={()=>{ setCalendarMode('start'); setCalendarVisible(true); }} testID="start-date">
            <Calendar size={16} />
            <Text style={m.pillTxt}>Arrivée: {start ?? "choisir"}</Text>
          </Pressable>
          <Pressable style={m.pill} onPress={()=>{ setCalendarMode('end'); setCalendarVisible(true); }} testID="end-date">
            <Calendar size={16} />
            <Text style={m.pillTxt}>Départ: {end ?? "choisir"}</Text>
          </Pressable>
        </View>

        <Text style={m.label}>Voyageurs</Text>
        <View style={m.row}>
          <Pressable style={m.pill} onPress={()=>setGuests(Math.max(1, guests-1))}><Text style={m.pillTxt}>−</Text></Pressable>
          <Pressable style={m.pill}><Users size={16}/><Text style={m.pillTxt}>{guests} voyageur(s)</Text></Pressable>
          <Pressable style={m.pill} onPress={()=>setGuests(guests+1)}><Text style={m.pillTxt}>+</Text></Pressable>
        </View>

        {can && (
          <Text style={m.total}>Total estimé: {nightlyPrice.toLocaleString()} FCFA / nuit</Text>
        )}

        <Pressable disabled={!can} style={[m.cta, !can && m.ctaDisabled]} onPress={()=>onRequest({ start: start!, end: end!, guests })} testID="booking-submit">
          <Text style={m.ctaTxt}>Demander la réservation</Text>
        </Pressable>
      </BlurView>

      <Modal visible={calendarVisible} transparent animationType="slide" onRequestClose={() => setCalendarVisible(false)}>
        <View style={m.modalOverlay}>
          <View style={m.modalContent}>
            <View style={m.modalHeader}>
              <Text style={m.modalTitle}>Sélectionner une date</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Text style={m.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={m.calendarContainer}>
              <View style={m.calendarRow}>
                <View style={m.calendarColumn}>
                  <Text style={m.calendarLabel}>Jour</Text>
                  <ScrollView style={m.calendarScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <TouchableOpacity
                        key={day}
                        style={[m.calendarItem, selectedDay === day && m.calendarItemActive]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[m.calendarItemText, selectedDay === day && m.calendarItemTextActive]}>
                          {String(day).padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={m.calendarColumn}>
                  <Text style={m.calendarLabel}>Mois</Text>
                  <ScrollView style={m.calendarScroll} showsVerticalScrollIndicator={false}>
                    {[
                      { num: 1, name: 'Janvier' },
                      { num: 2, name: 'Février' },
                      { num: 3, name: 'Mars' },
                      { num: 4, name: 'Avril' },
                      { num: 5, name: 'Mai' },
                      { num: 6, name: 'Juin' },
                      { num: 7, name: 'Juillet' },
                      { num: 8, name: 'Août' },
                      { num: 9, name: 'Septembre' },
                      { num: 10, name: 'Octobre' },
                      { num: 11, name: 'Novembre' },
                      { num: 12, name: 'Décembre' },
                    ].map(month => (
                      <TouchableOpacity
                        key={month.num}
                        style={[m.calendarItem, selectedMonth === month.num && m.calendarItemActive]}
                        onPress={() => setSelectedMonth(month.num)}
                      >
                        <Text style={[m.calendarItemText, selectedMonth === month.num && m.calendarItemTextActive]}>
                          {month.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={m.calendarColumn}>
                  <Text style={m.calendarLabel}>Année</Text>
                  <ScrollView style={m.calendarScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <TouchableOpacity
                        key={year}
                        style={[m.calendarItem, selectedYear === year && m.calendarItemActive]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[m.calendarItemText, selectedYear === year && m.calendarItemTextActive]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <TouchableOpacity
                style={m.calendarConfirm}
                onPress={() => {
                  const formatted = `${String(selectedDay).padStart(2, '0')}-${String(selectedMonth).padStart(2, '0')}-${selectedYear}`;
                  if (calendarMode === 'start') {
                    setStart(formatted);
                  } else {
                    setEnd(formatted);
                  }
                  setCalendarVisible(false);
                }}
              >
                <Text style={m.calendarConfirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const m = StyleSheet.create({
  backdrop:{ position:"absolute", left:0, right:0, top:0, bottom:0, backgroundColor:"rgba(0,0,0,.25)", justifyContent:"flex-end" },
  sheet:{ borderTopLeftRadius:22, borderTopRightRadius:22, overflow:"hidden", padding:16, backgroundColor:"rgba(255,255,255,.7)" },
  header:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:8 },
  title:{ fontSize:18, fontWeight:"900", color:"#0B3B36" },
  label:{ marginTop:12, fontWeight:"800", color:"#0B3B36" },
  row:{ flexDirection:"row", columnGap:10, marginTop:8, flexWrap:"wrap" },
  pill:{ backgroundColor:"#fff", borderWidth:1, borderColor:"#E6EFEC", borderRadius:999, paddingVertical:10, paddingHorizontal:14, flexDirection:"row", alignItems:"center", columnGap:8 },
  pillTxt:{ fontWeight:"800", color:"#0B3B36" },
  cta:{ marginTop:16, backgroundColor:"#134E48", borderRadius:14, alignItems:"center", paddingVertical:12 },
  ctaDisabled:{ opacity:.5 },
  ctaTxt:{ color:"#fff", fontWeight:"900" },
  total:{ marginTop:10, fontWeight:"800", color:"#0B3B36" },
  flex1:{ flex:1 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "70%", paddingBottom: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  modalTitle: { fontSize: 18, fontWeight: "800" },
  modalClose: { fontSize: 24, color: "#6b7280" },
  calendarContainer: { paddingHorizontal: 20, paddingVertical: 16 },
  calendarRow: { flexDirection: "row", gap: 12, height: 300 },
  calendarColumn: { flex: 1 },
  calendarLabel: { fontSize: 14, fontWeight: "700", color: "#1f2937", marginBottom: 8, textAlign: "center" },
  calendarScroll: { flex: 1 },
  calendarItem: { paddingVertical: 12, paddingHorizontal: 8, alignItems: "center", borderRadius: 8, marginBottom: 4 },
  calendarItemActive: { backgroundColor: "#f0fdf4" },
  calendarItemText: { fontSize: 15, color: "#1f2937" },
  calendarItemTextActive: { fontWeight: "700", color: "#065f46" },
  calendarConfirm: { marginTop: 16, height: 48, backgroundColor: "#065f46", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  calendarConfirmText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});