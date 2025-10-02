import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { ProKycInput } from '@/lib/proKycSchema';
import { CheckSquare, Square } from 'lucide-react-native';

export function Step5Review() {
  const { watch, control } = useFormContext<Partial<ProKycInput>>();
  const values = watch();

  return (
    <View>
      <Text style={s.sectionTitle}>Récapitulatif</Text>

      <View style={s.section}>
        <Text style={s.sectionLabel}>Identité</Text>
        <InfoRow label="Nom" value={values.legalName} />
        <InfoRow label="Date de naissance" value={values.birthDate} />
        <InfoRow label="Pays" value={values.country} />
        <InfoRow label="Ville" value={values.city} />
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>Contact</Text>
        <InfoRow label="Email" value={values.email} />
        <InfoRow label="WhatsApp" value={values.phoneWhatsApp || '-'} />
        <InfoRow label="Mobile" value={values.phoneMobile || '-'} />
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>Documents</Text>
        {values.avatarUrl && (
          <View style={s.docPreview}>
            <Image source={{ uri: values.avatarUrl }} style={s.avatar} />
            <Text style={s.docLabel}>Photo de profil</Text>
          </View>
        )}
        {values.idFrontUrl && <Text style={s.docItem}>✓ Pièce d&apos;identité (recto)</Text>}
        {values.idBackUrl && <Text style={s.docItem}>✓ Pièce d&apos;identité (verso)</Text>}
        {values.selfieWithIdUrl && <Text style={s.docItem}>✓ Selfie avec pièce</Text>}
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>Profil professionnel</Text>
        <InfoRow label="Catégorie" value={values.category} />
        <InfoRow label="Bio" value={values.bio?.substring(0, 100) + '...'} />
        {values.businessName && <InfoRow label="Nom commercial" value={values.businessName} />}
      </View>

      <View style={s.consentBox}>
        <Controller
          control={control}
          name="consentAccepted"
          render={({ field, fieldState }) => (
            <>
              <Pressable
                style={s.consentRow}
                onPress={() => field.onChange(!field.value)}
              >
                {field.value ? (
                  <CheckSquare size={24} color="#059669" />
                ) : (
                  <Square size={24} color="#9ca3af" />
                )}
                <Text style={s.consentText}>
                  J&apos;accepte les{' '}
                  <Text style={s.link}>Conditions Générales d&apos;Utilisation</Text>
                  {' '}et la{' '}
                  <Text style={s.link}>Politique de confidentialité</Text>
                </Text>
              </Pressable>
              {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
            </>
          )}
        />
      </View>

      <Text style={s.finalNote}>
        Votre demande sera examinée sous 24-48h. Vous recevrez une notification par email.
      </Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20, color: '#111827' },
  section: { marginBottom: 24, padding: 16, backgroundColor: '#f9fafb', borderRadius: 12 },
  sectionLabel: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111827' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoLabel: { fontSize: 14, color: '#6b7280', flex: 1 },
  infoValue: { fontSize: 14, color: '#111827', fontWeight: '500', flex: 2, textAlign: 'right' },
  docPreview: { alignItems: 'center', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  docLabel: { fontSize: 13, color: '#6b7280' },
  docItem: { fontSize: 14, color: '#059669', marginBottom: 6 },
  consentBox: {
    padding: 16,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1fae5',
    marginBottom: 16,
  },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  consentText: { flex: 1, fontSize: 14, color: '#111827', lineHeight: 20 },
  link: { color: '#059669', fontWeight: '600', textDecorationLine: 'underline' },
  finalNote: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  error: { marginTop: 8, fontSize: 13, color: '#ef4444' },
});
