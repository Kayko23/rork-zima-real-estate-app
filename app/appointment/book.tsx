import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Clock } from 'lucide-react-native';

import DateField from '@/components/appointment/DateField';
import SlotButton from '@/components/appointment/SlotButton';
import * as api from '@/services/appointments';

export default function AppointmentScreen() {
  const {
    providerId = 'agent-1',
    name = 'Agent immobilier',
  } = useLocalSearchParams<{ providerId?: string; name?: string }>();
  const insets = useSafeAreaInsets();

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  });
  const [pickedIso, setPickedIso] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const dateIso = useMemo(() => date.toISOString().slice(0, 10), [date]);
  const slotsQ = useQuery({
    queryKey: ['slots', providerId, dateIso],
    queryFn: () => api.fetchSlots(providerId, dateIso),
  });

  const book = useMutation({
    mutationFn: () => {
      if (!pickedIso) throw new Error('No slot');
      return api.bookAppointment({
        providerId,
        datetimeIso: pickedIso,
        message: note.trim() || undefined,
      });
    },
    onSuccess: () => {
      Alert.alert(
        'Demande envoyée',
        'Votre demande de rendez-vous a bien été transmise.'
      );
      router.back();
    },
    onError: () =>
      Alert.alert('Erreur', "Impossible d'envoyer la demande. Réessayez."),
  });

  const localSlots = useMemo(() => {
    const now = new Date();
    const isToday = new Date().toDateString() === date.toDateString();
    return (slotsQ.data ?? []).map((s) => {
      if (!isToday) return s;
      const t = new Date(s.iso);
      const disabledForPast = t.getTime() <= now.getTime();
      return { ...s, available: s.available && !disabledForPast };
    });
  }, [slotsQ.data, date]);

  const canSubmit = !!pickedIso && !book.isPending;

  return (
    <View style={{ flex: 1, backgroundColor: '#F7FAF9' }}>
      <Stack.Screen
        options={{
          title: 'Rendez-vous',
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 24 + 64 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.sub}>{String(name)}</Text>

          <DateField
            value={date}
            onChange={(d) => {
              setDate(d);
              setPickedIso(null);
            }}
          />

          <Text style={[s.label, { marginTop: 22 }]}>
            <Clock size={18} color="#0A1F17" /> Heure
          </Text>

          {slotsQ.isLoading ? (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          ) : (
            <View style={s.grid}>
              {localSlots.length > 0 ? (
                localSlots.map((sl) => (
                  <SlotButton
                    key={sl.iso}
                    label={sl.label}
                    disabled={!sl.available}
                    selected={pickedIso === sl.iso}
                    onPress={() => setPickedIso(sl.iso)}
                  />
                ))
              ) : (
                <Text style={{ color: '#6D7A75', marginTop: 8 }}>
                  Aucun créneau disponible pour cette date.
                </Text>
              )}
            </View>
          )}

          <Text style={[s.label, { marginTop: 10 }]}>Message (optionnel)</Text>
          <TextInput
            style={s.note}
            placeholder="Ajoutez un message pour l'agent…"
            placeholderTextColor="#9AA6A1"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </ScrollView>

        <View
          style={[s.ctaWrap, { paddingBottom: Math.max(insets.bottom, 12) }]}
        >
          <Text style={s.summary}>
            {pickedIso
              ? formatSummary(pickedIso)
              : 'Sélectionnez une date et une heure'}
          </Text>
          <View
            style={[s.cta, !canSubmit && { backgroundColor: '#A9B7B1' }]}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSubmit }}
            onTouchEnd={() => {
              if (canSubmit) book.mutate();
            }}
          >
            <Text style={s.ctaTxt}>
              {book.isPending ? 'Envoi…' : 'Demander le rendez-vous'}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function formatSummary(iso: string) {
  const d = new Date(iso);
  const dd = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(d);
  const hh = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
  return `${dd} • ${hh}`;
}

const s = StyleSheet.create({
  sub: { color: '#6D7A75', marginBottom: 6, fontSize: 14 },
  label: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#0A1F17',
    marginBottom: 10,
    flexDirection: 'row',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
  note: {
    minHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCE4E0',
    backgroundColor: '#fff',
    padding: 14,
    fontSize: 16,
    color: '#0A1F17',
  },
  ctaWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: '#F7FAF9',
    borderTopColor: '#E6ECEF',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  summary: {
    textAlign: 'center',
    color: '#0A1F17',
    marginBottom: 8,
    fontWeight: '600' as const,
  },
  cta: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0E5A44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTxt: { color: '#fff', fontSize: 16, fontWeight: '700' as const },
});
