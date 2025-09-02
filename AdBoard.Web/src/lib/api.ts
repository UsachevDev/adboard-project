// .NET (новый бэк) — Auth/Users
// Legacy (старый Spring) — ВРЕМЕННО только READ для категорий/объявлений.

import type {
  UserProfile,
  Announcement as AnnouncementType,
  AddAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "@/types";

const API_DOTNET = "/api";        // next.config.ts -> http://adboard-backend:8080/api
const API_LEGACY = "/api-legacy"; // next.config.ts -> http://adboard-backend-legacy:8081/api

type ApiOk<T> = { statusCode: number; data: T };
type ProblemDetails = { type?: string; title?: string; status?: number; detail?: string; instance?: string; traceId?: string };
type ValidationProblemDetails = ProblemDetails & { errors?: Record<string, string[] | string> };

type FetchOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: Record<string, string>;
};

let accessTokenCache: string | null = null;

function getAccessToken(): string | null {
  if (accessTokenCache !== null) return accessTokenCache;
  accessTokenCache = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return accessTokenCache;
}

function setAccessToken(token: string | null) {
  accessTokenCache = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("access_token", token);
    else localStorage.removeItem("access_token");
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "access_token") accessTokenCache = e.newValue;
  });
}

// Оставляем только цифры (на бэке валидатор допускает "+", но цифры всегда ок)
function normalizePhoneForApi(raw?: string): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D+/g, "");
  return digits || undefined;
}

async function request<T>(
  base: string,
  endpoint: string,
  options: FetchOptions = {},
  { tryRefresh = true }: { tryRefresh?: boolean } = {}
): Promise<T> {
  const token = getAccessToken();
  const isDotnet = base === API_DOTNET;

  const AUTH_NO_BEARER = /^\/Auth\/(login|register|refresh)\b/;
  const shouldAttachAuth = Boolean(
    isDotnet && token && !AUTH_NO_BEARER.test(endpoint)
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(shouldAttachAuth ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const init: RequestInit = {
    method: options.method || "GET",
    credentials: "include",
    headers,
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  };

  let res = await fetch(`${base}${endpoint}`, init);

  // Авто-рефреш токена только для .NET и только вне /Auth/*
  if (res.status === 401 && tryRefresh && isDotnet && !endpoint.startsWith("/Auth/")) {
    const ok = await refreshAccessToken();
    if (!ok) throw new Error("Unauthorized");
    const newToken = getAccessToken();
    res = await fetch(`${base}${endpoint}`, {
      ...init,
      headers: { ...headers, ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}) },
    });
  }

  if (res.status === 204) {
    // @ts-ignore
    return undefined;
  }

  const contentType = res.headers.get("content-type") ?? "";
  let json: any = null;
  if (contentType.includes("application/json")) {
    try { json = await res.json(); } catch { }
  } else {
    try { json = await res.text(); } catch { }
  }

  if (!res.ok) {
    // .NET ValidationProblemDetails (errors: Record<string, string[] | string>)
    if (json && typeof json === "object" && (json as any).errors && !Array.isArray((json as any).errors)) {
      const v = json as ValidationProblemDetails;
      const parts: string[] = [];
      for (const [prop, val] of Object.entries(v.errors ?? {})) {
        const arr = Array.isArray(val) ? val : [val];
        for (const m of arr) parts.push(`{"property":"${prop}","error":"${String(m)}"}`);
      }
      const msg = parts.join("\n") || v.detail || v.title || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    // Наш формат: { errors: [{ property, error }...] }
    if (json && typeof json === "object" && Array.isArray((json as any).errors)) {
      const parts = (json as any).errors.map((e: any) =>
        `{"property":"${e?.property ?? "?"}","error":"${String(e?.error ?? "Ошибка")}"}`,
      );
      throw new Error(parts.join("\n"));
    }

    // ProblemDetails / произвольное сообщение
    const pdMsg =
      (json && typeof json === "object" && ((json as any).detail || (json as any).title || (json as any).message)) ||
      (typeof json === "string" && json) ||
      `HTTP ${res.status}`;

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("API error:", { url: `${base}${endpoint}`, status: res.status, body: options.body, response: json });
    }

    throw new Error(String(pdMsg));
  }

  // API-обёртка { statusCode, data }
  if (json && typeof json === "object" && "data" in json) {
    return (json as ApiOk<T>).data;
  }
  return json as T;
}

