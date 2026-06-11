import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticle, deleteArticle } from '../api/articles';
import { useAuth } from '../context/AuthContext';

interface Article {
    id: string;
    title: string;
    content: string;
    status: string;
    createdAt: string;
    author: { id: string; username: string };
    category: { name: string } | null;
    tags: { tag: { name: string } }[];
}

export default function ArticlePage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getArticle(id)
                .then(setArticle)
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleDelete = async () => {
        if (!id || !confirm('Er du sikker?')) return;
        await deleteArticle(id);
        navigate('/');
    };

    if (loading) return <div className="p-8">Laster...</div>;
    if (!article) return <div className="p-8">Artikkel ikke funnet.</div>;

    const isAuthor = user?.id === article.author.id;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-blue-600 hover:underline text-sm">← Tilbake</Link>
                {isAuthor && (
                    <div className="flex gap-3">
                        <Link to={`/articles/${id}/edit`} className="bg-gray-100 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
                            Rediger
                        </Link>
                        <button onClick={handleDelete} className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-200">
                            Slett
                        </button>
                    </div>
                )}
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Av {article.author.username} · {new Date(article.createdAt).toLocaleDateString('nb-NO')}
                    {article.category && ` · ${article.category.name}`}
                </p>
                <div className="bg-white rounded-xl p-6 shadow-sm whitespace-pre-wrap">
                    {article.content}
                </div>
                {article.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                        {article.tags.map(({ tag }) => (
                            <span key={tag.name} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
