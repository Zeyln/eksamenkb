import api from './client';

export const getArticles = async () => {
    const { data } = await api.get('/articles');
    return data;
};

export const getArticle = async (id: string) => {
    const { data } = await api.get(`/articles/${id}`);
    return data;
};

export const createArticle = async (payload: {
    title: string;
    content: string;
    status?: string;
    categoryId?: string;
}) => {
    const { data } = await api.post('/articles', payload);
    return data;
};

export const updateArticle = async (id: string, payload: {
    title?: string;
    content?: string;
    status?: string;
    categoryId?: string;
}) => {
    const { data } = await api.put(`/articles/${id}`, payload);
    return data;
};

export const deleteArticle = async (id: string) => {
    await api.delete(`/articles/${id}`);
};
