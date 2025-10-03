import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CreditCard, Plus, Receipt, Trash2, CheckCircle2, Smartphone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';
import { colors, radius } from '@/theme/tokens';

const demoTx = [
  { id: 't1', label: 'Boost annonce #A-3291', amount: '5 000 FCFA', date: '12/09/2025' },
  { id: 't2', label: 'Abonnement Pro (mois)', amount: '15 000 FCFA', date: '01/09/2025' },
];

const PLANS = [
  { id: 'pro-monthly' as const, label: 'Pro — Mensuel', price: '15 000 FCFA / mois' },
  { id: 'pro-yearly' as const, label: 'Pro — Annuel', price: '150 000 FCFA / an' },
];

export default function PaymentsScreen() {
  const router = useRouter();
  const { subscription, setDefaultPaymentMethod, removePaymentMethod, subscribeWithDefault, cancelSubscription } = useApp();
  const [loading, setLoading] = useState(false);

  const handleSetDefault = async (id: string) => {
    await setDefaultPaymentMethod(id);
  };

  const handleRemove = async (id: string) => {
    Alert.alert(
      'Supprimer',
      'Supprimer ce moyen de paiement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => await removePaymentMethod(id),
        },
      ]
    );
  };

  const handleSubscribe = async (planId: 'pro-monthly' | 'pro-yearly') => {
    setLoading(true);
    try {
      const res = await subscribeWithDefault(planId);
      Alert.alert(res.ok ? 'Abonnement' : 'Erreur', res.msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler l\'abonnement',
      'Tes biens ne seront plus visibles publiquement. Confirmer ?',
      [
        { text: 'Non' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => await cancelSubscription(),
        },
      ]
    );
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={s.container}>
          <Text style={s.h2}>Moyens de paiement</Text>
          
          {subscription.paymentMethods.length === 0 && (
            <Text style={s.emptyText}>Aucun moyen de paiement. Ajoute Mobile Money ci-dessous.</Text>
          )}
          
          {subscription.paymentMethods.map(pm => (
            <View key={pm.id} style={[s.card, pm.isDefault && s.cardDefault]}>
              <View style={s.cardRow}>
                {pm.type === 'mobile_money' ? (
                  <Smartphone size={20} color={colors.primary} />
                ) : (
                  <CreditCard size={20} color={colors.primary} />
                )}
                <View style={{ flex: 1 }}>
                  {pm.type === 'mobile_money' ? (
                    <>
                      <Text style={s.cardTxt}>
                        {(pm.provider || '').toUpperCase()} • {pm.country}
                      </Text>
                      <Text style={s.cardSubtxt}>
                        {pm.accountName} | {pm.phone} | {pm.currency}
                      </Text>
                    </>
                  ) : (
                    <Text style={s.cardTxt}>
                      {(pm.brand || '').toUpperCase()} •••• {pm.last4} — {pm.exp}
                    </Text>
                  )}
                </View>
                {pm.isDefault && <CheckCircle2 size={20} color={colors.primary} />}
              </View>
              <View style={s.cardActions}>
                {!pm.isDefault && (
                  <Pressable onPress={() => handleSetDefault(pm.id)}>
                    <Text style={s.linkText}>Définir par défaut</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => handleRemove(pm.id)} hitSlop={8}>
                  <Trash2 size={18} color={colors.danger} />
                </Pressable>
              </View>
            </View>
          ))}

          <Pressable
            style={s.addBtn}
            onPress={() => router.push('/profile/add-mobile-money')}
          >
            <Plus size={20} color={colors.primary} />
            <Text style={s.addTxt}>Ajouter Mobile Money</Text>
          </Pressable>

          <Pressable
            style={s.addBtnCard}
            onPress={() => Alert.alert('Carte bancaire', 'Fonctionnalité en cours de développement')}
          >
            <Plus size={20} color={colors.primary} />
            <Text style={s.addTxt}>Ajouter carte bancaire</Text>
          </Pressable>

          <Text style={[s.h2, s.sectionTitle]}>Abonnement</Text>
          
          {loading && (
            <View style={s.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={s.loadingText}>Traitement du paiement...</Text>
            </View>
          )}
          
          {!loading && PLANS.map(p => (
            <Pressable
              key={p.id}
              onPress={() => handleSubscribe(p.id)}
              style={[
                s.planCard,
                subscription.plan === p.id && s.planCardActive,
              ]}
            >
              <Text style={s.planLabel}>{p.label}</Text>
              <Text style={s.planPrice}>{p.price}</Text>
              {subscription.plan === p.id && subscription.nextBillingAt && (
                <Text style={s.planActive}>
                  Actif — prochaine facturation{' '}
                  {new Date(subscription.nextBillingAt).toLocaleDateString('fr-FR')}
                </Text>
              )}
            </Pressable>
          ))}

          {subscription.plan !== 'none' && !loading && (
            <Pressable onPress={handleCancel} style={s.cancelBtn}>
              <Text style={s.cancelText}>Annuler l'abonnement</Text>
            </Pressable>
          )}

          <Text style={[s.h2, s.sectionTitle]}>Historique</Text>
        </View>
      }
      data={demoTx}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={s.txRow}>
          <Receipt size={20} color={colors.primary} />
          <View style={s.txContent}>
            <Text style={s.txLabel}>{item.label}</Text>
            <Text style={s.txMeta}>{item.date}</Text>
          </View>
          <Text style={s.txAmount}>{item.amount}</Text>
        </View>
      )}
      contentContainerStyle={s.contentContainer}
    />
  );
}

const s = StyleSheet.create({
  container: { padding: 16 },
  h2: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: colors.text },
  emptyText: { color: colors.sub, marginBottom: 12, fontStyle: 'italic' },
  card: {
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: colors.panel,
    marginBottom: 10,
    gap: 10,
  },
  cardDefault: { borderColor: colors.primary, borderWidth: 2 },
  cardTxt: { fontWeight: '700', color: colors.text, fontSize: 14 },
  cardSubtxt: { color: colors.sub, fontSize: 12, marginTop: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardActions: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  linkText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  addBtn: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.primarySoft,
    marginBottom: 16,
  },
  addTxt: { fontWeight: '700', color: colors.primary },
  addBtnCard: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.primarySoft,
    marginBottom: 16,
  },
  sectionTitle: { marginTop: 24 },
  loadingContainer: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  loadingText: { color: colors.sub, fontWeight: '600' },
  planCard: {
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: colors.panel,
    marginBottom: 10,
  },
  planCardActive: { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primarySoft },
  planLabel: { fontWeight: '800', color: colors.text, fontSize: 15 },
  planPrice: { color: colors.sub, marginTop: 4, fontSize: 13 },
  planActive: { marginTop: 8, color: colors.primary, fontWeight: '700', fontSize: 13 },
  cancelBtn: {
    marginTop: 12,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: '#FFE9E7',
    alignItems: 'center',
  },
  cancelText: { color: colors.danger, fontWeight: '900' },
  txRow: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.muted,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txLabel: { fontWeight: '600', color: colors.text },
  txMeta: { color: colors.sub, marginTop: 2, fontSize: 12 },
  txAmount: { fontWeight: '800', color: colors.text },
  txContent: { flex: 1 },
  contentContainer: { paddingBottom: 24 },
});
