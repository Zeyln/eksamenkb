import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticle, getArticle, updateArticle } from '../api/articles';

export default function ArticleFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('DRAFT');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing && id) {
            getArticle(id).then((article) => {
                setTitle(article.title);
                setContent(article.content);
                setStatus(article.status);
            });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isEditing && id) {
                await updateArticle(id, { title, content, status });
                navigate(`/articles/${id}`);
            } else {
                const article = await createArticle({ title, content, status });
                navigate(`/articles/${article.id}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Noe gikk galt');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b px-6 py-4">
                <h1 className="text-xl font-bold">{isEditing ? 'Rediger artikkel' : 'Ny artikkel'}</h1>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-8">
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tittel</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Innhold</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={12}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="DRAFT">Utkast</option>
                            <option value="PUBLISHED">Publisert</option>
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Lagrer...' : isEditing ? 'Oppdater' : 'Opprett'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-100 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Avbryt
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
