import { useEffect } from "react";
import { useApp } from "@/hooks/useAppStore";

export function useBootstrapFx() {
  const { setFx } = useApp();

  useEffect(() => {
    let mounted = true;
    
    const loadRates = async () => {
      try {
        const rates = { 
          USD: 1, 
          XOF: 610, // Franc CFA UEMOA
          XAF: 610, // Franc CFA CEMAC
          NGN: 1540, // Naira nigérian
          GHS: 15.5, // Cedi ghanéen
          ZAR: 18.5, // Rand sud-africain
          KES: 155, // Shilling kenyan
          UGX: 3700, // Shilling ougandais
          TZS: 2500, // Shilling tanzanien
          ETB: 120, // Birr éthiopien
          EGP: 49, // Livre égyptienne
          MAD: 10.2, // Dirham marocain
          TND: 3.1, // Dinar tunisien
          DZD: 135, // Dinar algérien
          RWF: 1300, // Franc rwandais
          MUR: 46, // Roupie mauricienne
          BWP: 13.5, // Pula botswanais
          EUR: 0.92 // Euro
        };
        
        if (mounted) {
          setFx("USD", rates);
        }
      } catch (error) {
        console.log('Error loading exchange rates:', error);
      }
    };
    
    // Load rates immediately without waiting for hydration
    const timer = setTimeout(loadRates, 50);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [setFx]);
}