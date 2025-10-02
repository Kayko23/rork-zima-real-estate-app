import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, CheckCircle2, XCircle } from 'lucide-react-native';
import { ProStatus } from '@/types/pro';

export default function ProStatusScreen() {
  const params = useLocalSearchParams<{ status?: string; reason?: string }>();
  const status = (params.status || 'pending_review') as ProStatus;
  const rejectionReason = params.reason;

  const getStatusConfig = () => {
    switch (status) {
      case 'pending_review':
        return {
          icon: <Clock size={64} color="#f59e0b" />,
          title: 'Demande en cours de vérification',
          description:
            'Votre demande a été soumise avec succès. Notre équipe examine vos documents et vous contactera sous 24-48h.',
          color: '#f59e0b',
          bgColor: '#fffbeb',
          action: { label: 'Retour au profil', onPress: () => router.replace('/profile') },
        };
      case 'verified':
        return {
          icon: <CheckCircle2 size={64} color="#059669" />,
          title: 'Profil vérifié !',
          description:
            'Félicitations ! Votre profil professionnel est maintenant vérifié. Vous pouvez publier des annonces et gérer vos services.',
          color: '#059669',
          bgColor: '#ecfdf5',
          action: {
            label: 'Accéder au tableau de bord',
            onPress: () => router.replace('/(proTabs)/dashboard'),
          },
        };
      case 'rejected':
        return {
          icon: <XCircle size={64} color="#ef4444" />,
          title: 'Demande refusée',
          description: rejectionReason || 'Votre demande n\'a pas pu être validée. Veuillez corriger les informations et soumettre à nouveau.',
          color: '#ef4444',
          bgColor: '#fef2f2',
          action: {
            label: 'Corriger et renvoyer',
            onPress: () => router.replace('/pro/onboarding'),
          },
        };
      default:
        return {
          icon: <Clock size={64} color="#9ca3af" />,
          title: 'Statut inconnu',
          description: 'Une erreur est survenue.',
          color: '#9ca3af',
          bgColor: '#f9fafb',
          action: { label: 'Retour', onPress: () => router.back() },
        };
    }
  };

  const config = getStatusConfig();

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <View style={s.content}>
        <View style={[s.iconBox, { backgroundColor: config.bgColor }]}>
          {config.icon}
        </View>

        <Text style={s.title}>{config.title}</Text>
        <Text style={s.description}>{config.description}</Text>

        {status === 'pending_review' && (
          <View style={s.timeline}>
            <TimelineItem
              label="Demande soumise"
              status="completed"
              description="Vos documents ont été reçus"
            />
            <TimelineItem
              label="Vérification en cours"
              status="active"
              description="Notre équipe examine votre dossier"
            />
            <TimelineItem
              label="Validation finale"
              status="pending"
              description="Activation de votre profil pro"
            />
          </View>
        )}
      </View>

      <View style={s.footer}>
        <Pressable
          style={[s.actionBtn, { backgroundColor: config.color }]}
          onPress={config.action.onPress}
        >
          <Text style={s.actionBtnText}>{config.action.label}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function TimelineItem({
  label,
  status,
  description,
}: {
  label: string;
  status: 'completed' | 'active' | 'pending';
  description: string;
}) {
  return (
    <View style={s.timelineItem}>
      <View
        style={[
          s.timelineDot,
          status === 'completed' && s.timelineDotCompleted,
          status === 'active' && s.timelineDotActive,
        ]}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={[
            s.timelineLabel,
            status === 'active' && s.timelineLabelActive,
          ]}
        >
          {label}
        </Text>
        <Text style={s.timelineDesc}>{description}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  timeline: { width: '100%', gap: 20 },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    marginTop: 4,
  },
  timelineDotCompleted: { backgroundColor: '#059669' },
  timelineDotActive: { backgroundColor: '#f59e0b' },
  timelineLabel: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  timelineLabelActive: { color: '#111827' },
  timelineDesc: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  footer: { padding: 16 },
  actionBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
