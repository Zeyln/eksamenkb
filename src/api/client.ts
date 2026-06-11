import axios from 'axios';

let onSessionExpired: (() => void) | null = null;

export const registerSessionExpiredCallback = (cb: () => void) => {
    onSessionExpired = cb;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = error.config?.url?.includes('/auth/');
        if (error.response?.status === 401 && !isAuthEndpoint && onSessionExpired) {
            onSessionExpired();
        }
        return Promise.reject(error);
    }
);

export default api;
