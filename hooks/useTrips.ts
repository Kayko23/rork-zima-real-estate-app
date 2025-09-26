import { useCallback, useEffect, useRef, useState } from "react";
import type { TripItem } from "@/components/voyages/helpers";

const API = process.env.EXPO_PUBLIC_TRIPS_API || "https://example.com/api";

export function useTrips(kind: "popular" | "recommended" | "all") {
  const [items, setItems] = useState<TripItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const once = useRef(false);

  const query = new URLSearchParams({ page: String(page), kind }).toString();

  const fetchPage = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/trips?${query}`).then(r => r.json());
      setItems(prev => [...prev, ...(r.items as TripItem[])]);
      setHasMore((r.items as TripItem[])?.length > 0);
    } catch {
      const img = (n:number)=>({ uri:`https://picsum.photos/seed/v${kind}${page}${n}/800/600` });
      const seed: TripItem[] = Array.from({length:6}).map((_,i)=>({
        id:`${kind}-${page}-${i}`, title:`Suite ${i+1}`, city:"Abidjan", country:"Côte d'Ivoire",
        price:75000 + i*5000, currency: "XOF", rating:4.6, reviews:120+i, image:img(i), type: i%2? "hotel":"daily"
      }));
      setItems(prev => [...prev, ...seed]);
      setHasMore(page < 4);
    } finally {
      setLoading(false);
    }
  }, [query, hasMore, loading, page, kind]);

  useEffect(()=>{
    if (once.current){ setItems([]); setPage(1); setHasMore(true); }
    once.current = true;
  }, [kind]);

  useEffect(()=>{ fetchPage(); }, [page, fetchPage]);

  const loadMore = () => hasMore && !loading && setPage(p=>p+1);

  return { items, loading, hasMore, loadMore, refresh: ()=>{ setItems([]); setPage(1); setHasMore(true); } };
}