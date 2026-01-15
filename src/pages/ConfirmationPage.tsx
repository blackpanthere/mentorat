import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ConfirmationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { participantName, projectTitle } = location.state || {};

    if (!participantName || !projectTitle) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-oc-light to-white">
            <Header showNav />

            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="card text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-oc-dark mb-3">
                        Réservation confirmée !
                    </h1>

                    <p className="text-lg text-oc-gray mb-8">
                        Merci <span className="font-semibold text-oc-dark">{participantName}</span>, votre créneau a été réservé avec succès.
                    </p>

                    {/* Info Box */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8 text-left">
                        <h2 className="font-semibold text-oc-dark mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Prochaines étapes
                        </h2>
                        <ul className="space-y-2 text-oc-gray">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Vous recevrez un email de confirmation avec les détails de votre créneau</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>L'organisateur vous contactera avant la session</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Préparez vos questions pour tirer le meilleur parti de votre session de mentorat</span>
                            </li>
                        </ul>
                    </div>

                    {/* Project Info */}
                    <div className="text-sm text-oc-gray mb-8">
                        <p>Projet: <span className="font-medium text-oc-dark">{projectTitle}</span></p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
