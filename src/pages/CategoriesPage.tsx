import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCategories, createCategory, deleteCategory } from '../api/categories';
import { Link } from 'react-router-dom';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    children: Category[];
    _count: { articles: number };
}

export default function CategoriesPage() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = () => {
        getCategories()
            .then(setCategories)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await createCategory({ name, description: description || undefined, parentId: parentId || undefined });
            setName('');
            setDescription('');
            setParentId('');
            fetchCategories();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Noe gikk galt');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Er du sikker?')) return;
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Noe gikk galt');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-blue-600 hover:underline text-sm">← Tilbake</Link>
                    <h1 className="text-xl font-bold">Kategorier</h1>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                {user && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Opprett kategori</h2>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Navn</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Beskrivelse</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Underkategori av</label>
                                <select
                                    value={parentId}
                                    onChange={(e) => setParentId(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Ingen (toppnivå)</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? 'Oppretter...' : 'Opprett'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Alle kategorier</h2>
                    {loading ? (
                        <p className="text-gray-500 text-sm">Laster...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-gray-500 text-sm">Ingen kategorier ennå.</p>
                    ) : (
                        <ul className="space-y-3">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <div>
                                            <p className="font-medium text-sm">{cat.name}</p>
                                            {cat.description && <p className="text-xs text-gray-500">{cat.description}</p>}
                                            <p className="text-xs text-gray-400">{cat._count.articles} artikler</p>
                                        </div>
                                        {user && (
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                Slett
                                            </button>
                                        )}
                                    </div>
                                    {cat.children.length > 0 && (
                                        <ul className="ml-4 mt-2 space-y-2">
                                            {cat.children.map((child) => (
                                                <li key={child.id} className="flex justify-between items-center py-1 border-b">
                                                    <div>
                                                        <p className="text-sm text-gray-700">↳ {child.name}</p>
                                                        {child.description && <p className="text-xs text-gray-500">{child.description}</p>}
                                                    </div>
                                                    {user && (
                                                        <button
                                                            onClick={() => handleDelete(child.id)}
                                                            className="text-red-500 text-xs hover:underline"
                                                        >
                                                            Slett
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}
