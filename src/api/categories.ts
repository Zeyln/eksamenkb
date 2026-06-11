import api from './client';

export const getCategories = async () => {
    const { data } = await api.get('/categories');
    return data;
};

export const createCategory = async (payload: {
    name: string;
    description?: string;
    parentId?: string;
}) => {
    const { data } = await api.post('/categories', payload);
    return data;
};

export const deleteCategory = async (id: string) => {
    await api.delete(`/categories/${id}`);
};
