import api from './client';

export const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
};

export const register = async (email: string, username: string, password: string) => {
    const { data } = await api.post('/auth/register', { email, username, password });
    return data;
};

export const logout = async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken });
};
