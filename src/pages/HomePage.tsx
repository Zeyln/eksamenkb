import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getArticles } from '../api/articles';

interface Article {
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: string;
    author: { username: string };
    category: { name: string } | null;
}

export default function HomePage() {
    const { user, logout } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getArticles()
            .then(setArticles)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Kunnskapsbase</h1>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-sm text-gray-600">Hei, {user.username}</span>
                            <Link to="/articles/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                                Ny artikkel
                            </Link>
                            <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
                                Logg ut
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                            Logg inn
                        </Link>
                    )}
                </div>
            </nav>

            <main className="max-w mx-auto">
                {loading ? (
                    <p className="text-gray-500">Laster artikler...</p>
                ) : articles.length === 0 ? (
                    <p className="text-gray-500">Ingen artikler ennå.</p>
                ) : (
                    <div className="">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/articles/${article.id}`}
                                className="block bg-white p-4 shadow-sm hover:shadow-md hover:bg-gray-100 transition"
                            >
                                <div className="flex justify-between items-start">
                                    <h2 className="text-lg font-semibold">{article.title}</h2>
                                    <span className={`text-xs px-2 py-1 rounded-full ${article.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {article.status === 'PUBLISHED' ? 'Publisert' : 'Utkast'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Av {article.author.username} · {new Date(article.createdAt).toLocaleDateString('nb-NO')}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
