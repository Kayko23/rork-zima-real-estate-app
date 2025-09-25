import { useCallback, useEffect, useRef, useState } from "react";
import { HotelsAPI, type Hotel, type HotelQuery } from "@/lib/hotels-api";

const MOCKS: Hotel[] = [
  {
    id: "demo_1",
    title: "Studio cosy proche plage",
    city: "Dakar",
    country: "Sénégal",
    price_per_night: 45000,
    rating: 4.8,
    reviews: 67,
    badge: "Top",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format",
  },
  {
    id: "demo_2",
    title: "Chambre Deluxe – Plateau",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    price_per_night: 75000,
    rating: 4.6,
    reviews: 120,
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=1200&auto=format",
  },
  {
    id: "demo_3",
    title: "Villa avec piscine privée",
    city: "Dakar",
    country: "Sénégal",
    price_per_night: 120000,
    rating: 4.9,
    reviews: 34,
    image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format",
  },
];

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
        console.warn("Hotels popular failed, using MOCKS", e?.message);
        if (!mounted.current) return;
        setErr(e?.message ?? "Erreur réseau");
        setPage(1);
        setTotal(1);
        setItems((prev) => (replace ? MOCKS : [...prev, ...MOCKS]));
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
        console.warn("Hotels recommended failed, using MOCKS", e?.message);
        setErr(e?.message ?? "Erreur réseau");
        setPage(1);
        setTotal(1);
        setItems((prev) => (replace ? MOCKS : [...prev, ...MOCKS]));
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
