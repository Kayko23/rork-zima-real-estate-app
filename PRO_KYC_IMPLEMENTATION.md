# Parcours d'onboarding prestataire (KYC) - ZIMA

## Vue d'ensemble

Implémentation complète d'un parcours de vérification KYC (Know Your Customer) pour les prestataires sur ZIMA, conforme aux exigences de la zone CFA.

## Architecture

### Types & Schémas

**`types/pro.ts`**
- `ProStatus`: États du profil pro (`none`, `draft`, `pending_review`, `verified`, `rejected`)
- `ProKyc`: Interface complète des données KYC
- `ProKycDraft`: Version partielle pour le brouillon

**`lib/proKycSchema.ts`**
- Validation Zod complète avec messages en français
- Règles métier (ex: nom commercial obligatoire pour agences)
- Validation des téléphones (au moins WhatsApp ou mobile)

### Composants

#### Upload de fichiers
- **`FileUploadInput`**: Upload depuis galerie avec preview
- **`SelfieInput`**: Capture photo caméra frontale
- **`AvatarInput`**: Upload photo de profil circulaire

#### Étapes du wizard
1. **`Step1Identity`**: Identité légale, adresse, pièce d'identité
2. **`Step2Contact`**: Email, téléphones, site web
3. **`Step3Documents`**: Upload pièce (recto/verso), selfie, avatar
4. **`Step4Profile`**: Catégorie, bio, zones d'intervention, langues
5. **`Step5Review`**: Récapitulatif et consentement CGU

### Écrans

**`app/pro/onboarding.tsx`**
- Wizard multi-étapes avec stepper visuel
- Auto-save du brouillon dans AsyncStorage
- Navigation entre étapes
- Soumission finale mockée

**`app/pro/status.tsx`**
- Affichage du statut de vérification
- Timeline pour `pending_review`
- Actions contextuelles selon le statut

**`app/profile/switch-mode.tsx`**
- Point d'entrée vers le wizard KYC
- Présentation des avantages prestataire

### Gardes de publication

**`lib/proGuards.ts`**
- `assertCanPublish()`: Vérifie le statut avant publication
- `PublicationGuardError`: Exception custom avec action suggérée
- Messages d'erreur contextuels

**`components/pro/PublicationGuardModal.tsx`**
- Modal d'alerte avec CTA vers l'action requise
- Design cohérent avec le reste de l'app

## Flux utilisateur

### 1. Démarrage
```
Profil → "Passer en mode prestataire" → /pro/onboarding
```

### 2. Parcours KYC (5 étapes)
- Chaque étape auto-sauvegardée
- Possibilité de reprendre plus tard
- Validation inline avec messages d'erreur

### 3. Soumission
```
Step 5 → Accepter CGU → Soumettre → /pro/status?status=pending_review
```

### 4. États post-soumission

#### `pending_review`
- Timeline de progression
- Message "Sous 24-48h"
- CTA: "Retour au profil"

#### `verified`
- Badge vérifié
- CTA: "Accéder au tableau de bord"
- Déblocage des fonctionnalités pro

#### `rejected`
- Affichage du motif
- CTA: "Corriger et renvoyer"
- Retour au wizard avec données pré-remplies

## Intégration dans l'app

### Exemple: Garde de publication

```typescript
import { assertCanPublish, PublicationGuardError } from '@/lib/proGuards';
import { PublicationGuardModal } from '@/components/pro/PublicationGuardModal';

// Dans votre composant
const [guardModal, setGuardModal] = useState({ visible: false, message: '' });
const proStatus: ProStatus = 'verified'; // À récupérer du contexte user

const createMutation = useMutation({
  mutationFn: async () => {
    try {
      assertCanPublish(proStatus, hasAllDocs);
    } catch (error) {
      if (error instanceof PublicationGuardError) {
        setGuardModal({
          visible: true,
          message: error.message,
          action: error.action,
        });
        throw error;
      }
    }
    // ... logique de création
  },
  onError: (e) => {
    if (!(e instanceof PublicationGuardError)) {
      Alert.alert('Erreur', e.message);
    }
  }
});

// Dans le render
<PublicationGuardModal
  visible={guardModal.visible}
  onClose={() => setGuardModal({ visible: false, message: '' })}
  message={guardModal.message}
  action={guardModal.action}
/>
```

## Données persistées

### AsyncStorage
- **Clé**: `@zima.pro.kyc.draft`
- **Contenu**: Brouillon complet + `currentStep`
- **Suppression**: Après soumission réussie

### À implémenter (backend)
- Upload réel des images (actuellement mock)
- API POST `/api/pro/kyc` pour soumission
- Webhook de validation manuelle
- Stockage sécurisé des documents

## Sécurité & Conformité

### Validations
- Formats d'images: PNG/JPG uniquement
- Taille max: 10 Mo (à implémenter)
- Regex téléphone: international
- Email: validation standard

### RGPD
- Message d'usage des documents
- Consentement explicite CGU
- Droit à l'effacement (à implémenter backend)

### Zone CFA
- Pays limités à `ALLOWED_COUNTRY_CODES`
- Devises: XOF/XAF uniquement
- Nationalités: pays CFA prioritaires

## Extensions futures

### Phase 2
- OCR automatique de la pièce
- Face-match selfie/pièce (SDK tiers)
- Signature électronique
- Vérification en temps réel (API tierce)

### Phase 3
- KYC différencié par pays
- Documents supplémentaires selon activité
- Renouvellement périodique
- Historique des vérifications

## Tests

### Scénarios à tester
1. ✅ Parcours complet sans interruption
2. ✅ Sauvegarde/reprise du brouillon
3. ✅ Validation des champs obligatoires
4. ✅ Upload de documents
5. ✅ Garde de publication (tous statuts)
6. ✅ Navigation entre étapes
7. ⚠️ Gestion des erreurs réseau (à implémenter)
8. ⚠️ Upload de fichiers volumineux (à implémenter)

## Notes d'implémentation

### Choix techniques
- **React Hook Form**: Gestion de formulaire performante
- **Zod**: Validation typée et messages personnalisés
- **AsyncStorage**: Persistance locale du brouillon
- **Expo Image Picker**: Upload cross-platform

### Limitations actuelles
- Pas de backend réel (mock)
- Pas de compression d'images
- Pas de retry automatique
- Statut pro hardcodé dans les exemples

### À faire
- [ ] Intégrer au contexte user global
- [ ] Implémenter l'API backend
- [ ] Ajouter compression d'images
- [ ] Tests unitaires des validations
- [ ] Tests E2E du parcours complet
- [ ] Analytics des abandons par étape
