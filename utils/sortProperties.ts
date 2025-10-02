export function sortPremiumFirst<T extends { isPremium?: boolean; createdAt?: string | number }>(list: T[]): T[] {
  try {
    const toTs = (v: string | number | undefined) => {
      if (v == null) return 0;
      if (typeof v === 'number') return v;
      const t = Date.parse(v);
      return Number.isFinite(t) ? t : 0;
    };
    const sorted = [...list].sort((a, b) => {
      const pa = a?.isPremium ? 1 : 0;
      const pb = b?.isPremium ? 1 : 0;
      if (pb !== pa) return pb - pa;
      const ta = toTs(a?.createdAt as any);
      const tb = toTs(b?.createdAt as any);
      return tb - ta;
    });
    return sorted;
  } catch (e) {
    console.log('[sortPremiumFirst] error', e);
    return list;
  }
}
