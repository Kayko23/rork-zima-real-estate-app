// hooks/useAllFeed.ts
import { useCallback, useEffect, useState } from 'react';
import { listAll, type AllItem, type AllQuery } from '@/lib/all-api';

export function useAllFeed(seed: Partial<AllQuery> = {}) {
  const [query, setQuery] = useState<AllQuery>({ page: 1, pageSize: 12, ...seed });
  const [items, setItems] = useState<AllItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotal] = useState(1);

  const fetchPage = useCallback(async (p: number, replace = false) => {
    setLoading(true);
    setErr(undefined);
    try {
      const res = await listAll({ ...query, page: p });
      setPage(res.page);
      setTotal(res.totalPages);
      setItems((prev) => (replace ? res.data : [...prev, ...res.data]));
    } catch (e: any) {
      setErr(e?.message ?? 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { fetchPage(1, true); }, [fetchPage]);

  return {
    items, loading, error, page, totalPages,
    query,
    setQuery: (patch: Partial<AllQuery>) => setQuery((q) => ({ ...q, ...patch })),
    refresh: () => fetchPage(1, true),
    loadMore: () => { if (!loading && page < totalPages) fetchPage(page + 1); },
  };
}
