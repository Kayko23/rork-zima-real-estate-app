export type PickedLocal = { uri: string; name: string; mimeType?: string; size?: number };

const API = process.env.EXPO_PUBLIC_API_URL ?? "https://example.com";
const UPLOAD_URL = `${API}/upload`;

export async function uploadToBackendAsync(f: PickedLocal): Promise<{ url: string; name: string; mime: string; size?: number }> {
  // Si tu n'as pas encore d'API, fais simplement return l'URI locale :
  if (!process.env.EXPO_PUBLIC_API_URL) {
    return { url: f.uri, name: f.name, mime: f.mimeType || "application/octet-stream", size: f.size };
  }
  
  const form = new FormData();
  form.append("file", { uri: f.uri, name: f.name, type: f.mimeType || "application/octet-stream" } as any);

  const r = await fetch(UPLOAD_URL, { method: "POST", body: form });
  if (!r.ok) throw new Error(`Upload failed: ${r.status}`);
  const json = await r.json();       // { url, name?, mime?, size? }
  return { 
    url: json.url, 
    name: json.name ?? f.name, 
    mime: json.mime ?? (f.mimeType || "application/octet-stream"), 
    size: json.size ?? f.size 
  };
}

export function isImageMime(m?: string) {
  return !!m && m.startsWith("image/");
}