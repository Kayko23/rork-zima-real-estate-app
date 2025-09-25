import { useEffect, useMemo, useState, useCallback } from "react";
import type { VoyageQuery, VoyageFilters, TripItem } from "@/components/voyages/helpers";

const API = process.env.EXPO_PUBLIC_TRIPS_API || "https://example.com/api";

type Paged = { items: TripItem[]; page: number; hasMore: boolean };

export function useVoyageApi({ query, filters }:{ query:VoyageQuery; filters:VoyageFilters }) {
  const [popular, setPopular] = useState<Paged>({ items:[], page:1, hasMore:true });
  const [recommended, setRecommended] = useState<Paged>({ items:[], page:1, hasMore:true });
  const [daily, setDaily] = useState<Paged>({ items:[], page:1, hasMore:true });

  const [isLoading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setRefreshing] = useState<boolean>(false);

  const params = useMemo(()=>({
    country: query.country?.value, city: query.city?.value,
    startDate: query.startDate ?? undefined, endDate: query.endDate ?? undefined,
    guests: String(query.guests ?? 1),
    priceMin: String(filters.priceMin), priceMax: String(filters.priceMax),
    ratingMin: String(filters.ratingMin), premiumOnly: filters.premiumOnly ? "1" : "0"
  }), [query, filters]);

  const build = (base:string, page:number)=> {
    const qp = new URLSearchParams();
    Object.entries({ ...params, page: String(page) }).forEach(([k,v])=>{
      if (v != null && String(v).length > 0) qp.append(k, String(v));
    });
    return `${API}${base}?${qp.toString()}`;
  };

  const fetchAll = useCallback(async ()=>{
    setLoading(true);
    try {
      const [a,b,c] = await Promise.all([
        fetch(build("/trips/popular",1)),
        fetch(build("/trips/recommended",1)),
        fetch(build("/trips/daily",1))
      ]);
      const [pa, pb, pc] = await Promise.all([a.json(), b.json(), c.json()]);
      setPopular({ items: (pa.items||[]), page:1, hasMore: !!pa.hasMore });
      setRecommended({ items: (pb.items||[]), page:1, hasMore: !!pb.hasMore });
      setDaily({ items: (pc.items||[]), page:1, hasMore: !!pc.hasMore });
    } catch(e) {
      setPopular(demo("popular"));
      setRecommended(demo("recommended"));
      setDaily(demo("daily"));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(()=>{ fetchAll(); }, [fetchAll]);

  const refetch = useCallback(async ()=>{
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }, [fetchAll]);

  const fetchNextPopular = async ()=>{
    if (!popular.hasMore || isLoading) return;
    const next = popular.page + 1;
    const res = await fetch(build("/trips/popular", next)).then(r=>r.json()).catch(()=>({items:[],hasMore:false}));
    setPopular(p=>({ items:[...p.items,...(res.items||[])], page:next, hasMore:!!res.hasMore }));
  };
  const fetchNextRecommended = async ()=>{
    if (!recommended.hasMore || isLoading) return;
    const next = recommended.page + 1;
    const res = await fetch(build("/trips/recommended", next)).then(r=>r.json()).catch(()=>({items:[],hasMore:false}));
    setRecommended(p=>({ items:[...p.items,...(res.items||[])], page:next, hasMore:!!res.hasMore }));
  };

  return { popular, recommended, daily, isLoading, isRefreshing, refetch, fetchNextPopular, fetchNextRecommended };
}

function demo(kind:"popular"|"recommended"|"daily"):{
  items: TripItem[]; page:number; hasMore:boolean
}{
  const img = (id:number)=>({ uri:`https://picsum.photos/seed/voyage${id}/800/600` });
  const base: TripItem[] = [
    { id:"1", title:"Studio cosy proche plage", city:"Dakar", country:"Sénégal", price:45000, rating:4.8, reviews:67, badge:"Top", image:img(1), type:"hotel" },
    { id:"2", title:"Chambre Deluxe - Hotel Ivoire", city:"Abidjan", country:"Côte d'Ivoire", price:75000, rating:4.6, reviews:120, badge:"Premium", image:img(2), type:"hotel" },
    { id:"3", title:"Suite Executive - Ouaga", city:"Ouagadougou", country:"Burkina Faso", price:85000, rating:4.7, reviews:156, image:img(3), type:"hotel" },
    { id:"4", title:"Résidence meublée centre-ville", city:"Accra", country:"Ghana", price:60000, rating:4.5, reviews:89, image:img(4), type:"daily" }
  ];
  return { items: base, page:1, hasMore:false };
}