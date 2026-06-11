import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getArticles } from '../api/articles';
import { getCategories } from '../api/categories';
import Select from 'react-select';

interface Article {
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: string;
    author: { username: string };
    category: { id: string; name: string } | null;
}

interface Category {
    id: string;
    name: string;
    children: { id: string; name: string }[];
}

export default function HomePage() {
    const { user, logout } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<{ value: string; label: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getArticles(), getCategories()])
            .then(([arts, cats]) => {
                setArticles(arts);
                setCategories(cats);
            })
            .finally(() => setLoading(false));
    }, []);

    const categoryOptions = categories.flatMap((cat) => [
        { value: cat.id, label: cat.name },
        ...cat.children.map((child) => ({ value: child.id, label: `↳ ${child.name}` }))
    ]);

    const filtered = selectedCategory
        ? articles.filter((a) => a.category?.id === selectedCategory.value)
        : articles;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Kunnskapsbase</h1>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to="/categories" className="text-sm text-gray-600 hover:text-gray-900">
                                Kategorier
                            </Link>
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

            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-6 w-72">
                    <Select
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={(val) => setSelectedCategory(val)}
                        isClearable
                        placeholder="Velg kategori..."
                        noOptionsMessage={() => 'Ingen kategorier funnet'}
                    />
                </div>

                {loading ? (
                    <p className="text-gray-500">Laster artikler...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-gray-500">Ingen artikler her ennå.</p>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((article) => (
                            <Link
                                key={article.id}
                                to={`/articles/${article.id}`}
                                className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
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
                                    {article.category && ` · ${article.category.name}`}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
