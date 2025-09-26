import { useEffect, useState } from "react";
import { getLastFxUpdateAt, loadRatesFromCache, refreshRatesOnline } from "@/components/voyages/fx";

/**
 * Charge les taux depuis le cache au démarrage puis tente une maj si > 12h.
 * À utiliser une seule fois (ex: dans VoyagesScreen).
 */
export function useFxRates(){
  const [ready, setReady] = useState(false);
  useEffect(()=> {
    let mounted = true;
    (async()=>{
      await loadRatesFromCache();
      if (!mounted) return;
      const last = await getLastFxUpdateAt();
      const twelveHours = 12 * 60 * 60 * 1000;
      if (!last || (Date.now() - last) > twelveHours) {
        await refreshRatesOnline(); // ok si offline => fallback cache
      }
      if (mounted) setReady(true);
    })();
    return ()=>{ mounted = false; };
  }, []);
  return { ready };
}
