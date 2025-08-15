// src/lib/api.ts
// .NET (новый бэк) — Auth/Users
// Legacy (старый Spring) — ВРЕМЕННО только READ для категорий/объявлений.

import type {
  UserProfile,
  Announcement as AnnouncementType,
  AddAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "@/types";

const API_DOTNET = "/api";        // next.config.ts -> http://adboard-backend:8080/api
const API_LEGACY = "/api-legacy"; // next.config.ts -> http://adboard-backend-legacy:8080/api

type ApiOk<T> = { statusCode: number; data: T };
type ProblemDetails = { type?: string; title?: string; status?: number; detail?: string; instance?: string };
type ValidationProblemDetails = ProblemDetails & { errors?: Record<string, unknown> };

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

function toStr(x: unknown): string {
  if (x == null) return "";
  const t = typeof x;
  if (t === "string" || t === "number" || t === "boolean") return String(x);
  if (t === "object") {
    const o = x as Record<string, unknown>;
    for (const k of ["errorMessage", "ErrorMessage", "message", "Message", "detail", "Detail", "title", "Title", "description", "Description"]) {
      const v = o[k];
      if (typeof v === "string") return v;
    }
    try { return JSON.stringify(x); } catch { /* ignore */ }
  }
  return String(x);
}

function flattenErrors(errors: Record<string, unknown> | undefined): string {
  if (!errors) return "";
  const list: unknown[] = [];
  for (const v of Object.values(errors)) {
    if (Array.isArray(v)) list.push(...v);
    else list.push(v);
  }
  const lines = list.map(toStr).filter(Boolean);
  return lines.join("\n");
}

async function request<T>(
  base: string,
  endpoint: string,
  options: FetchOptions = {},
  { tryRefresh = true }: { tryRefresh?: boolean } = {}
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json, application/problem+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const init: RequestInit = {
    method: options.method || "GET",
    credentials: "include",
    headers,
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  };

  let res = await fetch(`${base}${endpoint}`, init);

  if (res.status === 401 && tryRefresh && base === API_DOTNET && !endpoint.startsWith("/Auth/")) {
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

  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
  let json: any = null;
  if (contentType.includes("json")) {
    try { json = await res.json(); } catch { /* ignore */ }
  } else {
    try { json = await res.text(); } catch { /* ignore */ }
  }

  if (!res.ok) {
    // ASP.NET ValidationProblemDetails
    if (json && typeof json === "object" && "errors" in json) {
      const v = json as ValidationProblemDetails;
      const msg =
        flattenErrors(v.errors) ||
        toStr(v.title) ||
        toStr(v.detail) ||
        `HTTP ${res.status}`;
      throw new Error(msg);
    }

    // ProblemDetails / произвольная ошибка
    const msg =
      (json && typeof json === "object"
        ? (toStr((json as any).message) ||
           toStr((json as any).detail) ||
           toStr((json as any).title))
        : (typeof json === "string" ? json : "")) || `HTTP ${res.status}`;

    throw new Error(msg);
  }

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
  setAccessToken(res?.accessToken);
}

export async function register(
  email: string,
  password: string,
  name: string,
  phoneNumber?: string,
  city?: string,
  passwordConfirm?: string
): Promise<void> {
  const res = await request<{ accessToken: string }>(API_DOTNET, "/Auth/register", {
    method: "POST",
    body: { email, name, password, passwordConfirm: passwordConfirm ?? password, phoneNumber, city },
  });
  setAccessToken(res?.accessToken);
}

export async function logout(): Promise<void> {
  try {
    await request<void>(API_DOTNET, "/Auth/logout", { method: "POST" });
  } finally {
    setAccessToken(null);
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const res = await fetch(`${API_DOTNET}/Auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "Accept": "application/json, application/problem+json" },
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

// ===== CATEGORIES & ANNOUNCEMENTS — legacy read-only

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
  return request<Announcement[]>(API_LEGACY, `/announcements${q}`, { method: "GET" }, { tryRefresh: false });
}

export async function getAnnouncementById(id: string): Promise<Announcement> {
  return request<Announcement>(API_LEGACY, `/announcements/${encodeURIComponent(id)}`, { method: "GET" }, { tryRefresh: false });
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
