import React, { useState } from 'react';
import Header from '../components/Header';
import { createProject } from '../utils/api';
import { validateEmail, copyToClipboard } from '../utils/helpers';
import type { CreateProjectRequest } from '../types';

interface SlotInput {
    start_datetime: string;
    duration_minutes: number;
    note: string;
}

const CreateProject: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [projectUrls, setProjectUrls] = useState<{ public_url: string; admin_url: string } | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        organizer_name: '',
        organizer_email: '',
    });

    const [slots, setSlots] = useState<SlotInput[]>([
        { start_datetime: '', duration_minutes: 60, note: '' },
    ]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const addSlot = () => {
        setSlots([...slots, { start_datetime: '', duration_minutes: 60, note: '' }]);
    };

    const removeSlot = (index: number) => {
        if (slots.length > 1) {
            setSlots(slots.filter((_, i) => i !== index));
        }
    };

    const updateSlot = (index: number, field: keyof SlotInput, value: string | number) => {
        const newSlots = [...slots];
        newSlots[index] = { ...newSlots[index], [field]: value };
        setSlots(newSlots);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Le titre est requis';
        }

        if (!formData.organizer_name.trim()) {
            newErrors.organizer_name = 'Le nom de l\'organisateur est requis';
        }

        if (!formData.organizer_email.trim()) {
            newErrors.organizer_email = 'L\'email est requis';
        } else if (!validateEmail(formData.organizer_email)) {
            newErrors.organizer_email = 'Email invalide';
        }

        slots.forEach((slot, index) => {
            if (!slot.start_datetime) {
                newErrors[`slot_${index}_datetime`] = 'Date et heure requises';
            }
            if (slot.duration_minutes <= 0) {
                newErrors[`slot_${index}_duration`] = 'Durée invalide';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const requestData: CreateProjectRequest = {
                ...formData,
                slots: slots.map(slot => ({
                    start_datetime: new Date(slot.start_datetime).toISOString(),
                    duration_minutes: Number(slot.duration_minutes),
                    note: slot.note || undefined,
                })),
            };

            const response = await createProject(requestData);

            setProjectUrls({
                public_url: response.public_url,
                admin_url: response.admin_url,
            });
            setShowSuccess(true);
        } catch (error) {
            alert(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (url: string, type: string) => {
        try {
            await copyToClipboard(url);
            alert(`Lien ${type} copié!`);
        } catch (error) {
            alert('Erreur lors de la copie');
        }
    };

    if (showSuccess && projectUrls) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-oc-light to-white">
                <Header />
                <div className="max-w-3xl mx-auto px-4 py-12">
                    <div className="card text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-oc-dark mb-2">Projet créé avec succès!</h2>
                        <p className="text-oc-gray mb-8">Voici vos liens de partage</p>

                        <div className="space-y-4">
                            <div className="bg-oc-light p-4 rounded-lg">
                                <p className="text-sm font-medium text-oc-dark mb-2">Lien public (pour les entrepreneurs)</p>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={projectUrls.public_url}
                                        readOnly
                                        className="input-field flex-1 text-sm"
                                    />
                                    <button
                                        onClick={() => handleCopy(projectUrls.public_url, 'public')}
                                        className="btn-primary whitespace-nowrap"
                                    >
                                        Copier
                                    </button>
                                </div>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-lg border-2 border-oc-orange">
                                <p className="text-sm font-medium text-oc-dark mb-2">Lien admin (à garder privé)</p>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={projectUrls.admin_url}
                                        readOnly
                                        className="input-field flex-1 text-sm"
                                    />
                                    <button
                                        onClick={() => handleCopy(projectUrls.admin_url, 'admin')}
                                        className="btn-primary whitespace-nowrap"
                                    >
                                        Copier
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center space-x-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-secondary"
                            >
                                Créer un autre projet
                            </button>
                            <a
                                href={projectUrls.admin_url}
                                className="btn-primary inline-block"
                            >
                                Voir le tableau de bord
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-oc-light to-white">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-oc-dark mb-3">
                        Créer un projet de mentorat
                    </h1>
                    <p className="text-lg text-oc-gray">
                        Définissez vos créneaux et partagez le lien avec vos entrepreneurs
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="card">
                    {/* Project Details */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-oc-dark mb-4">Informations du projet</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="label">Titre du projet *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-field"
                                    placeholder="Ex: Mentorat Orange Corners – Batch 3"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="label">Description (optionnelle)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field"
                                    rows={3}
                                    placeholder="Décrivez brièvement cette session de mentorat..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Nom de l'organisateur *</label>
                                    <input
                                        type="text"
                                        value={formData.organizer_name}
                                        onChange={(e) => setFormData({ ...formData, organizer_name: e.target.value })}
                                        className="input-field"
                                        placeholder="Votre nom"
                                    />
                                    {errors.organizer_name && <p className="text-red-500 text-sm mt-1">{errors.organizer_name}</p>}
                                </div>

                                <div>
                                    <label className="label">Email de contact *</label>
                                    <input
                                        type="email"
                                        value={formData.organizer_email}
                                        onChange={(e) => setFormData({ ...formData, organizer_email: e.target.value })}
                                        className="input-field"
                                        placeholder="votre@email.com"
                                    />
                                    {errors.organizer_email && <p className="text-red-500 text-sm mt-1">{errors.organizer_email}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slots */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-oc-dark">Créneaux de mentorat</h2>
                            <button
                                type="button"
                                onClick={addSlot}
                                className="flex items-center space-x-2 text-oc-orange hover:text-opacity-80 font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Ajouter un créneau</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {slots.map((slot, index) => (
                                <div key={index} className="bg-oc-light p-4 rounded-lg relative">
                                    {slots.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSlot(index)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}

                                    <p className="text-sm font-medium text-oc-dark mb-3">Créneau {index + 1}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Date et heure *</label>
                                            <input
                                                type="datetime-local"
                                                value={slot.start_datetime}
                                                onChange={(e) => updateSlot(index, 'start_datetime', e.target.value)}
                                                className="input-field"
                                            />
                                            {errors[`slot_${index}_datetime`] && (
                                                <p className="text-red-500 text-sm mt-1">{errors[`slot_${index}_datetime`]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="label">Durée (minutes) *</label>
                                            <input
                                                type="number"
                                                value={slot.duration_minutes}
                                                onChange={(e) => updateSlot(index, 'duration_minutes', parseInt(e.target.value) || 0)}
                                                className="input-field"
                                                min="15"
                                                step="15"
                                            />
                                            {errors[`slot_${index}_duration`] && (
                                                <p className="text-red-500 text-sm mt-1">{errors[`slot_${index}_duration`]}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="label">Note (optionnelle)</label>
                                        <input
                                            type="text"
                                            value={slot.note}
                                            onChange={(e) => updateSlot(index, 'note', e.target.value)}
                                            className="input-field"
                                            placeholder="Ex: Mentor A - Zoom"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Création en cours...' : 'Créer le projet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;
