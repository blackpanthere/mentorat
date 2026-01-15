import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Verify password with backend
            const response = await fetch('/api/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                // Store auth token in sessionStorage
                sessionStorage.setItem('organizer_auth', 'true');
                navigate('/create');
            } else {
                setError('Mot de passe incorrect');
            }
        } catch (err) {
            setError('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-oc-light to-white">
            <Header />

            <div className="max-w-md mx-auto px-4 py-12">
                <div className="card">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-oc-orange rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-oc-dark mb-2">
                            Espace Organisateur
                        </h1>
                        <p className="text-oc-gray">
                            Connectez-vous pour créer des projets de mentorat
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="label">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="Entrez le mot de passe"
                                required
                                autoFocus
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-oc-gray text-center">
                            Vous êtes un entrepreneur ?{' '}
                            <span className="text-oc-orange font-medium">
                                Utilisez le lien de réservation fourni par votre organisateur
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
