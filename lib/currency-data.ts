export type CurrencyItem = { 
  code: string; 
  name: string; 
  symbol: string; 
  locales?: string[] 
};

export const CURRENCIES: CurrencyItem[] = [
  { 
    code: "XOF", 
    name: "Franc CFA (UEMOA)", 
    symbol: "CFA", 
    locales: ["fr-SN","fr-CI","fr-BF","fr-ML","fr-BJ","fr-TG","fr-NE","fr-GW"] 
  },
  { 
    code: "XAF", 
    name: "Franc CFA (CEMAC)", 
    symbol: "FCFA", 
    locales: ["fr-CM","fr-GA","fr-CF","fr-CG","fr-GQ","fr-TD"] 
  },
  { 
    code: "NGN", 
    name: "Naira", 
    symbol: "₦", 
    locales: ["en-NG"] 
  },
  { 
    code: "GHS", 
    name: "Cedi", 
    symbol: "₵", 
    locales: ["en-GH"] 
  },
  { 
    code: "ZAR", 
    name: "Rand", 
    symbol: "R", 
    locales: ["en-ZA"] 
  },
  { 
    code: "USD", 
    name: "Dollar US", 
    symbol: "$", 
    locales: ["en-US"] 
  },
  { 
    code: "EUR", 
    name: "Euro", 
    symbol: "€", 
    locales: ["fr-FR"] 
  },
];

export const COUNTRY_TO_CURRENCY: Record<string,string> = {
  SN:"XOF", CI:"XOF", BF:"XOF", ML:"XOF", BJ:"XOF", TG:"XOF", NE:"XOF", GW:"XOF",
  CM:"XAF", GA:"XAF", CF:"XAF", CG:"XAF", GQ:"XAF", TD:"XAF",
  NG:"NGN", GH:"GHS", ZA:"ZAR", US:"USD", FR:"EUR",
};