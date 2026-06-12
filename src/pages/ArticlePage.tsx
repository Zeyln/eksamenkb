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

    if (loading) return (
        <div className="win-app">
            <div className="win-titlebar">
                <div className="win-titlebar-title"><span>▦</span><span>EksamenKB</span></div>
            </div>
            <div className="win-content p-2">Laster...</div>
        </div>
    );

    if (!article) return (
        <div className="win-app">
            <div className="win-titlebar">
                <div className="win-titlebar-title"><span>▦</span><span>EksamenKB</span></div>
            </div>
            <div className="win-content p-2">Artikkel ikke funnet.</div>
        </div>
    );

    //Deprecated feature
    //const isAuthor = user?.id === article.author.id;

    return (
        <div className="win-app">
            <div className="win-titlebar">
                <div className="win-titlebar-title">
                    <span>📄</span>
                    <span>{article.title} — EksamenKB</span>
                </div>
            </div>

            <div className="win-toolbar">
                <Link to="/" className="win-btn">← Tilbake til liste</Link>
                {!!user && (
                    <>
                        <div className="win-toolbar-sep" />
                        <Link to={`/articles/${id}/edit`} className="win-btn">✏ Rediger</Link>
                        <button onClick={handleDelete} className="win-btn win-btn-danger">✕ Slett</button>
                    </>
                )}
            </div>

            <div className="win-article-meta">
                <span>Av: <strong>{article.author.username}</strong></span>
                <span style={{ color: '#808080' }}>|</span>
                <span>{new Date(article.createdAt).toLocaleDateString('nb-NO')}</span>
                {article.category && (
                    <>
                        <span style={{ color: '#808080' }}>|</span>
                        <span>Kategori: <strong>{article.category.name}</strong></span>
                    </>
                )}
                <span style={{ color: '#808080' }}>|</span>
                <span className={`win-tag ${article.status === 'PUBLISHED' ? 'win-tag-published' : 'win-tag-draft'}`}>
                    {article.status === 'PUBLISHED' ? 'Publisert' : 'Utkast'}
                </span>
            </div>

            <div className="win-content" style={{ padding: 12 }}>
                <div className="win-sunken" style={{ marginBottom: 8 }}>
                    <div className="win-article-body">
                        {article.content}
                    </div>
                </div>

                {article.tags.length > 0 && (
                    <div className="win-group">
                        <span className="win-group-title">Tagger</span>
                        <div className="flex gap-1 flex-wrap">
                            {article.tags.map(({ tag }) => (
                                <span
                                    key={tag.name}
                                    style={{
                                        background: '#d4d0c8',
                                        border: '1px solid #000',
                                        boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080',
                                        padding: '1px 8px',
                                        fontSize: 11,
                                    }}
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="win-statusbar">
                <div className="win-statusbar-cell">Klar</div>
                <div className="flex-1" />
                <div className="win-statusbar-cell">
                    {user ? `Innlogget: ${user.username}` : 'Ikke innlogget'}
                </div>
            </div>
        </div>
    );
}
