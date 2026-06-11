import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getArticles } from '../api/articles';
import { getCategories } from '../api/categories';

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
    const navigate = useNavigate();
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getArticles(), getCategories()])
            .then(([arts, cats]) => {
                setArticles(arts);
                setCategories(cats);
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = selectedCategory
        ? articles.filter((a) => a.category?.id === selectedCategory)
        : articles;

    return (
        <div className="win-app">
            <div className="win-titlebar">
                <div className="win-titlebar-title">
                    <span>Kunnskapsbase — EksamenKB</span>
                </div>
                {user && <span style={{ fontSize: 12, opacity: 0.75 }}>{user.username}</span>}
            </div>

            <div className="win-menubar">
                <Link to="/" className="win-menubar-item">Hjem</Link>
                <Link to="/categories" className="win-menubar-item">Kategorier</Link>
                <div className="flex-1" />
                {user ? (
                    <button onClick={logout} className="win-menubar-item">
                        Logg ut
                    </button>
                ) : (
                    <Link to="/login" className="win-menubar-item">Logg inn</Link>
                )}
            </div>

            <div className="win-toolbar">
                {user && (
                    <>
                        <Link to="/articles/new" className="win-btn win-btn-primary">+ Ny artikkel</Link>
                        <div className="win-toolbar-sep" />
                    </>
                )}
                <span className="win-toolbar-label" style={{ fontSize: 12, color: '#64748b' }}>Kategori:</span>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="win-select"
                    style={{ width: 200 }}
                >
                    <option value="">Alle kategorier</option>
                    {categories.flatMap((cat) => [
                        <option key={cat.id} value={cat.id}>{cat.name}</option>,
                        ...cat.children.map((child) => (
                            <option key={child.id} value={child.id}>  ↳ {child.name}</option>
                        ))
                    ])}
                </select>
                {selectedCategory && (
                    <button className="win-btn" onClick={() => setSelectedCategory('')}>✕ Fjern filter</button>
                )}
            </div>

            <div className="win-content">
                {loading ? (
                    <div className="p-4" style={{ color: '#64748b' }}>Laster artikler...</div>
                ) : (
                    <div className="win-sheet-wrapper">
                        <table className="win-sheet">
                            <thead>
                                <tr>
                                    <th className="col-rn">#</th>
                                    <th style={{ minWidth: 280 }}>Tittel</th>
                                    <th style={{ width: 140 }}>Forfatter</th>
                                    <th style={{ width: 100 }}>Dato</th>
                                    <th style={{ width: 160 }}>Kategori</th>
                                    <th style={{ width: 100 }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td className="col-rn">—</td>
                                        <td colSpan={5} style={{ color: '#94a3b8', fontStyle: 'italic', maxWidth: 'none' }}>
                                            Ingen artikler her ennå.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((article, i) => (
                                        <tr
                                            key={article.id}
                                            onClick={() => navigate(`/articles/${article.id}`)}
                                        >
                                            <td className="col-rn">{i + 1}</td>
                                            <td style={{ fontWeight: 500 }}>{article.title}</td>
                                            <td style={{ color: '#475569' }}>{article.author.username}</td>
                                            <td style={{ color: '#475569' }}>{new Date(article.createdAt).toLocaleDateString('nb-NO')}</td>
                                            <td style={{ color: '#475569' }}>{article.category?.name ?? '—'}</td>
                                            <td>
                                                <span className={`win-tag ${article.status === 'PUBLISHED' ? 'win-tag-published' : 'win-tag-draft'}`}>
                                                    {article.status === 'PUBLISHED' ? 'Publisert' : 'Utkast'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="win-statusbar">
                <div className="win-statusbar-cell">{filtered.length} artikler</div>
                {selectedCategory && <div className="win-statusbar-cell">Filtrert</div>}
                <div className="flex-1" />
                <div className="win-statusbar-cell">
                    {user ? `Innlogget: ${user.username}` : 'Ikke innlogget'}
                </div>
            </div>
        </div>
    );
}
