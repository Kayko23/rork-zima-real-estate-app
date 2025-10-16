export const fmtMoney = (n: number, cur: string = 'FCFA'): string => {
  return `${new Intl.NumberFormat('fr-FR').format(n)} ${cur}`;
};
