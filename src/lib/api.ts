export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const API_KEY_STORAGE = "payrail_api_key";

type ApiResult<T> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  apiKey?: string
): Promise<ApiResult<T>> {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const storedKey = apiKey || getApiKey();
  if (storedKey) {
    headers.set("X-Api-Key", storedKey);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let payload: unknown = undefined;
  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "error" in payload && (payload as any).error) ||
      response.statusText ||
      "Request failed";
    return { ok: false, status: response.status, error: String(message), data: payload as T };
  }

  return { ok: true, status: response.status, data: payload as T };
}

export function setApiKey(key: string) {
  if (typeof window === "undefined") return;
  if (!key) {
    window.sessionStorage.removeItem(API_KEY_STORAGE);
    return;
  }
  window.sessionStorage.setItem(API_KEY_STORAGE, key);
}

export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(API_KEY_STORAGE) || "";
}
