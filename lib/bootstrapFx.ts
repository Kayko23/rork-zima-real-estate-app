import { useEffect } from "react";
import { useApp } from "@/hooks/useAppStore";

export function useBootstrapFx() {
  const { setFx } = useApp();

  useEffect(() => {
    (async () => {
      try {
        // Fallback avec taux de change approximatifs pour les devises africaines
        // En production, remplacez par votre API de taux de change
        setFx("USD", { 
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
        });
      } catch (error) {
        console.log('Error loading exchange rates:', error);
        // Même fallback en cas d'erreur
        setFx("USD", { 
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
        });
      }
    })();
  }, [setFx]);
}