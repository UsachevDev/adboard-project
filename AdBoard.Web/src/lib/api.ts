import { UserProfile } from "@/types/index";

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

    let json: ControllerResponse<T>;
    try {
        json = (await response.json()) as ControllerResponse<T>;
    } catch {
        throw new Error("Invalid JSON response");
    }

    if (!response.ok || json.error) {
        const msg =
            json.error != null ? String(json.error) : `HTTP ${response.status}`;
        throw new Error(msg);
    }

    return json.data!;
}

async function refreshToken(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });
    const json = (await response.json()) as ControllerResponse<string>;
    if (response.ok && json.data) {
        localStorage.setItem("access_token", json.data);
    } else {
        localStorage.removeItem("access_token");
    }
}

// === Auth ===
export async function login(email: string, password: string): Promise<void> {
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
export async function getCategoryById(id: string): Promise<CategoryDto> {
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
