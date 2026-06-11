import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname ?? '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Noe gikk galt');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="win-dialog-backdrop">
            <div className="win-dialog">
                <div className="win-titlebar">
                    <div className="win-titlebar-title">
                        <span>🔐</span>
                        <span>Logg inn — EksamenKB</span>
                    </div>
                    <div className="flex gap-0.5">
                        <Link to="/" className="win-titlebar-btn" title="Tilbake">✕</Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="win-dialog-body">
                        {error && <div className="win-error">{error}</div>}

                        <div>
                            <label className="win-label">E-post:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="win-input"
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="win-label">Passord:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="win-input"
                                required
                            />
                        </div>

                        <p style={{ fontSize: 11, color: '#404040', marginTop: 4 }}>
                            Ingen konto?{' '}
                            <Link to="/register" style={{ color: '#000080' }}>Registrer deg</Link>
                        </p>
                    </div>

                    <div className="win-dialog-footer">
                        <button type="submit" disabled={loading} className="win-btn">
                            {loading ? 'Logger inn...' : 'OK'}
                        </button>
                        <Link to="/" className="win-btn" style={{ textAlign: 'center' }}>
                            Avbryt
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
