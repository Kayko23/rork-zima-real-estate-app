import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { CreditCard, Plus, Receipt, Trash2, CheckCircle2, Crown } from "lucide-react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Billing from "@/services/billing";
import Screen from "@/components/layout/Screen";

export default function PaymentsScreen() {
  const qClient = useQueryClient();
  
  const plansQuery = useQuery({ 
    queryKey: ['plans'], 
    queryFn: Billing.listPlans,
  });
  
  const subQuery = useQuery({ 
    queryKey: ['subscription'], 
    queryFn: Billing.getSubscription,
  });
  
  const methodsQuery = useQuery({ 
    queryKey: ['payment-methods'], 
    queryFn: Billing.getPaymentMethods,
  });
  
  const historyQuery = useQuery({ 
    queryKey: ['billing-history'], 
    queryFn: Billing.getBillingHistory,
  });
  
  const setDefaultMutation = useMutation({
    mutationFn: Billing.setDefaultMethod,
    onSuccess: () => qClient.invalidateQueries({ queryKey: ['payment-methods'] }),
  });
  
  const removeMutation = useMutation({
    mutationFn: Billing.removeCard,
    onSuccess: () => qClient.invalidateQueries({ queryKey: ['payment-methods'] }),
  });
  
  const cancelMutation = useMutation({
    mutationFn: Billing.cancelSubscription,
    onSuccess: () => {
      qClient.invalidateQueries({ queryKey: ['subscription'] });
      qClient.invalidateQueries({ queryKey: ['properties'] });
      qClient.invalidateQueries({ queryKey: ['professionals'] });
      Alert.alert('Succès', 'Votre abonnement a été annulé');
    },
  });

  function handleSetDefault(id: string) {
    setDefaultMutation.mutate(id);
  }
  
  function handleRemove(id: string) {
    Alert.alert(
      'Supprimer la carte',
      'Êtes-vous sûr de vouloir supprimer cette carte ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => removeMutation.mutate(id) },
      ]
    );
  }
  
  function handleCancelSubscription() {
    Alert.alert(
      'Annuler l\'abonnement',
      'Êtes-vous sûr de vouloir annuler votre abonnement ? Vos annonces seront suspendues.',
      [
        { text: 'Non', style: 'cancel' },
        { text: 'Oui, annuler', style: 'destructive', onPress: () => cancelMutation.mutate() },
      ]
    );
  }

  const subscription = subQuery.data;
  const methods = methodsQuery.data ?? [];
  const history = historyQuery.data ?? [];
  const plans = plansQuery.data ?? [];
  
  return (
    <Screen scroll>
      <View style={s.container}>
        {subscription && (
          <View style={s.section}>
            <Text style={s.h2}>Abonnement actuel</Text>
            <View style={[s.card, s.subCard]}>
              <View style={s.cardRow}>
                <Crown size={24} color="#D97706" />
                <View style={s.subInfo}>
                  <Text style={s.subName}>
                    {plans.find(p => p.id === subscription.planId)?.name ?? 'Pro'}
                  </Text>
                  <Text style={s.subStatus}>
                    {subscription.status === 'active' ? 'Actif' : 'Inactif'}
                  </Text>
                  {subscription.renewsAt && (
                    <Text style={s.subMeta}>
                      Renouvellement: {new Date(subscription.renewsAt).toLocaleDateString('fr-FR')}
                    </Text>
                  )}
                </View>
              </View>
              {subscription.status === 'active' && (
                <Pressable 
                  style={s.cancelBtn} 
                  onPress={handleCancelSubscription}
                  disabled={cancelMutation.isPending}>
                  <Text style={s.cancelBtnText}>Annuler</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        
        {!subscription && plans.length > 0 && (
          <View style={s.section}>
            <Text style={s.h2}>Choisir un abonnement</Text>
            {plans.map(plan => (
              <View key={plan.id} style={s.planCard}>
                <View>
                  <Text style={s.planName}>{plan.name}</Text>
                  <Text style={s.planPrice}>
                    {plan.price.toLocaleString('fr-FR')} {plan.currency}/{plan.interval === 'month' ? 'mois' : 'an'}
                  </Text>
                  <View style={s.features}>
                    {plan.features.map((feat, i) => (
                      <Text key={i} style={s.feature}>• {feat}</Text>
                    ))}
                  </View>
                </View>
                <Pressable style={s.subscribeBtn}>
                  <Text style={s.subscribeBtnText}>S&apos;abonner</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
        
        <View style={s.section}>
          <Text style={s.h2}>Moyens de paiement</Text>
          {methods.map(c => (
            <View key={c.id} style={s.card}>
              <View style={s.cardRow}>
                <CreditCard size={20} color="#163E2E" />
                <Text style={s.cardTxt}>{c.brand} •••• {c.last4} — {c.exp}</Text>
              </View>
              <View style={s.cardActions}>
                {!c.isDefault && (
                  <Pressable onPress={() => handleSetDefault(c.id)}>
                    <Text style={s.linkText}>Définir par défaut</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => handleRemove(c.id)}>
                  <Trash2 size={18} color="#EF4444" />
                </Pressable>
                {c.isDefault && <CheckCircle2 size={20} color="#059669" />}
              </View>
            </View>
          ))}

          <Pressable style={s.addBtn} onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}>
            <Plus size={20} color="#163E2E" />
            <Text style={s.addTxt}>Ajouter une carte</Text>
          </Pressable>
        </View>

        <View style={s.section}>
          <Text style={s.h2}>Historique</Text>
          {history.map(item => (
            <View key={item.id} style={s.txRow}>
              <Receipt size={20} color="#6B7280" />
              <View style={s.txContent}>
                <Text style={s.txLabel}>{item.description}</Text>
                <Text style={s.txMeta}>{item.date}</Text>
              </View>
              <Text style={s.txAmount}>{item.amount.toLocaleString('fr-FR')} {item.currency}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  container: { padding: 16 },
  section: { marginBottom: 32 },
  h2: { fontSize: 18, fontWeight: "700" as const, marginBottom: 12, color: '#111' },
  card: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#fff", marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  subCard: { padding: 16 },
  subInfo: { flex: 1 },
  subName: { fontSize: 16, fontWeight: "700" as const, color: '#111' },
  subStatus: { fontSize: 14, color: '#059669', marginTop: 4 },
  subMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FEE2E2' },
  cancelBtnText: { fontSize: 14, fontWeight: "600" as const, color: '#DC2626' },
  planCard: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#fff", marginBottom: 12 },
  planName: { fontSize: 18, fontWeight: "700" as const, color: '#111' },
  planPrice: { fontSize: 16, fontWeight: "600" as const, color: '#163E2E', marginTop: 4 },
  features: { marginTop: 12, gap: 6 },
  feature: { fontSize: 14, color: '#6B7280' },
  subscribeBtn: { marginTop: 16, paddingVertical: 12, borderRadius: 10, backgroundColor: '#163E2E', alignItems: 'center' },
  subscribeBtnText: { fontSize: 16, fontWeight: "600" as const, color: '#FFFFFF' },
  cardTxt: { fontWeight: "600" as const, fontSize: 14, color: '#111' },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardActions: { flexDirection: "row", gap: 14, alignItems: 'center' },
  linkText: { color: "#059669", fontWeight: "600" as const, fontSize: 14 },
  addBtn: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, backgroundColor: "#F9FAFB" },
  addTxt: { fontWeight: "700" as const, fontSize: 14, color: '#111' },
  txRow: { marginBottom: 10, padding: 12, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", flexDirection: "row", alignItems: "center", gap: 12 },
  txLabel: { fontWeight: "600" as const, fontSize: 14, color: '#111' },
  txMeta: { color: "#6b7280", marginTop: 2, fontSize: 12 },
  txAmount: { fontWeight: "700" as const, fontSize: 14, color: '#111' },
  txContent: { flex: 1 },
});