import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { CreditCard, Plus, Receipt, Trash2, CheckCircle2 } from "lucide-react-native";

type Card = { id: string; brand: string; last4: string; exp: string; isDefault?: boolean };
const demoCards: Card[] = [
  { id: "1", brand: "Visa", last4: "4242", exp: "04/28", isDefault: true },
  { id: "2", brand: "Mastercard", last4: "1881", exp: "11/27" },
];

const demoTx = [
  { id: "t1", label: "Boost annonce #A-3291", amount: "5 000 FCFA", date: "12/09/2025" },
  { id: "t2", label: "Abonnement Pro (mois)", amount: "15 000 FCFA", date: "01/09/2025" },
];

export default function PaymentsScreen() {
  const [cards, setCards] = useState(demoCards);

  function setDefault(id: string) {
    setCards(prev => prev.map(c => ({...c, isDefault: c.id === id})));
  }
  function remove(id: string) {
    setCards(prev => prev.filter(c => c.id !== id));
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View style={s.container}>
          <Text style={s.h2}>Moyens de paiement</Text>
          {cards.map(c => (
            <View key={c.id} style={s.card}>
              <View style={s.cardRow}>
                <CreditCard />
                <Text style={s.cardTxt}>{c.brand} •••• {c.last4} — {c.exp}</Text>
              </View>
              <View style={s.cardActions}>
                {!c.isDefault && (
                  <Pressable onPress={() => setDefault(c.id)}>
                    <Text style={s.linkText}>Définir par défaut</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => remove(c.id)}>
                  <Trash2 size={18} />
                </Pressable>
                {c.isDefault && <CheckCircle2 color="#059669" />}
              </View>
            </View>
          ))}

          <Pressable style={s.addBtn} onPress={() => {/* ouvrir ta modale d'ajout de carte */}}>
            <Plus />
            <Text style={s.addTxt}>Ajouter une carte</Text>
          </Pressable>

          <Text style={[s.h2, s.historyTitle]}>Historique</Text>
        </View>
      }
      data={demoTx}
      keyExtractor={(i) => i.id}
      renderItem={({item}) => (
        <View style={s.txRow}>
          <Receipt />
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
  h2: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  card: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#fff", marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTxt: { fontWeight: "600" },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardActions: { flexDirection: "row", gap: 14 },
  linkText: { color: "#059669", fontWeight: "600" },
  addBtn: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, backgroundColor: "#F9FAFB" },
  addTxt: { fontWeight: "700" },
  txRow: { marginHorizontal: 16, marginBottom: 10, padding: 12, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", flexDirection: "row", alignItems: "center", gap: 12 },
  txLabel: { fontWeight: "600" },
  txMeta: { color: "#6b7280", marginTop: 2 },
  txAmount: { fontWeight: "800" },
  txContent: { flex: 1 },
  historyTitle: { marginTop: 24 },
  contentContainer: { paddingBottom: 24 },
});