import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, ArrowLeft } from 'lucide-react-native';
import DateField from '@/components/appointment/DateField';
import { bookAppointment, fetchSlots, type Slot } from '@/services/appointments';
import Colors from '@/constants/colors';

export default function RescheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [date, setDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedIso, setSelectedIso] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const dateIso = useMemo(() => new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().slice(0, 10), [date]);

  const load = useCallback(async () => {
    console.log('[Reschedule] fetching slots for', dateIso);
    try {
      setLoading(true);
      const s = await fetchSlots('pro_1', dateIso);
      setSlots(s);
      const first = s.find(x => x.available);
      setSelectedIso(first?.iso);
    } catch (e) {
      console.error('[Reschedule] slots error', e);
      Alert.alert('Erreur', 'Impossible de charger les créneaux. Réessayez.');
    } finally {
      setLoading(false);
    }
  }, [dateIso]);

  useEffect(() => { void load(); }, [load]);

  const onConfirm = useCallback(async () => {
    if (!selectedIso) {
      Alert.alert('Sélection requise', 'Veuillez choisir un créneau.');
      return;
    }
    try {
      setSubmitting(true);
      console.log('[Reschedule] booking', { id, selectedIso });
      await bookAppointment({ providerId: 'pro_1', datetimeIso: selectedIso });
      Alert.alert('Rendez-vous reprogrammé', 'Votre rendez-vous a été mis à jour.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      console.error('[Reschedule] confirm error', e);
      Alert.alert('Erreur', "La reprogrammation a échoué. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }, [selectedIso, router, id]);

  return (
    <View style={[s.container, { paddingTop: insets.top + 8 }]} testID="reschedule-screen">
      <View style={s.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" testID="back-btn" style={s.backBtn}>
          <ArrowLeft size={20} color={Colors.text.primary} />
        </Pressable>
        <Text style={s.title}>Reprogrammer</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.section}>
        <View style={{ marginBottom: 12 }}>
          <DateField value={date} onChange={(d) => setDate(d)} />
        </View>
        <View style={s.rowHeader}>
          <Calendar size={16} color={Colors.text.secondary} />
          <Text style={s.rowHeaderTxt}>Créneaux disponibles</Text>
        </View>

        {loading ? (
          <View style={s.center}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={slots}
            keyExtractor={(i) => i.iso}
            contentContainerStyle={{ paddingVertical: 6 }}
            ListEmptyComponent={<Text style={s.empty}>Aucun créneau pour cette date.</Text>}
            renderItem={({ item }) => (
              <SlotRow
                slot={item}
                selected={selectedIso === item.iso}
                onPress={() => item.available && setSelectedIso(item.iso)}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                  try {
                    setRefreshing(true);
                    await load();
                  } finally {
                    setRefreshing(false);
                  }
                }}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        )}
      </View>

      <Pressable
        testID="confirm-reschedule"
        onPress={onConfirm}
        disabled={submitting || !selectedIso}
        style={[s.cta, (!selectedIso || submitting) && { opacity: 0.5 }]}
        accessibilityRole="button"
      >
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={s.ctaTxt}>Confirmer</Text>}
      </Pressable>

      <View style={{ height: insets.bottom + 8 }} />
    </View>
  );
}

function SlotRow({ slot, selected, onPress }: { slot: Slot; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!slot.available}
      testID={`slot-${slot.label}`}
      style={[s.slot, selected && s.slotSel, !slot.available && s.slotDisabled]}
      accessibilityRole="button"
    >
      <Clock size={16} color={selected ? Colors.background.primary : Colors.text.primary} />
      <Text style={[s.slotTxt, selected && { color: Colors.background.primary }]}>{slot.label}</Text>
      {!slot.available && <Text style={s.slotUnavailable}>Indisponible</Text>}
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.secondary },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: Colors.background.primary },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text.primary },
  section: { marginHorizontal: 16, backgroundColor: Colors.background.primary, borderRadius: 16, padding: 16 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  rowHeaderTxt: { color: Colors.text.secondary, fontWeight: '600' },
  center: { paddingVertical: 20, alignItems: 'center' },
  empty: { color: Colors.text.secondary, paddingVertical: 12 },
  slot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, marginBottom: 8, backgroundColor: '#fff' },
  slotTxt: { fontWeight: '700', color: Colors.text.primary },
  slotSel: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  slotDisabled: { opacity: 0.5 },
  slotUnavailable: { color: Colors.text.secondary },
  cta: { position: 'absolute', left: 16, right: 16, bottom: 16, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  ctaTxt: { color: '#fff', fontWeight: '800' },
});
