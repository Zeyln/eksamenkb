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
        <div className="win-app">
            <div className="win-titlebar">
                <div className="win-titlebar-title">
                    <span>🗂</span>
                    <span>Kategorier — EksamenKB</span>
                </div>
            </div>

            <div className="win-menubar">
                <Link to="/" className="win-menubar-item">← Tilbake</Link>
                <span className="win-menubar-item">Vis</span>
            </div>

            <div className="win-toolbar">
                <Link to="/" className="win-btn">← Tilbake til liste</Link>
            </div>

            <div className="win-content" style={{ padding: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* Category tree — left pane */}
                    <div style={{ flex: 1, minWidth: 220 }}>
                        <div className="win-panel" style={{ padding: 0 }}>
                            <div style={{
                                background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
                                color: '#fff',
                                padding: '2px 8px',
                                fontSize: 11,
                                fontWeight: 'bold',
                            }}>
                                Alle kategorier
                            </div>

                            {loading ? (
                                <div style={{ padding: 8, fontSize: 12 }}>Laster...</div>
                            ) : categories.length === 0 ? (
                                <div style={{ padding: 8, fontSize: 12, color: '#808080', fontStyle: 'italic' }}>
                                    Ingen kategorier ennå.
                                </div>
                            ) : (
                                <div className="win-tree">
                                    {categories.map((cat) => (
                                        <div key={cat.id}>
                                            <div className="win-tree-item">
                                                <span>
                                                    📁 {cat.name}
                                                    <span className="win-tree-count">({cat._count.articles})</span>
                                                </span>
                                                {user && (
                                                    <button
                                                        className="win-tree-delete"
                                                        onClick={() => handleDelete(cat.id)}
                                                    >
                                                        Slett
                                                    </button>
                                                )}
                                            </div>
                                            {cat.description && (
                                                <div style={{ paddingLeft: 24, fontSize: 11, color: '#404040' }}>
                                                    {cat.description}
                                                </div>
                                            )}
                                            {cat.children.map((child) => (
                                                <div key={child.id} className="win-tree-item win-tree-child">
                                                    <span>
                                                        📄 {child.name}
                                                        <span className="win-tree-count">({child._count?.articles ?? 0})</span>
                                                    </span>
                                                    {user && (
                                                        <button
                                                            className="win-tree-delete"
                                                            onClick={() => handleDelete(child.id)}
                                                        >
                                                            Slett
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Create form — right pane */}
                    {user && (
                        <div style={{ width: 280, flexShrink: 0 }}>
                            <div className="win-panel" style={{ padding: 0 }}>
                                <div style={{
                                    background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
                                    color: '#fff',
                                    padding: '2px 8px',
                                    fontSize: 11,
                                    fontWeight: 'bold',
                                }}>
                                    Opprett kategori
                                </div>
                                <form onSubmit={handleSubmit} style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {error && <div className="win-error">{error}</div>}

                                    <div>
                                        <label className="win-label">Navn:</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="win-input"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="win-label">Beskrivelse:</label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="win-input"
                                        />
                                    </div>

                                    <div>
                                        <label className="win-label">Underkategori av:</label>
                                        <select
                                            value={parentId}
                                            onChange={(e) => setParentId(e.target.value)}
                                            className="win-select"
                                        >
                                            <option value="">Ingen (toppnivå)</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ borderTop: '1px solid #808080', paddingTop: 8, display: 'flex', gap: 6 }}>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="win-btn"
                                            style={{ fontWeight: 'bold' }}
                                        >
                                            {submitting ? 'Oppretter...' : 'OK'}
                                        </button>
                                        <button
                                            type="button"
                                            className="win-btn"
                                            onClick={() => { setName(''); setDescription(''); setParentId(''); }}
                                        >
                                            Tilbakestill
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="win-statusbar">
                <div className="win-statusbar-cell">{categories.length} kategorier</div>
                <div className="flex-1" />
                <div className="win-statusbar-cell">
                    {user ? `Innlogget: ${user.username}` : 'Ikke innlogget'}
                </div>
            </div>
        </div>
    );
}
