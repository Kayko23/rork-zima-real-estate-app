import { useEffect, useState } from "react";
import type { TripDetail, TripItem } from "@/components/voyages/helpers";

const API = process.env.EXPO_PUBLIC_TRIPS_API || "https://example.com/api";

export function useTripDetails(id?:string) {
  const [data, setData] = useState<TripDetail | null>(null);
  const [similar, setSimilar] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let cancelled = false;
    async function run(){
      setLoading(true);
      try {
        if (!id) throw new Error("no id");
        const r = await fetch(`${API}/trips/${id}`).then(r=>r.json());
        const s = await fetch(`${API}/trips/${id}/similar`).then(r=>r.json());
        if (!cancelled){
          setData(r as TripDetail);
          setSimilar((s.items || []) as TripItem[]);
        }
      } catch {
        if (!cancelled) {
          const img = (n:number)=>({ uri:`https://picsum.photos/seed/trip${n}/800/600` });
          setData({
            id:id||"1",
            type:"hotel",
            title:"Appartement Moderne au Centre-ville de Dakar",
            city:"Dakar", country:"Sénégal",
            price:125000, rating:4.8, reviews:23,
            description:"Magnifique villa moderne avec vue imprenable sur la ville. Finitions de haute qualité, emplacement premium.",
            photos:[img(11),img(12),img(13)],
            address:"Plateau, Dakar",
            lat:14.6928, lng:-17.4467,
            rooms:3, baths:2, area:85,
            amenities:["wifi","piscine","parking","sécurité24h"],
            image: img(11),
            host:{ id:"host1", name:"Aminata Diallo", avatar: img(99), verified:true, reviews:150, years:5 }
          });
          setSimilar([
            { id:"2", title:"Suite Executive - Ouaga", city:"Ouagadougou", country:"Burkina Faso", price:85000, rating:4.7, reviews:156, image:img(14), type:"hotel" },
            { id:"3", title:"Résidence meublée centre-ville", city:"Abidjan", country:"Côte d'Ivoire", price:70000, rating:4.6, reviews:98, image:img(15), type:"daily" },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return ()=>{ cancelled = true; };
  }, [id]);

  return { data, similar, loading };
}