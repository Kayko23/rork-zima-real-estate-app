import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { ProKycInput } from '@/lib/proKycSchema';

export function Step2Contact() {
  const { control } = useFormContext<Partial<ProKycInput>>();

  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Email *</Text>
            <TextInput
              style={[s.input, fieldState.error && s.inputError]}
              value={field.value}
              onChangeText={field.onChange}
              placeholder="votre@email.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="phoneWhatsApp"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Téléphone WhatsApp</Text>
            <TextInput
              style={[s.input, fieldState.error && s.inputError]}
              value={field.value}
              onChangeText={field.onChange}
              placeholder="+221 XX XXX XX XX"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="phoneMobile"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Téléphone mobile</Text>
            <Text style={s.hint}>Au moins un numéro (WhatsApp ou mobile) est requis</Text>
            <TextInput
              style={[s.input, fieldState.error && s.inputError]}
              value={field.value}
              onChangeText={field.onChange}
              placeholder="+221 XX XXX XX XX"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="website"
        render={({ field }) => (
          <View style={s.field}>
            <Text style={s.label}>Site web (optionnel)</Text>
            <TextInput
              style={s.input}
              value={field.value}
              onChangeText={field.onChange}
              placeholder="https://..."
              placeholderTextColor="#9ca3af"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  field: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6, color: '#111827' },
  hint: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#ef4444' },
  error: { marginTop: 6, fontSize: 13, color: '#ef4444' },
});
