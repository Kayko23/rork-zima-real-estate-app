# Intégration Mobile Money - ZIMA

## 📱 Fonctionnalités ajoutées

### 1. **Moyens de paiement Mobile Money**
- ✅ Orange Money
- ✅ MTN MoMo
- ✅ Moov Money
- ✅ Wave

### 2. **Gestion des devises par pays**
- **XOF** : Bénin, Burkina Faso, Côte d'Ivoire, Guinée-Bissau, Mali, Niger, Sénégal, Togo
- **XAF** : Cameroun, Congo, Gabon, Tchad, RCA, Guinée Équatoriale
- **GHS** : Ghana
- **NGN** : Nigeria

### 3. **Fonctionnalités principales**

#### Ajout de Mobile Money
- Sélection du pays (détection automatique de la devise)
- Choix de l'opérateur (Orange, MTN, Moov, Wave)
- Validation du numéro de téléphone selon le pays
- Nom du compte (optionnel)
- Persistance dans AsyncStorage

#### Gestion des moyens de paiement
- Affichage de tous les moyens de paiement (cartes + Mobile Money)
- Définir un moyen de paiement par défaut
- Supprimer un moyen de paiement
- Icônes différenciées (carte vs smartphone)

#### Abonnements
- **Pro Mensuel** : 15 000 FCFA/mois
- **Pro Annuel** : 150 000 FCFA/an
- Paiement via Mobile Money (simulation STK push)
- Paiement via carte bancaire
- Annulation d'abonnement

### 4. **Désindexation automatique**
Quand un prestataire annule son abonnement (`plan: 'none'`), ses biens sont automatiquement masqués dans :
- Accueil
- Liste des biens
- Favoris
- Recherche
- Voyages

Les biens restent visibles dans "Mes annonces" avec un badge "Non visible".

## 🗂️ Fichiers créés/modifiés

### Nouveaux fichiers
```
types/index.ts                      # Types PaymentMethod, MobileMoneyProvider
utils/mobileMoney.ts                # Utilitaires Mobile Money
utils/visibility.ts                 # Règles de visibilité des biens
app/profile/add-mobile-money.tsx    # Écran d'ajout Mobile Money
```

### Fichiers modifiés
```
hooks/useAppStore.ts                # Store étendu avec Mobile Money
app/profile/payments.tsx            # Écran Paiements mis à jour
```

## 🔧 Utilisation

### Ajouter un moyen de paiement Mobile Money

```typescript
import { useApp } from '@/hooks/useAppStore';

const { addPaymentMethod } = useApp();

await addPaymentMethod({
  id: `mm_${Date.now()}`,
  type: 'mobile_money',
  provider: 'orange',
  country: 'Sénégal',
  phone: '770000000',
  accountName: 'Mon compte Orange',
  currency: 'XOF',
  isDefault: false,
});
```

### Souscrire à un abonnement

```typescript
const { subscribeWithDefault } = useApp();

const result = await subscribeWithDefault('pro-monthly');
if (result.ok) {
  Alert.alert('Succès', result.msg);
} else {
  Alert.alert('Erreur', result.msg);
}
```

### Vérifier la visibilité d'un bien

```typescript
import { shouldShowPropertyInPublic } from '@/utils/visibility';

const isVisible = shouldShowPropertyInPublic({
  status: property.status,
  ownerPlan: property.ownerPlan,
});
```

## 🎨 Interface utilisateur

### Écran Paiements (`/profile/payments`)
- Liste des moyens de paiement avec icônes différenciées
- Badge "Par défaut" sur le moyen de paiement actif
- Bouton "Ajouter Mobile Money"
- Section Abonnement avec plans disponibles
- Bouton "Annuler l'abonnement" (si actif)
- Historique des transactions

### Écran Ajout Mobile Money (`/profile/add-mobile-money`)
- Sélection du pays (chips horizontales)
- Sélection de l'opérateur (grille 2 colonnes)
- Champ téléphone avec validation
- Champ titulaire (optionnel)
- Affichage de la devise détectée
- Bouton "Enregistrer"

## 🔐 Sécurité

- Validation du format de numéro selon le pays
- Persistance sécurisée dans AsyncStorage
- Simulation de paiement (85% succès, 15% échec)
- Gestion des erreurs avec messages utilisateur

## 🚀 Prochaines étapes

Pour intégrer avec un vrai backend :

1. **Remplacer la simulation** dans `utils/mobileMoney.ts` :
```typescript
export async function startMobileMoneyCharge(payload: MobileMoneyCharge) {
  const response = await fetch('https://api.zima.com/payments/mobile-money', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await response.json();
}
```

2. **Ajouter l'API de vérification** du numéro :
```typescript
export async function verifyMobileMoneyAccount(country: string, phone: string, provider: string) {
  // Appel API pour vérifier que le compte existe
}
```

3. **Webhooks** pour les notifications de paiement :
```typescript
// Backend : POST /webhooks/mobile-money
// Mettre à jour le statut de l'abonnement en temps réel
```

## 📊 État de l'abonnement

```typescript
type Plan = 'pro-monthly' | 'pro-yearly' | 'none';

type SubscriptionState = {
  plan: Plan;
  nextBillingAt?: string | null;
  paymentMethods: PaymentMethod[];
};
```

- `plan: 'none'` → Biens masqués publiquement
- `plan: 'pro-monthly'` ou `'pro-yearly'` → Biens visibles
- `nextBillingAt` → Date de prochaine facturation

## 🎯 Règles métier

1. **Premier moyen de paiement** → Automatiquement défini par défaut
2. **Suppression du moyen par défaut** → Le premier de la liste devient défaut
3. **Abonnement sans moyen de paiement** → Erreur "Aucun moyen de paiement par défaut"
4. **Annulation d'abonnement** → Désindexation immédiate des biens
5. **Validation du numéro** → Selon le pays (8-11 chiffres)

## 🌍 Support multi-pays

Le système détecte automatiquement la devise selon le pays :
- Pays UEMOA → XOF
- Pays CEMAC → XAF
- Ghana → GHS
- Nigeria → NGN

## 💡 Notes importantes

- Les moyens de paiement sont persistés dans AsyncStorage
- Compatible web et mobile (cross-platform)
- Pas de dépendances externes supplémentaires
- Simulation de paiement pour le développement
- Prêt pour l'intégration backend

---

**Développé pour ZIMA** - Plateforme immobilière panafricaine
