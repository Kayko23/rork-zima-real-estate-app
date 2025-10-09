import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { ProKycInput } from '@/lib/proKycSchema';
import { CATEGORY_BY_SECTOR, LANGUAGES } from '@/constants/professionals';
import { Sector } from '@/types/pro';

export function Step4Profile() {
  const { control, watch } = useFormContext<Partial<ProKycInput>>();
  const accountType = watch('identity.accountType');
  const sectors = (watch('profile.sectors') || []) as Sector[];
  const selectedCategories = watch('profile.categories') || [];
  const selectedLanguages = watch('profile.languages') || [];

  return (
    <View>
      {sectors.map(sector => {
        const categories = CATEGORY_BY_SECTOR[sector];
        const sectorLabel = sector === 'property' ? 'Immobilier' : sector === 'travel' ? 'Voyages' : 'Véhicules';
        
        return (
          <View key={sector} style={s.sectorBlock}>
            <Text style={s.sectorTitle}>Catégories – {sectorLabel}</Text>
            <Controller
              control={control}
              name="profile.categories"
              render={({ field }) => (
                <View style={s.chipGroup}>
                  {categories.map(cat => {
                    const isSelected = selectedCategories.includes(cat.key);
                    return (
                      <Pressable
                        key={cat.key}
                        style={[s.chip, isSelected && s.chipActive]}
                        onPress={() => {
                          const newCats = isSelected
                            ? selectedCategories.filter(c => c !== cat.key)
                            : [...selectedCategories, cat.key];
                          field.onChange(newCats);
                        }}
                      >
                        <Text style={[s.chipText, isSelected && s.chipTextActive]}>
                          {cat.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            />
          </View>
        );
      })}

      <Controller
        control={control}
        name="profile.bio"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Bio professionnelle *</Text>
            <Text style={s.hint}>Minimum 30 caractères</Text>
            <TextInput
              style={[s.input, s.textArea, fieldState.error && s.inputError]}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder="Décrivez votre expérience, vos spécialités..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
            />
            {(field.value ?? '').length > 0 && (
              <Text style={s.charCount}>{(field.value ?? '').length} / 30 min</Text>
            )}
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      {accountType === 'AGENCE' && (
        <>
          <Controller
            control={control}
            name="profile.businessName"
            render={({ field, fieldState }) => (
              <View style={s.field}>
                <Text style={s.label}>Nom commercial *</Text>
                <TextInput
                  style={[s.input, fieldState.error && s.inputError]}
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  placeholder="Nom de votre agence/société"
                  placeholderTextColor="#9ca3af"
                />
                {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="profile.rccm"
            render={({ field }) => (
              <View style={s.field}>
                <Text style={s.label}>RCCM (optionnel)</Text>
                <TextInput
                  style={s.input}
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  placeholder="Numéro RCCM"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="profile.nif"
            render={({ field }) => (
              <View style={s.field}>
                <Text style={s.label}>NIF (optionnel)</Text>
                <TextInput
                  style={s.input}
                  value={field.value ?? ''}
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
        name="profile.languages"
        render={({ field }) => (
          <View style={s.field}>
            <Text style={s.label}>Langues parlées *</Text>
            <View style={s.chipGroup}>
              {LANGUAGES.map(lang => {
                const isSelected = selectedLanguages.includes(lang.code);
                return (
                  <Pressable
                    key={lang.code}
                    style={[s.chip, isSelected && s.chipActive]}
                    onPress={() => {
                      const newLangs = isSelected
                        ? selectedLanguages.filter(l => l !== lang.code)
                        : [...selectedLanguages, lang.code];
                      field.onChange(newLangs);
                    }}
                  >
                    <Text style={[s.chipText, isSelected && s.chipTextActive]}>
                      {lang.label}
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
  sectorBlock: { marginBottom: 28 },
  sectorTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111827' },
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
