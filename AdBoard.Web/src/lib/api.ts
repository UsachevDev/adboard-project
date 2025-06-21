const API_BASE_URL = "http://localhost:8080/api";

export interface ControllerResponse<T> {
    data: T | null;
    error: unknown | null;
}

type ApiFetchOptions = RequestInit;

const getAccessToken = (): string | null =>
    localStorage.getItem("access_token");
const getRefreshToken = (): string | null =>
    sessionStorage.getItem("refresh_token");

const setTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("refresh_token", refreshToken);
};

const clearTokens = (): void => {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
};

const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        console.error("Refresh token не найден. Пользователь не авторизован.");
        clearTokens();
        return null;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
        const result = (await response.json()) as ControllerResponse<{
            access_token: string;
            refresh_token: string;
        }>;
        if (response.ok && result.data) {
            console.log("🔄 Access token обновлён");
            setTokens(result.data.access_token, result.data.refresh_token);
            return result.data.access_token;
        }
        console.error("Не удалось обновить access token:", result.error);
        clearTokens();
        return null;
    } catch (err: unknown) {
        console.error("Ошибка при запросе обновления токена:", err);
        clearTokens();
        return null;
    }
};

const api = async (
    url: string,
    options: ApiFetchOptions = {}
): Promise<Response> => {
    const accessToken = getAccessToken();
    if (accessToken) {
        options.headers = {
            ...(options.headers as Record<string, string>),
            Authorization: `Bearer ${accessToken}`,
        };
    }
    let response = await fetch(`${API_BASE_URL}${url}`, options);
    if (
        response.status === 401 &&
        !url.includes("/auth/login") &&
        !url.includes("/auth/registration") &&
        !url.includes("/auth/refresh")
    ) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            options.headers = {
                ...(options.headers as Record<string, string>),
                Authorization: `Bearer ${newToken}`,
            };
            response = await fetch(`${API_BASE_URL}${url}`, options);
        } else {
            throw new Error("Unauthorized: Could not refresh token.");
        }
    }
    return response;
};

export default api;
