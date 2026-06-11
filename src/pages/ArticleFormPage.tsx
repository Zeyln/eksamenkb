import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticle, getArticle, updateArticle } from '../api/articles';
import { getCategories } from '../api/categories';

interface Category {
    id: string;
    name: string;
    children: { id: string; name: string }[];
}

export default function ArticleFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('DRAFT');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getCategories().then(setCategories);
        if (isEditing && id) {
            getArticle(id).then((article) => {
                setTitle(article.title);
                setContent(article.content);
                setStatus(article.status);
                if (article.category) {
                    setCategoryId(article.categoryId ?? '');
                }
            });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = {
                title,
                content,
                status,
                categoryId: categoryId || undefined,
            };
            if (isEditing && id) {
                await updateArticle(id, payload);
                navigate(`/articles/${id}`);
            } else {
                const article = await createArticle(payload);
                navigate(`/articles/${article.id}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Noe gikk galt');
        } finally {
            setLoading(false);
        }
    };

    const pageTitle = isEditing ? 'Rediger artikkel' : 'Ny artikkel';

    return (
        <div className="win-app">
            <div className="win-titlebar">
                <div className="win-titlebar-title">
                    <span>✏</span>
                    <span>{pageTitle} — EksamenKB</span>
                </div>
            </div>

            <div className="win-menubar">
                <button className="win-menubar-item" onClick={() => navigate(-1)}>← Tilbake</button>
            </div>

            <div className="win-toolbar">
                <button
                    type="submit"
                    form="article-form"
                    disabled={loading}
                    className="win-btn"
                    style={{ fontWeight: 'bold' }}
                >
                    {loading ? 'Lagrer...' : isEditing ? '💾 Oppdater' : '💾 Opprett'}
                </button>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="win-btn"
                >
                    Avbryt
                </button>
            </div>

            <div className="win-content" style={{ padding: 12 }}>
                {error && <div className="win-error" style={{ marginBottom: 10 }}>{error}</div>}

                <form id="article-form" onSubmit={handleSubmit}>
                    <div className="win-panel" style={{ padding: 12 }}>

                        <div className="win-group">
                            <span className="win-group-title">Artikkelinfo</span>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <label className="win-label">Tittel:</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="win-input"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div style={{ width: 160 }}>
                                    <label className="win-label">Kategori:</label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="win-select"
                                    >
                                        <option value="">Ingen kategori</option>
                                        {categories.flatMap((cat) => [
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>,
                                            ...cat.children.map((child) => (
                                                <option key={child.id} value={child.id}>  ↳ {child.name}</option>
                                            ))
                                        ])}
                                    </select>
                                </div>
                                <div style={{ width: 120 }}>
                                    <label className="win-label">Status:</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="win-select"
                                    >
                                        <option value="DRAFT">Utkast</option>
                                        <option value="PUBLISHED">Publisert</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="win-group">
                            <span className="win-group-title">Innhold</span>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={18}
                                className="win-textarea"
                                required
                            />
                        </div>

                    </div>
                </form>
            </div>

            <div className="win-statusbar">
                <div className="win-statusbar-cell">{isEditing ? 'Redigerer' : 'Ny artikkel'}</div>
                <div className="flex-1" />
                <div className="win-statusbar-cell">{title.length} tegn i tittel</div>
                <div className="win-statusbar-cell">{content.length} tegn i innhold</div>
            </div>
        </div>
    );
}
