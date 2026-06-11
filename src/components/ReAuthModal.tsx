import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ReAuthModal() {
    const { user, sessionExpired, reauth, logout } = useAuth();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!sessionExpired) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await reauth(password);
            setPassword('');
        } catch {
            setError('Feil passord. Prøv igjen.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        /* Backdrop — semi-transparent, blocks interaction with the page behind */
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div className="win-dialog" style={{ maxWidth: 340 }}>
                <div className="win-titlebar">
                    <div className="win-titlebar-title">
                        <span>🔒</span>
                        <span>Sesjon utløpt — EksamenKB</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="win-dialog-body">
                        <p style={{ fontSize: 12, marginBottom: 4 }}>
                            Din sesjon har utløpt. Skriv inn passordet ditt for å fortsette.
                            <br />
                            <span style={{ fontSize: 11, color: '#404040' }}>
                                Arbeidet ditt er bevart og vil bli tilgjengelig igjen etter innlogging.
                            </span>
                        </p>

                        <div style={{
                            background: '#d4d0c8',
                            border: '1px solid #808080',
                            padding: '6px 8px',
                            fontSize: 12,
                            marginBottom: 4,
                        }}>
                            <strong>Innlogget som:</strong> {user?.email}
                        </div>

                        {error && <div className="win-error">{error}</div>}

                        <div>
                            <label className="win-label">Passord:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="win-input"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="win-dialog-footer" style={{ justifyContent: 'space-between' }}>
                        <button
                            type="button"
                            className="win-btn"
                            onClick={handleLogout}
                            style={{ color: '#800000' }}
                        >
                            Logg ut
                        </button>
                        <button type="submit" disabled={loading} className="win-btn" style={{ fontWeight: 'bold', minWidth: 80 }}>
                            {loading ? 'Logger inn...' : 'OK'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
