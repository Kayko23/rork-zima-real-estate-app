# Implémentation Zone CFA - ZIMA

## Vue d'ensemble

ZIMA est maintenant restreint aux pays de la zone CFA (UEMOA + CEMAC) avec monnaies unifiées XOF et XAF.

## Pays supportés

### UEMOA (XOF - Franc CFA Ouest-Africain)
- 🇧🇯 Bénin (BJ)
- 🇧🇫 Burkina Faso (BF)
- 🇨🇮 Côte d'Ivoire (CI)
- 🇬🇼 Guinée-Bissau (GW)
- 🇲🇱 Mali (ML)
- 🇳🇪 Niger (NE)
- 🇸🇳 Sénégal (SN) - **Pays par défaut**
- 🇹🇬 Togo (TG)

### CEMAC (XAF - Franc CFA d'Afrique Centrale)
- 🇨🇲 Cameroun (CM)
- 🇨🇫 République centrafricaine (CF)
- 🇹🇩 Tchad (TD)
- 🇨🇬 Congo (CG)
- 🇬🇶 Guinée équatoriale (GQ)
- 🇬🇦 Gabon (GA)

## Fichiers créés/modifiés

### Nouveaux fichiers
1. **`constants/cfa.ts`** - Configuration centrale zone CFA
   - Types `CurrencyCode` et `CfaCountryCode`
   - Mapping pays → devise → zone
   - Fonctions utilitaires

2. **`utils/price.ts`** - Formatage prix CFA
   - `formatCfa()` - Format complet avec séparateurs
   - `formatCfaShort()` - Format court (k, M, Md)
   - `parseCfaAmount()` - Parse string → number

3. **`components/inputs/CfaCountryPicker.tsx`** - Sélecteur pays CFA
   - Liste filtrée aux pays CFA uniquement
   - Affichage zone (UEMOA/CEMAC) et devise
   - Recherche par nom

### Fichiers modifiés
1. **`hooks/useSettings.ts`**
   - Ajout `allowedCountries` et `defaultCountry`
   - Restriction automatique aux pays CFA

2. **`components/CityPicker.tsx`**
   - Vérification `isCfaCountry()` avant chargement
   - Empêche sélection villes hors zone

3. **`utils/mobileMoney.ts`**
   - Refonte avec codes pays (BJ, SN, etc.)
   - Mapping opérateurs par code pays
   - Types `MobileMoneyCharge` avec `CfaCountryCode`

4. **`types/index.ts`**
   - `PaymentMethod.country` → `countryCode`

5. **`app/profile/add-mobile-money.tsx`**
   - Utilisation `CfaCountryPicker`
   - Devise auto selon pays
   - Opérateurs filtrés par pays

## Utilisation

### Format prix
```typescript
import { formatCfa } from '@/utils/price';

formatCfa(125000, 'XOF');  // "125 000 F CFA"
formatCfa(250000, 'XAF');  // "250 000 F CFA"
```

### Sélection pays
```typescript
import { useSettings } from '@/hooks/useSettings';

const { allowedCountries, defaultCountry } = useSettings();
// allowedCountries = ['BJ', 'BF', 'CI', ...]
// defaultCountry = 'SN'
```

### Vérification pays CFA
```typescript
import { isCfaCountry, getCfaCurrencyForCountry } from '@/constants/cfa';

if (isCfaCountry('SN')) {
  const currency = getCfaCurrencyForCountry('SN'); // 'XOF'
}
```

### Mobile Money par pays
```typescript
import { providersForCountry } from '@/utils/mobileMoney';

const providers = providersForCountry('SN'); // ['orange', 'wave']
const providers = providersForCountry('CI'); // ['orange', 'mtn', 'moov', 'wave']
```

## Opérateurs Mobile Money par pays

| Pays | Orange | MTN | Moov | Wave |
|------|--------|-----|------|------|
| SN   | ✅     | ❌  | ❌   | ✅   |
| CI   | ✅     | ✅  | ✅   | ✅   |
| BJ   | ❌     | ✅  | ✅   | ❌   |
| TG   | ❌     | ✅  | ✅   | ❌   |
| ML   | ✅     | ❌  | ✅   | ❌   |
| BF   | ✅     | ❌  | ✅   | ❌   |
| NE   | ❌     | ✅  | ✅   | ❌   |
| GW   | ✅     | ❌  | ❌   | ❌   |
| CM   | ✅     | ✅  | ❌   | ❌   |
| GA   | ❌     | ✅  | ✅   | ❌   |
| CG   | ❌     | ✅  | ✅   | ❌   |
| TD   | ❌     | ❌  | ✅   | ❌   |
| CF   | ✅     | ❌  | ❌   | ❌   |
| GQ   | ❌     | ✅  | ❌   | ❌   |

## Roadmap Phase 2 (Extension)

Pour débloquer les pays anglophones :

1. **Ajouter devises**
   ```typescript
   // constants/cfa.ts
   export type CurrencyCode = 'XOF' | 'XAF' | 'NGN' | 'GHS' | 'GMD';
   ```

2. **Étendre pays autorisés**
   ```typescript
   export const ALLOWED_COUNTRY_CODES = [
     ...CFA_CODES,
     'NG', 'GH', 'GM', // Feature flag
   ];
   ```

3. **Ajouter opérateurs**
   - Nigeria: MTN, Airtel, 9mobile
   - Ghana: MTN, Vodafone Cash, AirtelTigo

4. **Taux de change**
   - Intégrer API FX (déjà préparé dans `lib/bootstrapFx.ts`)
   - Conversion XOF ↔ NGN ↔ GHS

## Avantages de cette approche

✅ **Simplicité** - Une seule zone monétaire (CFA)  
✅ **Pas de conversion** - XOF/XAF fixes (1:1)  
✅ **UX cohérente** - Format prix uniforme  
✅ **Paiements locaux** - Mobile Money natif  
✅ **Extensible** - Prêt pour phase 2  
✅ **Type-safe** - TypeScript strict sur codes pays  

## Notes importantes

- **Codes pays ISO 3166-1 alpha-2** (BJ, SN, CI, etc.)
- **Pas de conversion XOF ↔ XAF** (taux fixe 1:1)
- **Validation MSISDN** simplifiée (8-12 chiffres)
- **Devise auto** selon pays sélectionné
- **Filtres** restreints aux pays CFA dans toute l'app
