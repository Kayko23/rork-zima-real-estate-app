import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "lucide-react-native";

export default function AdjustSheet({ initial, onConfirm }:{
  initial:{ price:number; currency:string; from?:string; to?:string };
  onConfirm:(v:{ price:number; currency:string; from?:string; to?:string })=>void;
}) {
  const [price, setPrice] = useState(String(initial.price));
  const [currency, setCurrency] = useState(initial.currency);
  const [from, setFrom] = useState(initial.from ?? "");
  const [to, setTo] = useState(initial.to ?? "");
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [calendarMode, setCalendarMode] = useState<'from' | 'to'>('from');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const handleConfirm = () => {
    onConfirm({ 
      price: Number(price||0), 
      currency, 
      from: from || undefined, 
      to: to || undefined 
    });
  };

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        style={s.container} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView 
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.title}>Ajuster l&apos;annonce</Text>
      <View style={s.priceRow}>
        <TextInput 
          style={[s.input, s.priceInput]} 
          keyboardType="numeric" 
          value={price} 
          onChangeText={setPrice} 
          placeholder="Prix" 
        />
        <TextInput 
          style={[s.input, s.currencyInput]} 
          value={currency} 
          onChangeText={setCurrency} 
          placeholder="Devise" 
        />
      </View>
      <Text style={s.label}>Disponibilité (optionnel)</Text>
      <View style={s.dateRow}>
        <Pressable 
          style={[s.input, s.dateInput]} 
          onPress={() => {
            setCalendarMode('from');
            setCalendarVisible(true);
          }}
        >
          <Text style={from ? s.dateText : s.datePlaceholder}>{from || "Du (JJ-MM-AAAA)"}</Text>
          <Calendar size={18} color="#6b7280" />
        </Pressable>
        <Pressable 
          style={[s.input, s.dateInput]} 
          onPress={() => {
            setCalendarMode('to');
            setCalendarVisible(true);
          }}
        >
          <Text style={to ? s.dateText : s.datePlaceholder}>{to || "Au (JJ-MM-AAAA)"}</Text>
          <Calendar size={18} color="#6b7280" />
        </Pressable>
      </View>
          <Pressable style={s.cta} onPress={handleConfirm}>
            <Text style={s.ctaTxt}>Enregistrer</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={calendarVisible} transparent animationType="slide" onRequestClose={() => setCalendarVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Sélectionner une date</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={s.calendarContainer}>
              <View style={s.calendarRow}>
                <View style={s.calendarColumn}>
                  <Text style={s.calendarLabel}>Jour</Text>
                  <ScrollView style={s.calendarScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <TouchableOpacity
                        key={day}
                        style={[s.calendarItem, selectedDay === day && s.calendarItemActive]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[s.calendarItemText, selectedDay === day && s.calendarItemTextActive]}>
                          {String(day).padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={s.calendarColumn}>
                  <Text style={s.calendarLabel}>Mois</Text>
                  <ScrollView style={s.calendarScroll} showsVerticalScrollIndicator={false}>
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
                        style={[s.calendarItem, selectedMonth === month.num && s.calendarItemActive]}
                        onPress={() => setSelectedMonth(month.num)}
                      >
                        <Text style={[s.calendarItemText, selectedMonth === month.num && s.calendarItemTextActive]}>
                          {month.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={s.calendarColumn}>
                  <Text style={s.calendarLabel}>Année</Text>
                  <ScrollView style={s.calendarScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: new Date().getFullYear() + 10 - new Date().getFullYear() + 1 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <TouchableOpacity
                        key={year}
                        style={[s.calendarItem, selectedYear === year && s.calendarItemActive]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[s.calendarItemText, selectedYear === year && s.calendarItemTextActive]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <TouchableOpacity
                style={s.calendarConfirm}
                onPress={() => {
                  const formatted = `${String(selectedDay).padStart(2, '0')}-${String(selectedMonth).padStart(2, '0')}-${selectedYear}`;
                  if (calendarMode === 'from') {
                    setFrom(formatted);
                  } else {
                    setTo(formatted);
                  }
                  setCalendarVisible(false);
                }}
              >
                <Text style={s.calendarConfirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  scrollContent: { padding: 16, gap: 10, paddingBottom: 40 }, 
  title: { fontSize:18, fontWeight:"800" }, 
  priceRow: { flexDirection:"row", gap:10 },
  dateRow: { flexDirection:"row", gap:10 },
  input: { height:48, borderRadius:12, borderWidth:1, borderColor:"#e5e7eb", paddingHorizontal:12, backgroundColor:"#fff" }, 
  priceInput: { flex:1 },
  currencyInput: { width:110 },
  dateInput: { flex:1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dateText: { color: "#1f2937", fontSize: 14 },
  datePlaceholder: { color: "#9ca3af", fontSize: 14 },
  label: { fontWeight:"700", marginTop:6 },
  cta: { height:48, backgroundColor:"#064e3b", borderRadius:12, alignItems:"center", justifyContent:"center" }, 
  ctaTxt: { color:"#fff", fontWeight:"800" },
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