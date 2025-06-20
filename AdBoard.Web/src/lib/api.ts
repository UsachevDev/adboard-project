const API_BASE_URL = 'http://localhost:8080/api';

interface ControllerResponse<T> {
    data: T | null;
    error: any | null;
}

interface ApiFetchOptions extends RequestInit {
}

const getAccessToken = (): string | null => {
    return localStorage.getItem('access_token');
};

const getRefreshToken = (): string | null => {
    return sessionStorage.getItem('refresh_token');
};

const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
};

const clearTokens = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
};

const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        console.error('Refresh token не найден. Пользователь не авторизован.');
        clearTokens();
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const result: ControllerResponse<any> = await response.json();

        if (response.ok && result.data) {
            const newAccessToken = result.data.access_token;
            const newRefreshToken = result.data.refresh_token;
            setTokens(newAccessToken, newRefreshToken);
            return newAccessToken;
        } else {
            console.error('Не удалось обновить access token:', result.error || response.statusText);
            clearTokens();
            return null;
        }
    } catch (error) {
        console.error('Ошибка при запросе обновления токена:', error);
        clearTokens();
        return null;
    }
};

const api = async (url: string, options: ApiFetchOptions = {}): Promise<Response> => {
    const accessToken = getAccessToken();

    if (accessToken) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
        };
    }

    let response = await fetch(`${API_BASE_URL}${url}`, options);
    
    if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/registration') && !url.includes('/auth/refresh')) {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${newAccessToken}`,
            };
            response = await fetch(`${API_BASE_URL}${url}`, options);
        } else {
            throw new Error('Unauthorized: Could not refresh token. Please log in again.');
        }
    }

    return response;
};

export default api;
