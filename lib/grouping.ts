// lib/grouping.ts
import type { AllItem, Kind } from "@/lib/all-api";

export type Disposition = "sale" | "rent" | "short";
export type GroupMode = "category" | "location";

export type GroupKey = {
  kind: Kind;
  category?: string;
  disposition?: Disposition;
  country?: string;
  city?: string;
};

export type Section<T = AllItem> = {
  key: string;
  title: string;
  subtitle?: string;
  data: T[];
  meta: GroupKey;
};

export function getDisposition(p: any): Disposition | undefined {
  const raw: string = String(p.status || p.disposition || p.market || "").toLowerCase();
  if (/sell|sale|vendre/.test(raw)) return "sale";
  if (/rent|louer|lease/.test(raw)) return "rent";
  if (/short|daily|jour|nuit|hebdo/.test(raw)) return "short";
  if (typeof p.price_unit === "string" && /nuit|night/i.test(p.price_unit)) return "short";
  return undefined;
}

export function getCategory(p: any): string | undefined {
  const t = String(p.type || p.category || p.kind || "").toLowerCase();
  if (/villa/.test(t)) return "Villa";
  if (/apartment|appartement/.test(t)) return "Appartement";
  if (/studio/.test(t)) return "Studio";
  if (/penthouse/.test(t)) return "Penthouse";
  if (/terrain|land/.test(t)) return "Terrain";
  if (/bureau|office/.test(t)) return "Bureau";
  if (/commerce|shop|retail/.test(t)) return "Commercial";
  if (/maison d.hôtes|guest/.test(t)) return "Maison d’hôtes";
  return "Autre";
}

export function groupItems(items: AllItem[], mode: GroupMode = "category"): Section[] {
  console.log("[groupItems] start", { count: items.length, mode });
  const buckets = new Map<string, Section>();

  const makeKey = (g: GroupKey) => [g.kind, g.category ?? "", g.disposition ?? "", g.country ?? "", g.city ?? ""].join("|");

  for (const it of items) {
    if (it.kind === "property") {
      const p: any = it;
      const g: GroupKey =
        mode === "category"
          ? { kind: "property", category: getCategory(p), disposition: getDisposition(p), country: p.location?.country ?? p.country, city: p.location?.city ?? p.city }
          : { kind: "property", country: p.location?.country ?? p.country, city: p.location?.city ?? p.city, disposition: getDisposition(p), category: getCategory(p) };

      const key = makeKey(g);
      if (!buckets.has(key)) {
        buckets.set(key, {
          key,
          title:
            mode === "category"
              ? `Propriétés • ${g.category}${g.disposition ? ` • ${labelDispo(g.disposition)}` : ""}`
              : `Propriétés • ${g.city ?? "—"}, ${g.country ?? "—"}${g.disposition ? ` • ${labelDispo(g.disposition)}` : ""}`,
          subtitle: mode === "category" ? [g.city, g.country].filter(Boolean).join(", ") : g.category,
          data: [],
          meta: g,
        });
      }
      buckets.get(key)!.data.push(it);
      continue;
    }

    if (it.kind === "trip") {
      const h: any = it;
      const g: GroupKey = mode === "category" ? { kind: "trip", category: "Hôtels & séjours", country: h.country, city: h.city } : { kind: "trip", country: h.country, city: h.city, category: "Hôtels & séjours" };

      const key = makeKey(g);
      if (!buckets.has(key)) {
        buckets.set(key, {
          key,
          title: mode === "category" ? "Hébergements • Hôtels & séjours" : `Hébergements • ${g.city ?? "—"}, ${g.country ?? "—"}`,
          subtitle: mode === "category" ? [g.city, g.country].filter(Boolean).join(", ") : undefined,
          data: [],
          meta: g,
        });
      }
      buckets.get(key)!.data.push(it);
      continue;
    }

    if (it.kind === "pro") {
      const p: any = it;
      const g: GroupKey = mode === "category" ? { kind: "pro", category: normalizeProCategory(p.specialty || p.category), country: p.location?.country ?? p.country, city: p.location?.city ?? p.city } : { kind: "pro", country: p.location?.country ?? p.country, city: p.location?.city ?? p.city, category: normalizeProCategory(p.specialty || p.category) };

      const key = makeKey(g);
      if (!buckets.has(key)) {
        buckets.set(key, {
          key,
          title: mode === "category" ? `Professionnels • ${g.category}` : `Professionnels • ${g.city ?? "—"}, ${g.country ?? "—"}`,
          subtitle: mode === "category" ? [g.city, g.country].filter(Boolean).join(", ") : g.category,
          data: [],
          meta: g,
        });
      }
      buckets.get(key)!.data.push(it);
      continue;
    }
  }

  const ordered = Array.from(buckets.values()).sort((a, b) => (a.title || "").localeCompare(b.title || ""));

  for (const s of ordered) {
    s.data.sort((a: any, b: any) => {
      const ra = (a as any).rating ?? (a as any).provider?.rating ?? 0;
      const rb = (b as any).rating ?? (b as any).provider?.rating ?? 0;
      if (rb !== ra) return rb - ra;
      const pa = price(a);
      const pb = price(b);
      return pa - pb;
    });
  }

  console.log("[groupItems] sections", ordered.length);
  return ordered;
}

function price(x: any) {
  if (x.kind === "trip") return x.price_per_night ?? Number.MAX_SAFE_INTEGER;
  return x.price ?? Number.MAX_SAFE_INTEGER;
}
function labelDispo(d: Disposition) {
  return d === "sale" ? "À vendre" : d === "rent" ? "À louer" : "Courte durée";
}
function normalizeProCategory(raw?: string) {
  const t = String(raw ?? "").toLowerCase();
  if (/agence/.test(t)) return "Agence immobilière";
  if (/agent|broker|realtor/.test(t)) return "Agent immobilier";
  if (/gestion/.test(t)) return "Gestionnaire immobilier";
  if (/réservation.*h[oô]tel/.test(t)) return "Réservation – Hôtel";
  if (/réservation.*(résidence|journali)/.test(t)) return "Réservation – Résidence";
  if (/év[ée]nement|event/.test(t)) return "Gestion espace évènementiel";
  return "Professionnel";
}
