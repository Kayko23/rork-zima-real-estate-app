import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { ProKycInput } from '@/lib/proKycSchema';
import { FileUploadInput } from '../FileUploadInput';
import { SelfieInput } from '../SelfieInput';
import { AvatarInput } from '../AvatarInput';

export function Step3Documents() {
  const { control, watch } = useFormContext<Partial<ProKycInput>>();
  const idType = watch('idType');

  return (
    <View>
      <Text style={s.info}>
        Vos documents sont utilisés uniquement pour la vérification d&apos;identité et la lutte anti-fraude.
      </Text>

      <Controller
        control={control}
        name="idFrontUrl"
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
          name="idBackUrl"
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
        name="selfieWithIdUrl"
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
        name="avatarUrl"
        render={({ field, fieldState }) => (
          <AvatarInput
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
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
});
