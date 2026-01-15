import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SlotCard from '../components/SlotCard';
import { getProject, bookSlot } from '../utils/api';
import { validateEmail } from '../utils/helpers';
import type { ProjectWithSlots, BookSlotRequest } from '../types';

const BookingPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<ProjectWithSlots | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<BookSlotRequest>({
        participant_name: '',
        participant_project_name: '',
        participant_email: '',
        participant_phone: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadProject();
    }, [slug]);

    const loadProject = async () => {
        if (!slug) return;

        try {
            const data = await getProject(slug);
            setProject(data);
        } catch (error) {
            alert(`Erreur: ${error instanceof Error ? error.message : 'Projet introuvable'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotClick = (slotId: string) => {
        setSelectedSlotId(slotId);
        setShowBookingForm(true);
    };

    const closeForm = () => {
        setShowBookingForm(false);
        setSelectedSlotId(null);
        setFormData({
            participant_name: '',
            participant_project_name: '',
            participant_email: '',
            participant_phone: '',
        });
        setErrors({});
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.participant_name.trim()) {
            newErrors.participant_name = 'Le nom est requis';
        }

        if (!formData.participant_project_name.trim()) {
            newErrors.participant_project_name = 'Le nom du projet est requis';
        }

        if (!formData.participant_email.trim()) {
            newErrors.participant_email = 'L\'email est requis';
        } else if (!validateEmail(formData.participant_email)) {
            newErrors.participant_email = 'Email invalide';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate() || !selectedSlotId) {
            return;
        }

        setSubmitting(true);

        try {
            await bookSlot(selectedSlotId, formData);

            // Navigate to confirmation page
            navigate(`/booking/${slug}/confirmation`, {
                state: {
                    slotId: selectedSlotId,
                    participantName: formData.participant_name,
                    projectTitle: project?.title,
                },
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';

            if (errorMessage.includes('déjà réservé') || errorMessage.includes('already booked')) {
                alert('Ce créneau vient d\'être réservé par quelqu\'un d\'autre. Veuillez en choisir un autre.');
                closeForm();
                loadProject(); // Refresh to show updated availability
            } else if (errorMessage.includes('Vous avez déjà') || errorMessage.includes('already have')) {
                alert('Vous avez déjà réservé un créneau pour cette session de mentorat.');
                closeForm();
            } else {
                alert(`Erreur: ${errorMessage}`);
            }
        } finally {
            setSubmitting(false);
        }
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

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-oc-light to-white">
                <Header showNav />
                <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-oc-dark mb-4">Projet introuvable</h1>
                    <p className="text-oc-gray">Le lien que vous avez suivi n'est pas valide.</p>
                </div>
            </div>
        );
    }

    const availableSlots = project.slots.filter(s => s.status === 'available');
    const bookedSlots = project.slots.filter(s => s.status === 'booked');

    return (
        <div className="min-h-screen bg-gradient-to-br from-oc-light to-white">
            <Header showNav />

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Project Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-oc-dark mb-3">
                        {project.title}
                    </h1>
                    {project.description && (
                        <p className="text-lg text-oc-gray max-w-3xl mx-auto">
                            {project.description}
                        </p>
                    )}
                    <div className="mt-6 inline-flex items-center space-x-4 text-sm text-oc-gray">
                        <span className="flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            {availableSlots.length} disponible{availableSlots.length > 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center">
                            <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                            {bookedSlots.length} réservé{bookedSlots.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Slots Grid */}
                {availableSlots.length === 0 ? (
                    <div className="card text-center py-12">
                        <svg className="w-16 h-16 text-oc-gray mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-oc-dark mb-2">Aucun créneau disponible</h2>
                        <p className="text-oc-gray">Tous les créneaux ont été réservés.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {project.slots
                            .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
                            .map((slot) => (
                                <SlotCard
                                    key={slot.id}
                                    slot={slot}
                                    onClick={slot.status === 'available' ? () => handleSlotClick(slot.id) : undefined}
                                />
                            ))}
                    </div>
                )}
            </div>

            {/* Booking Form Modal */}
            {showBookingForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-oc-dark">Réserver ce créneau</h2>
                            <button
                                onClick={closeForm}
                                className="text-oc-gray hover:text-oc-dark"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="participant_name" className="label">Votre nom *</label>
                                <input
                                    id="participant_name"
                                    name="participant_name"
                                    type="text"
                                    value={formData.participant_name}
                                    onChange={(e) => setFormData({ ...formData, participant_name: e.target.value })}
                                    className="input-field"
                                    placeholder="Ex: Jean Dupont"
                                    required
                                    autoComplete="name"
                                />{errors.participant_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.participant_name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="participant_project_name" className="label">Nom de votre projet/startup *</label>
                                <input
                                    id="participant_project_name"
                                    name="participant_project_name"
                                    type="text"
                                    value={formData.participant_project_name}
                                    onChange={(e) => setFormData({ ...formData, participant_project_name: e.target.value })}
                                    className="input-field"
                                    placeholder="Ex: Mon Startup"
                                    required
                                    autoComplete="organization"
                                />{errors.participant_project_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.participant_project_name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="participant_email" className="label">Email *</label>
                                <input
                                    id="participant_email"
                                    name="participant_email"
                                    type="email"
                                    value={formData.participant_email}
                                    onChange={(e) => setFormData({ ...formData, participant_email: e.target.value })}
                                    className="input-field"
                                    placeholder="votre@email.com"
                                    required
                                    autoComplete="email"
                                />{errors.participant_email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.participant_email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="participant_phone" className="label">Téléphone (optionnel)</label>
                                <input
                                    id="participant_phone"
                                    name="participant_phone"
                                    type="tel"
                                    value={formData.participant_phone}
                                    onChange={(e) => setFormData({ ...formData, participant_phone: e.target.value })}
                                    className="input-field"
                                    placeholder="+33 6 12 34 56 78"
                                    autoComplete="tel"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="btn-secondary flex-1"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary flex-1 disabled:opacity-50"
                                >
                                    {submitting ? 'Réservation...' : 'Confirmer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingPage;
