import { useEffect } from "react";
import { useApp } from "@/hooks/useAppStore";

export function useBootstrapFx() {
  const { setFx } = useApp();

  useEffect(() => {
    (async () => {
      try {
        // Fallback simple: USD base avec taux approximatifs
        setFx("USD", { 
          USD: 1, 
          XOF: 610, 
          XAF: 610, 
          NGN: 1540, 
          GHS: 15.5, 
          ZAR: 18.5, 
          EUR: 0.92 
        });
      } catch {
        // En cas d'erreur, utiliser les mêmes taux par défaut
        setFx("USD", { 
          USD: 1, 
          XOF: 610, 
          XAF: 610, 
          NGN: 1540, 
          GHS: 15.5, 
          ZAR: 18.5, 
          EUR: 0.92 
        });
      }
    })();
  }, [setFx]);
}