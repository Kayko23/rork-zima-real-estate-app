// devise vient du SettingsContext si tu l'as déjà (fallback en XOF)
export const formatPrice = (amount: number, currency: string = "XOF") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
