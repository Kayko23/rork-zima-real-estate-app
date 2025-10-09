import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { ProKycInput } from '@/lib/proKycSchema';
import { CFA_COUNTRIES } from '@/constants/cfa';
import { ChevronDown } from 'lucide-react-native';

export function Step1Identity() {
  const { control, watch } = useFormContext<Partial<ProKycInput>>();
  const accountType = watch('identity.accountType');

  return (
    <View>
      <Text style={s.sectionTitle}>Type de compte</Text>
      <View style={s.radioGroup}>
        <Controller
          control={control}
          name="identity.accountType"
          render={({ field }) => (
            <>
              <Pressable
                style={[s.radioOption, field.value === 'INDEPENDANT' && s.radioOptionActive]}
                onPress={() => field.onChange('INDEPENDANT')}
              >
                <View style={[s.radio, field.value === 'INDEPENDANT' && s.radioActive]}>
                  {field.value === 'INDEPENDANT' && <View style={s.radioDot} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.radioLabel}>Indépendant</Text>
                  <Text style={s.radioDesc}>Professionnel individuel</Text>
                </View>
              </Pressable>

              <Pressable
                style={[s.radioOption, field.value === 'AGENCE' && s.radioOptionActive]}
                onPress={() => field.onChange('AGENCE')}
              >
                <View style={[s.radio, field.value === 'AGENCE' && s.radioActive]}>
                  {field.value === 'AGENCE' && <View style={s.radioDot} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.radioLabel}>Agence</Text>
                  <Text style={s.radioDesc}>Entreprise ou société</Text>
                </View>
              </Pressable>
            </>
          )}
        />
      </View>

      <Text style={s.sectionTitle}>Informations légales</Text>

      <Controller
        control={control}
        name="identity.legalName"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Nom complet légal *</Text>
            <Text style={s.hint}>Tel qu&apos;indiqué sur votre pièce d&apos;identité</Text>
            <TextInput
              style={[s.input, fieldState.error && s.inputError]}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder="Prénom(s) et nom(s)"
              placeholderTextColor="#9ca3af"
            />
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      {accountType === 'INDEPENDANT' && (
        <Controller
          control={control}
          name="identity.birthDate"
          render={({ field, fieldState }) => (
            <View style={s.field}>
              <Text style={s.label}>Date de naissance *</Text>
              <TextInput
                style={[s.input, fieldState.error && s.inputError]}
                value={field.value ?? ''}
                onChangeText={field.onChange}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor="#9ca3af"
              />
              {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
            </View>
          )}
        />
      )}

      <Controller
        control={control}
        name="identity.nationality"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Nationalité *</Text>
            <Pressable style={[s.input, s.selectInput, fieldState.error && s.inputError]}>
              <Text style={field.value ? s.selectValue : s.selectPlaceholder}>
                {field.value ? CFA_COUNTRIES[field.value as keyof typeof CFA_COUNTRIES]?.name : 'Sélectionnez'}
              </Text>
              <ChevronDown size={20} color="#9ca3af" />
            </Pressable>
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="identity.country"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Pays de résidence *</Text>
            <Pressable style={[s.input, s.selectInput, fieldState.error && s.inputError]}>
              <Text style={field.value ? s.selectValue : s.selectPlaceholder}>
                {field.value ? CFA_COUNTRIES[field.value as keyof typeof CFA_COUNTRIES]?.name : 'Sélectionnez'}
              </Text>
              <ChevronDown size={20} color="#9ca3af" />
            </Pressable>
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="identity.city"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Ville *</Text>
            <TextInput
              style={[s.input, fieldState.error && s.inputError]}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder="Votre ville"
              placeholderTextColor="#9ca3af"
            />
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="identity.addressLine"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Adresse complète *</Text>
            <TextInput
              style={[s.input, s.textArea, fieldState.error && s.inputError]}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder="Numéro, rue, quartier..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
            />
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      <Text style={s.sectionTitle}>Pièce d&apos;identité</Text>

      <Controller
        control={control}
        name="identity.idType"
        render={({ field }) => (
          <View style={s.field}>
            <Text style={s.label}>Type de pièce *</Text>
            <View style={s.chipGroup}>
              {(['CNI', 'PASSEPORT', 'RESIDENCE'] as const).map(type => (
                <Pressable
                  key={type}
                  style={[s.chip, field.value === type && s.chipActive]}
                  onPress={() => field.onChange(type)}
                >
                  <Text style={[s.chipText, field.value === type && s.chipTextActive]}>
                    {type === 'CNI' ? 'CNI' : type === 'PASSEPORT' ? 'Passeport' : 'Carte de résident'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      />

      <Controller
        control={control}
        name="identity.idNumber"
        render={({ field, fieldState }) => (
          <View style={s.field}>
            <Text style={s.label}>Numéro de pièce *</Text>
            <TextInput
              style={[s.input, fieldState.error && s.inputError]}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder="Numéro d'identification"
              placeholderTextColor="#9ca3af"
            />
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="identity.idExpiry"
        render={({ field }) => (
          <View style={s.field}>
            <Text style={s.label}>Date d&apos;expiration (optionnel)</Text>
            <TextInput
              style={s.input}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor="#9ca3af"
            />
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 20, marginBottom: 16, color: '#111827' },
  radioGroup: { gap: 12, marginBottom: 24 },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    gap: 12,
  },
  radioOptionActive: { borderColor: '#059669', backgroundColor: '#ecfdf5' },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: '#059669' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#059669' },
  radioLabel: { fontSize: 16, fontWeight: '600', color: '#111827' },
  radioDesc: { fontSize: 13, color: '#6b7280', marginTop: 2 },
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
  textArea: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
  selectInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectPlaceholder: { color: '#9ca3af', fontSize: 15 },
  selectValue: { color: '#111827', fontSize: 15 },
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
