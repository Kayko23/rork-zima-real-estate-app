export const API = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

async function json<T>(path: string, body?: any, method = "POST"): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const authApi = {
  login: (data: { email?: string; phone?: string; password: string }) =>
    json<{ token: string; user: any }>("/auth/login", data),
    
  register: (payload: any) =>
    json<{ token: string; user: any }>("/auth/register", payload),
    
  upload: async (file: { uri: string; name: string; type: string }) => {
    const fd = new FormData();
    fd.append("file", { 
      uri: file.uri, 
      name: file.name, 
      type: file.type 
    } as any);
    
    const res = await fetch(`${API}/upload`, { 
      method: "POST", 
      body: fd 
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Upload failed: HTTP ${res.status}`);
    }
    
    return res.json() as Promise<{ url: string; id: string }>;
  },
};