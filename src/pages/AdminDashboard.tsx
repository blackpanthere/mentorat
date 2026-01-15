import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import SlotCard from '../components/SlotCard';
import { getAdminData } from '../utils/api';
import { exportToCSV } from '../utils/helpers';
import type { AdminDashboardData } from '../types';

const AdminDashboard: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'available' | 'booked'>('all');

    useEffect(() => {
        loadData();
    }, [slug, token]);

    const loadData = async () => {
        if (!slug || !token) {
            alert('Lien invalide');
            setLoading(false);
            return;
        }

        try {
            const adminData = await getAdminData(slug, token);
            setData(adminData);
        } catch (error) {
            alert(`Erreur: ${error instanceof Error ? error.message : 'Accès refusé'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!data) return;

        const exportData = data.slots
            .filter(slot => slot.status === 'booked' && slot.booking)
            .map(slot => ({
                Date: new Date(slot.start_datetime).toLocaleDateString('fr-FR'),
                Heure: new Date(slot.start_datetime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                Durée: `${slot.duration_minutes} min`,
                Note: slot.note || '',
                Participant: slot.booking!.participant_name,
                Projet: slot.booking!.participant_project_name,
                Email: slot.booking!.participant_email,
                Téléphone: slot.booking!.participant_phone || '',
            }));

        exportToCSV(exportData, `mentorat-${slug}-${new Date().toISOString().split('T')[0]}.csv`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-oc-light to-white">
                <Header showNav />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oc-orange mx-auto mb-4"></div>
                        <p className="text-oc-gray">Chargement...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-oc-light to-white">
                <Header showNav />
                <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-oc-dark mb-4">Accès refusé</h1>
                    <p className="text-oc-gray">Vous n'avez pas les permissions pour accéder à cette page.</p>
                </div>
            </div>
        );
    }

    const filteredSlots = data.slots.filter(slot => {
        if (filter === 'all') return true;
        return slot.status === filter;
    });

    const percentage = data.stats.total_slots > 0
        ? Math.round((data.stats.booked_slots / data.stats.total_slots) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-oc-light to-white">
            <Header showNav />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-oc-dark mb-2">
                        Tableau de bord
                    </h1>
                    <p className="text-lg text-oc-gray">{data.project.title}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-oc-gray mb-1">Total créneaux</p>
                                <p className="text-3xl font-bold text-oc-dark">{data.stats.total_slots}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-oc-gray mb-1">Réservés</p>
                                <p className="text-3xl font-bold text-green-600">{data.stats.booked_slots}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-oc-gray mb-1">Disponibles</p>
                                <p className="text-3xl font-bold text-oc-orange">{data.stats.available_slots}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-oc-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="card mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-oc-dark">Taux de réservation</p>
                        <p className="text-sm font-bold text-oc-orange">{percentage}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="gradient-orange h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Filters and Export */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                    ? 'bg-oc-orange text-white'
                                    : 'bg-white text-oc-gray border-2 border-gray-200 hover:border-oc-orange'
                                }`}
                        >
                            Tous ({data.stats.total_slots})
                        </button>
                        <button
                            onClick={() => setFilter('booked')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'booked'
                                    ? 'bg-oc-orange text-white'
                                    : 'bg-white text-oc-gray border-2 border-gray-200 hover:border-oc-orange'
                                }`}
                        >
                            Réservés ({data.stats.booked_slots})
                        </button>
                        <button
                            onClick={() => setFilter('available')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'available'
                                    ? 'bg-oc-orange text-white'
                                    : 'bg-white text-oc-gray border-2 border-gray-200 hover:border-oc-orange'
                                }`}
                        >
                            Disponibles ({data.stats.available_slots})
                        </button>
                    </div>

                    <button
                        onClick={handleExport}
                        className="btn-secondary flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Exporter CSV</span>
                    </button>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSlots
                        .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
                        .map((slot) => (
                            <SlotCard
                                key={slot.id}
                                slot={slot}
                                showBookingInfo={true}
                                bookingInfo={slot.booking}
                            />
                        ))}
                </div>

                {filteredSlots.length === 0 && (
                    <div className="card text-center py-12">
                        <p className="text-oc-gray">Aucun créneau à afficher</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