// ===== AUTH (.NET)

export async function login(email: string, password: string): Promise<void> {
  const res = await request<{ accessToken: string }>(API_DOTNET, "/Auth/login", {
    method: "POST",
    body: { email, password },
  });
  setAccessToken(res.accessToken);
}

export async function register(
  email: string,
  password: string,
  name: string,
  phoneNumber?: string,
  city?: string,
  passwordConfirm?: string
): Promise<void> {
  const normalizedPhone = normalizePhoneForApi(phoneNumber);
  const res = await request<{ accessToken: string }>(API_DOTNET, "/Auth/register", {
    method: "POST",
    body: {
      email,
      name,
      password,
      passwordConfirm: passwordConfirm ?? password,
      phoneNumber: normalizedPhone, // <- только цифры
      city,
    },
  });
  setAccessToken(res.accessToken);
}

export async function logout(): Promise<void> {
  try {
    await request<void>(API_DOTNET, "/Auth/logout", { method: "POST" }, { tryRefresh: false });
  } finally {
    setAccessToken(null);
    window.location.href = "/";
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const res = await fetch(`${API_DOTNET}/Auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    setAccessToken(null);
    return false;
  }
  const json = (await res.json()) as ApiOk<{ accessToken: string }>;
  if (json?.data?.accessToken) {
    setAccessToken(json.data.accessToken);
    return true;
  }
  setAccessToken(null);
  return false;
}

// ===== USERS (.NET)

export async function getCurrentUser(): Promise<UserProfile> {
  return request<UserProfile>(API_DOTNET, "/Users/profile", { method: "GET" });
}

export async function updateCurrentUser(patch: Partial<UserProfile>): Promise<UserProfile> {
  return request<UserProfile>(API_DOTNET, "/Users", { method: "PATCH", body: patch });
}

export async function getUserById(id: string): Promise<UserProfile> {
  return request<UserProfile>(API_DOTNET, `/Users/${encodeURIComponent(id)}`, { method: "GET" });
}

// ===== CATEGORIES & ANNOUNCEMENTS — legacy read-only (БЕЗ Authorization!)

export interface CategoryDto {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

export type Announcement = AnnouncementType;

export async function getCategories(): Promise<CategoryDto[]> {
  return request<CategoryDto[]>(API_LEGACY, "/categories", { method: "GET" }, { tryRefresh: false });
}

export async function getCategoryById(id: string): Promise<CategoryDto> {
  return request<CategoryDto>(API_LEGACY, `/categories/${encodeURIComponent(id)}`, { method: "GET" }, { tryRefresh: false });
}

export async function getAnnouncements(
  categoryId?: string,
  subcategoryId?: string
): Promise<Announcement[]> {
  const params = new URLSearchParams();
  if (categoryId) params.set("categoryId", categoryId);
  if (subcategoryId) params.set("subcategoryId", subcategoryId);
  const q = params.toString() ? `?${params.toString()}` : "";
  const anns = await request<Announcement[]>(API_LEGACY, `/announcements${q}`, { method: "GET" }, { tryRefresh: false });
  return anns.map((a) => ({ ...a, category: a.category ?? a.subcategory?.category }));
}

export async function getAnnouncementById(id: string): Promise<Announcement> {
  const ann = await request<Announcement>(API_LEGACY, `/announcements/${encodeURIComponent(id)}`, { method: "GET" }, { tryRefresh: false });
  return { ...ann, category: ann.category ?? ann.subcategory?.category };
}

// ===== пока нет write-эндпоинтов

export async function addAnnouncement(_payload: AddAnnouncementRequest): Promise<Announcement> {
  throw new Error("Создание объявления недоступно: ждём .NET эндпоинт");
}
export async function updateAnnouncement(_id: string, _patch: UpdateAnnouncementRequest): Promise<Announcement> {
  throw new Error("Обновление объявления недоступно: ждём .NET эндпоинт");
}
export async function addToFavorites(_id: string): Promise<void> {
  throw new Error("Избранное недоступно: ждём .NET эндпоинт");
}
export async function removeFromFavorites(_id: string): Promise<void> {
  throw new Error("Избранное недоступно: ждём .NET эндпоинт");
}
export async function addReview(_announcementId: string, _score: number, _description: string): Promise<void> {
  throw new Error("Отзывы недоступны: ждём .NET эндпоинт");
}
