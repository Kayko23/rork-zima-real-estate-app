import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { ProKycInput } from '@/lib/proKycSchema';

const CATEGORIES = [
  { value: 'AGENT', label: 'Agent immobilier' },
  { value: 'AGENCE', label: 'Agence immobilière' },
  { value: 'GESTIONNAIRE', label: 'Gestionnaire' },
  { value: 'CONSEIL', label: 'Conseil' },
  { value: 'HOTELLERIE', label: 'Hôtellerie' },
] as const;

const LANGUAGES = ['Français', 'Anglais', 'Wolof', 'Arabe', 'Portugais', 'Espagnol'];

export function Step4Profile() {
  const { control, watch } = useFormContext<Partial<ProKycInput>>();
  const accountType = watch('accountType');
  const selectedLanguages = watch('languages') || [];

  return (
    <View>
      <Controller
        control={control}
        name="category"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Catégorie professionnelle *</Text>
            <View style={s.chipGroup}>
              {CATEGORIES.map(cat => (
                <Pressable
                  key={cat.value}
                  style={[s.chip, field.value === cat.value && s.chipActive]}
                  onPress={() => field.onChange(cat.value)}
                >
                  <Text style={[s.chipText, field.value === cat.value && s.chipTextActive]}>
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="bio"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Bio professionnelle *</Text>
            <Text style={s.hint}>Minimum 30 caractères</Text>
            <TextInput
              style={[s.input, s.textArea, fieldState.error && s.inputError]}
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Décrivez votre expérience, vos spécialités..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
            />
            {field.value && (
              <Text style={s.charCount}>{field.value.length} / 30 min</Text>
            )}
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      {accountType === 'AGENCE' && (
        <>
          <Controller
            control={control}
            name="businessName"
            render={({ field, fieldState }) => (
              <View style={s.field}>
                <Text style={s.label}>Nom commercial *</Text>
                <TextInput
                  style={[s.input, fieldState.error && s.inputError]}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Nom de votre agence"
                  placeholderTextColor="#9ca3af"
                />
                {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="rccm"
            render={({ field }) => (
              <View style={s.field}>
                <Text style={s.label}>RCCM (optionnel)</Text>
                <TextInput
                  style={s.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Numéro RCCM"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="nif"
            render={({ field }) => (
              <View style={s.field}>
                <Text style={s.label}>NIF (optionnel)</Text>
                <TextInput
                  style={s.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Numéro d'identification fiscale"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            )}
          />
        </>
      )}

      <Controller
        control={control}
        name="languages"
        render={({ field }) => (
          <View style={s.field}>
            <Text style={s.label}>Langues parlées *</Text>
            <View style={s.chipGroup}>
              {LANGUAGES.map(lang => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <Pressable
                    key={lang}
                    style={[s.chip, isSelected && s.chipActive]}
                    onPress={() => {
                      const newLangs = isSelected
                        ? selectedLanguages.filter(l => l !== lang)
                        : [...selectedLanguages, lang];
                      field.onChange(newLangs);
                    }}
                  >
                    <Text style={[s.chipText, isSelected && s.chipTextActive]}>
                      {lang}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
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
  textArea: { height: 120, paddingTop: 12, textAlignVertical: 'top' },
  charCount: { marginTop: 6, fontSize: 12, color: '#9ca3af', textAlign: 'right' },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  chipActive: { borderColor: '#059669', backgroundColor: '#ecfdf5' },
  chipText: { fontSize: 14, fontWeight: '500', color: '#6b7280' },
  chipTextActive: { color: '#059669' },
  error: { marginTop: 6, fontSize: 13, color: '#ef4444' },
});
