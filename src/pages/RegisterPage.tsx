import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(email, username, password);
            navigate('/');
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
                        <span>📋</span>
                        <span>Registrer deg — EksamenKB</span>
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
                            <label className="win-label">Brukernavn:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="win-input"
                                required
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
                            Har du allerede konto?{' '}
                            <Link to="/login" style={{ color: '#000080' }}>Logg inn</Link>
                        </p>
                    </div>

                    <div className="win-dialog-footer">
                        <button type="submit" disabled={loading} className="win-btn">
                            {loading ? 'Registrerer...' : 'OK'}
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
