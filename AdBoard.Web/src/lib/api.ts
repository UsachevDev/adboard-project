import { UserProfile, Announcement, AddAnnouncementRequest, UpdateAnnouncementRequest } from "@/types";

const API_BASE_URL = "/api";

export interface ControllerResponse<T> {
    data: T | null;
    error: unknown | null;
}

type FetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function apiFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const token = localStorage.getItem("access_token");
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const init: RequestInit = {
        credentials: "include",
        method: options.method || "GET",
        headers,
        body: options.body != null ? JSON.stringify(options.body) : undefined,
    };

    let response = await fetch(`${API_BASE_URL}${endpoint}`, init);

    if (response.status === 401 && !endpoint.startsWith("/auth/")) {
        await refreshToken();
        const newToken = localStorage.getItem("access_token");
        if (!newToken) throw new Error("Unauthorized");
        init.headers = { ...headers, Authorization: `Bearer ${newToken}` };
        response = await fetch(`${API_BASE_URL}${endpoint}`, init);
    }

    let payload: ControllerResponse<T> | null = null;
    try {
        payload = (await response.json()) as ControllerResponse<T>;
    } catch {
        if (response.ok) {
            // @ts-ignore
            return undefined;
        }
        throw new Error(`HTTP ${response.status}`);
    }

    if (!response.ok || payload.error) {
        const err = payload.error;
        let msg: string;
        if (err && typeof err === "object" && "message" in err) {
            // @ts-ignore
            msg = err.message;
        } else {
            msg = String(err) || `HTTP ${response.status}`;
        }
        throw new Error(msg);
    }

    return payload.data!;
}

async function refreshToken(): Promise<void> {
    const resp = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });
    try {
        const json = (await resp.json()) as ControllerResponse<string>;
        if (resp.ok && json.data) {
            localStorage.setItem("access_token", json.data);
        } else {
            localStorage.removeItem("access_token");
        }
    } catch {
        localStorage.removeItem("access_token");
    }
}

// === Auth ===
export async function login(
    email: string,
    password: string
): Promise<void> {
    const token = await apiFetch<string>("/auth/login", {
        method: "POST",
        body: { email, password },
    });
    localStorage.setItem("access_token", token);
}

export async function register(
    email: string,
    password: string,
    name: string,
    phoneNumber?: string,
    city?: string
): Promise<void> {
    const token = await apiFetch<string>("/auth/registration", {
        method: "POST",
        body: { email, password, name, phoneNumber, city },
    });
    localStorage.setItem("access_token", token);
}

export async function logout(): Promise<void> {
    try {
        await apiFetch<unknown>("/auth/logout", { method: "POST" });
    } finally {
        localStorage.removeItem("access_token");
    }
}

// === Categories ===
export interface CategoryDto {
    id: string;
    name: string;
    subcategories: { id: string; name: string }[];
}
export async function getCategories(): Promise<CategoryDto[]> {
    return apiFetch<CategoryDto[]>("/categories", { method: "GET" });
}
export async function getCategoryById(
    id: string
): Promise<CategoryDto> {
    return apiFetch<CategoryDto>(`/categories/${id}`, { method: "GET" });
}

// === User ===
export async function getCurrentUser(): Promise<UserProfile> {
    return apiFetch<UserProfile>("/users", { method: "GET" });
}

export async function updateCurrentUser(
    patch: Partial<UserProfile>
): Promise<UserProfile> {
    return apiFetch<UserProfile>("/users", {
        method: "PATCH",
        body: patch,
    });
}

// === Announcements ===
export async function getAnnouncements(): Promise<Announcement[]> {
    return apiFetch<Announcement[]>("/announcements");
}

export async function getAnnouncementById(
    id: string
): Promise<Announcement> {
    return apiFetch<Announcement>(`/announcements/${id}`);
}

export async function addAnnouncement(
    payload: AddAnnouncementRequest
): Promise<Announcement> {
    const token = localStorage.getItem("access_token");
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        let errorText = `HTTP ${response.status}`;
        try {
            const errJson = await response.json();
            errorText =
                errJson.error && typeof errJson.error === "string"
                    ? errJson.error
                    : JSON.stringify(errJson);
        } catch {
            // ignore
        }
        throw new Error(errorText);
    }

    const location = response.headers.get("Location");
    if (!location) {
        throw new Error("Missing Location header in response");
    }
    const parts = location.split("/");
    const id = parts.pop() || "";
    if (!id) {
        throw new Error(
            "Cannot parse announcement ID from Location header"
        );
    }
    return getAnnouncementById(id);
}

export async function updateAnnouncement(
  id: string,
  patch: UpdateAnnouncementRequest
): Promise<Announcement> {
  return apiFetch<Announcement>(`/announcements/${id}`, {
    method: "PATCH",
    body: patch,
  });
}

// === Favorites ===
export async function addToFavorites(
    id: string
): Promise<void> {
    await apiFetch<void>(`/favorites/${id}`, { method: "POST" });
}

export async function removeFromFavorites(
    id: string
): Promise<void> {
    await apiFetch<void>(`/favorites/${id}`, { method: "DELETE" });
}

export async function addReview(announcementId: string, score: number, description: string): Promise<void> {
    await apiFetch<void>(`/reviews/${announcementId}`, {
        method: "POST",
        body: { score, description },
    });
}

export async function getUserById(id: string): Promise<UserProfile> {
    return apiFetch<UserProfile>(`/users/${id}`, { method: "GET" });
}
