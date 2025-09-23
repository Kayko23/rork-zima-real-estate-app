import { useEffect, useState } from "react";

export type City = { id: string; name: string; admin?: string; lat?: number; lon?: number };

export function useCities(countryCode?: string, query = "", page = 1) {
  const [data, setData] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!countryCode) { setData([]); return; }
      setLoading(true);
      try {
        // Mock data for now - replace with actual API or JSON files
        const mockCities: City[] = [
          { id: "1", name: "Abidjan", admin: "Lagunes" },
          { id: "2", name: "Bouaké", admin: "Vallée du Bandama" },
          { id: "3", name: "Daloa", admin: "Haut-Sassandra" },
          { id: "4", name: "Yamoussoukro", admin: "Lacs" },
          { id: "5", name: "San-Pédro", admin: "Bas-Sassandra" },
          { id: "6", name: "Korhogo", admin: "Savanes" },
          { id: "7", name: "Man", admin: "Montagnes" },
          { id: "8", name: "Divo", admin: "Sud-Bandama" },
          { id: "9", name: "Gagnoa", admin: "Fromager" },
          { id: "10", name: "Abengourou", admin: "N'zi-Comoé" },
        ];

        const filtered = query
          ? mockCities.filter(c => (c.name + " " + (c.admin ?? "")).toLowerCase().includes(query.toLowerCase()))
          : mockCities;

        // pagination client
        const pageSize = 200;
        const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

        if (mounted) setData(slice);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, [countryCode, query, page]);

  return { cities: data, loading };
}