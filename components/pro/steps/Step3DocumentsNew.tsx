import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { ProKycInput } from '@/lib/proKycSchema';
import { FileUploadInput } from '../FileUploadInput';
import { SelfieInput } from '../SelfieInput';
import { AvatarInput } from '../AvatarInput';
import { Sector } from '@/types/pro';

export function Step3Documents() {
  const { control, watch } = useFormContext<Partial<ProKycInput>>();
  const idType = watch('identity.idType');
  const accountType = watch('identity.accountType');
  const sectors = (watch('profile.sectors') || []) as Sector[];
  const categories = watch('profile.categories') || [];

  const hasVehicles = sectors.includes('vehicles');
  const hasTravel = sectors.includes('travel');
  const isDriver = categories.includes('pro_driver');
  const isAgency = accountType === 'AGENCE';

  return (
    <View>
      <Text style={s.info}>
        Vos documents sont utilisés uniquement pour la vérification d&apos;identité et la lutte anti-fraude.
      </Text>

      <Controller
        control={control}
        name="documents.idFrontUrl"
        render={({ field, fieldState }) => (
          <FileUploadInput
            label="Photo recto de la pièce *"
            description="Photo claire et lisible de votre pièce d'identité"
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            aspectRatio={[16, 10]}
          />
        )}
      />

      {idType === 'CNI' && (
        <Controller
          control={control}
          name="documents.idBackUrl"
          render={({ field }) => (
            <FileUploadInput
              label="Photo verso de la pièce"
              description="Pour les CNI, le verso est requis"
              value={field.value}
              onChange={field.onChange}
              aspectRatio={[16, 10]}
            />
          )}
        />
      )}

      <Controller
        control={control}
        name="documents.selfieWithIdUrl"
        render={({ field, fieldState }) => (
          <SelfieInput
            label="Selfie avec pièce en main *"
            description="Tenez votre pièce à côté de votre visage, bien visible"
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="documents.avatarUrl"
        render={({ field, fieldState }) => (
          <AvatarInput
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      {isAgency && (
        <>
          <Text style={s.sectionTitle}>Documents d&apos;entreprise</Text>
          
          <Controller
            control={control}
            name="documents.businessRegistryUrl"
            render={({ field }) => (
              <FileUploadInput
                label="RCCM / NIF"
                description="Registre de commerce ou numéro d'identification fiscale"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </>
      )}

      {hasTravel && isAgency && (
        <Controller
          control={control}
          name="documents.operationLicenseUrl"
          render={({ field, fieldState }) => (
            <FileUploadInput
              label="Autorisation d'exploitation"
              description="Licence hôtel/résidence ou agrément agence de voyage"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      )}

      {hasVehicles && isDriver && (
        <>
          <Text style={s.sectionTitle}>Documents chauffeur professionnel</Text>
          
          <Controller
            control={control}
            name="documents.drivingLicenseFrontUrl"
            render={({ field, fieldState }) => (
              <FileUploadInput
                label="Permis de conduire (recto) *"
                description="Photo claire du recto de votre permis"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                aspectRatio={[16, 10]}
              />
            )}
          />

          <Controller
            control={control}
            name="documents.drivingLicenseBackUrl"
            render={({ field }) => (
              <FileUploadInput
                label="Permis de conduire (verso)"
                description="Photo du verso de votre permis"
                value={field.value}
                onChange={field.onChange}
                aspectRatio={[16, 10]}
              />
            )}
          />

          <Controller
            control={control}
            name="documents.driverExperienceYears"
            render={({ field, fieldState }) => (
              <View style={s.field}>
                <Text style={s.label}>Années d&apos;expérience</Text>
                <TextInput
                  style={[s.input, fieldState.error && s.inputError]}
                  value={field.value?.toString() ?? ''}
                  onChangeText={(text) => field.onChange(text ? parseInt(text, 10) : undefined)}
                  placeholder="Ex: 5"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                />
                {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
              </View>
            )}
          />
        </>
      )}

      {hasVehicles && isAgency && (
        <Controller
          control={control}
          name="documents.fleetInsuranceUrl"
          render={({ field }) => (
            <FileUploadInput
              label="Assurance flotte (optionnel)"
              description="Attestation d'assurance pour votre parc de véhicules"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  info: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 10,
    marginBottom: 24,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
    color: '#111827',
  },
  field: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6, color: '#111827' },
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
