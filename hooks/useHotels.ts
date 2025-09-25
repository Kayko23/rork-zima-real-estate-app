// hooks/useHotels.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { HotelsAPI, type Hotel, type HotelQuery } from "@/lib/hotels-api";

type Feed = {
  items: Hotel[];
  page: number;
  totalPages: number;
  loading: boolean;
  error?: string;
  refresh: () => void;
  loadMore: () => void;
  setQuery: (patch: Partial<HotelQuery>) => void;
  query: HotelQuery;
};

const initialQuery: HotelQuery = { page: 1, pageSize: 10, sort: "popular" };

export function usePopularHotels(seed: Partial<HotelQuery> = {}): Feed {
  const [query, setQueryState] = useState<HotelQuery>({ ...initialQuery, ...seed });
  const [items, setItems] = useState<Hotel[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotal] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string>();
  const mounted = useRef(true);

  const fetchPage = useCallback(
    async (p: number, replace = false) => {
      setLoading(true);
      setErr(undefined);
      try {
        const res = await HotelsAPI.listPopular({ ...query, page: p });
        if (!mounted.current) return;
        setPage(res.page);
        setTotal(res.totalPages);
        setItems((prev) => (replace ? res.data : [...prev, ...res.data]));
      } catch (e: any) {
        setErr(e?.message ?? "Erreur réseau");
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  return {
    items,
    page,
    totalPages,
    loading,
    error,
    query,
    setQuery: (patch) => setQueryState((q) => ({ ...q, ...patch })),
    refresh: () => fetchPage(1, true),
    loadMore: () => {
      if (page < totalPages && !loading) fetchPage(page + 1);
    },
  };
}

export function useRecommendedHotels(seed: Partial<HotelQuery> = {}): Feed {
  const [query, setQueryState] = useState<HotelQuery>({ ...initialQuery, sort: "recommended", ...seed });
  const [items, setItems] = useState<Hotel[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotal] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string>();

  const fetchPage = useCallback(
    async (p: number, replace = false) => {
      setLoading(true);
      setErr(undefined);
      try {
        const res = await HotelsAPI.listRecommended({ ...query, page: p });
        setPage(res.page);
        setTotal(res.totalPages);
        setItems((prev) => (replace ? res.data : [...prev, ...res.data]));
      } catch (e: any) {
        setErr(e?.message ?? "Erreur réseau");
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  return {
    items,
    page,
    totalPages,
    loading,
    error,
    query,
    setQuery: (patch) => setQueryState((q) => ({ ...q, ...patch })),
    refresh: () => fetchPage(1, true),
    loadMore: () => {
      if (page < totalPages && !loading) fetchPage(page + 1);
    },
  };
}
