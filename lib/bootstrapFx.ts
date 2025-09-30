import { useEffect } from "react";
import { useApp } from "@/hooks/useAppStore";

export function useBootstrapFx() {
  const { setFx } = useApp();

  useEffect(() => {
    let mounted = true;
    
    const loadRates = () => {
      try {
        const rates = { 
          USD: 1, 
          XOF: 610,
          XAF: 610,
          NGN: 1540,
          GHS: 15.5,
          ZAR: 18.5,
          KES: 155,
          UGX: 3700,
          TZS: 2500,
          ETB: 120,
          EGP: 49,
          MAD: 10.2,
          TND: 3.1,
          DZD: 135,
          RWF: 1300,
          MUR: 46,
          BWP: 13.5,
          EUR: 0.92
        };
        
        if (mounted && setFx) {
          setFx("USD", rates);
        }
      } catch (error) {
        console.log('Error loading exchange rates:', error);
      }
    };
    
    // Load rates with a small delay to ensure context is ready
    const timer = setTimeout(loadRates, 100);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [setFx]);
}