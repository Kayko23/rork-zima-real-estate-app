export type CurrencyItem = { 
  code: string; 
  name: string; 
  symbol: string; 
  locales?: string[];
  flag?: string;
};

export const CURRENCIES: CurrencyItem[] = [
  // Devises CFA (Afrique de l'Ouest)
  { 
    code: "XOF", 
    name: "Franc CFA (UEMOA)", 
    symbol: "CFA", 
    locales: ["fr-SN","fr-CI","fr-BF","fr-ML","fr-BJ","fr-TG","fr-NE","fr-GW"] 
  },
  // Devises CFA (Afrique Centrale)
  { 
    code: "XAF", 
    name: "Franc CFA (CEMAC)", 
    symbol: "FCFA", 
    locales: ["fr-CM","fr-GA","fr-CF","fr-CG","fr-GQ","fr-TD"] 
  },
  // Autres devises africaines
  { 
    code: "NGN", 
    name: "Naira nigérian", 
    symbol: "₦", 
    flag: "🇳🇬",
    locales: ["en-NG"] 
  },
  { 
    code: "GHS", 
    name: "Cedi ghanéen", 
    symbol: "₵", 
    flag: "🇬🇭",
    locales: ["en-GH"] 
  },
  { 
    code: "ZAR", 
    name: "Rand sud-africain", 
    symbol: "R", 
    flag: "🇿🇦",
    locales: ["en-ZA"] 
  },
  { 
    code: "KES", 
    name: "Shilling kenyan", 
    symbol: "KSh", 
    flag: "🇰🇪",
    locales: ["en-KE"] 
  },
  { 
    code: "UGX", 
    name: "Shilling ougandais", 
    symbol: "USh", 
    flag: "🇺🇬",
    locales: ["en-UG"] 
  },
  { 
    code: "TZS", 
    name: "Shilling tanzanien", 
    symbol: "TSh", 
    flag: "🇹🇿",
    locales: ["en-TZ"] 
  },
  { 
    code: "ETB", 
    name: "Birr éthiopien", 
    symbol: "Br", 
    flag: "🇪🇹",
    locales: ["am-ET"] 
  },
  { 
    code: "EGP", 
    name: "Livre égyptienne", 
    symbol: "£", 
    flag: "🇪🇬",
    locales: ["ar-EG"] 
  },
  { 
    code: "MAD", 
    name: "Dirham marocain", 
    symbol: "DH", 
    flag: "🇲🇦",
    locales: ["ar-MA", "fr-MA"] 
  },
  { 
    code: "TND", 
    name: "Dinar tunisien", 
    symbol: "د.ت", 
    flag: "🇹🇳",
    locales: ["ar-TN", "fr-TN"] 
  },
  { 
    code: "DZD", 
    name: "Dinar algérien", 
    symbol: "د.ج", 
    flag: "🇩🇿",
    locales: ["ar-DZ", "fr-DZ"] 
  },
  { 
    code: "RWF", 
    name: "Franc rwandais", 
    symbol: "RF", 
    flag: "🇷🇼",
    locales: ["rw-RW", "en-RW", "fr-RW"] 
  },
  { 
    code: "MUR", 
    name: "Roupie mauricienne", 
    symbol: "₨", 
    flag: "🇲🇺",
    locales: ["en-MU", "fr-MU"] 
  },
  { 
    code: "BWP", 
    name: "Pula botswanais", 
    symbol: "P", 
    flag: "🇧🇼",
    locales: ["en-BW"] 
  },
  // Devises internationales courantes
  { 
    code: "USD", 
    name: "Dollar américain", 
    symbol: "$", 
    flag: "🇺🇸",
    locales: ["en-US"] 
  },
  { 
    code: "EUR", 
    name: "Euro", 
    symbol: "€", 
    flag: "🇪🇺",
    locales: ["fr-FR","de-DE","es-ES","it-IT"] 
  },
];

export const COUNTRY_TO_CURRENCY: Record<string,string> = {
  // Afrique de l'Ouest (UEMOA)
  SN:"XOF", CI:"XOF", BF:"XOF", ML:"XOF", BJ:"XOF", TG:"XOF", NE:"XOF", GW:"XOF",
  // Afrique Centrale (CEMAC)
  CM:"XAF", GA:"XAF", CF:"XAF", CG:"XAF", GQ:"XAF", TD:"XAF",
  // Autres pays africains
  NG:"NGN", GH:"GHS", ZA:"ZAR", KE:"KES", UG:"UGX", TZ:"TZS", 
  ET:"ETB", EG:"EGP", MA:"MAD", TN:"TND", DZ:"DZD", RW:"RWF", 
  MU:"MUR", BW:"BWP",
  // Internationaux
  US:"USD", FR:"EUR", DE:"EUR", ES:"EUR", IT:"EUR",
};