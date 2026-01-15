import React from 'react';
import type { Slot } from '../types';
import { formatDate, formatTime, formatDuration } from '../utils/helpers';

interface SlotCardProps {
    slot: Slot;
    onClick?: () => void;
    showBookingInfo?: boolean;
    bookingInfo?: {
        participant_name: string;
        participant_project_name: string;
        participant_email: string;
        participant_phone?: string;
    };
}

const SlotCard: React.FC<SlotCardProps> = ({
    slot,
    onClick,
    showBookingInfo = false,
    bookingInfo
}) => {
    const isAvailable = slot.status === 'available';

    return (
        <div
            onClick={isAvailable && onClick ? onClick : undefined}
            className={`
        card relative overflow-hidden
        ${isAvailable && onClick ? 'cursor-pointer hover:scale-105 hover:border-oc-orange border-2 border-transparent' : ''}
        ${!isAvailable ? 'opacity-60 bg-gray-50' : ''}
        transition-all duration-200
      `}
        >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
                <span
                    className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${isAvailable
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }
          `}
                >
                    {isAvailable ? 'Disponible' : 'Réservé'}
                </span>
            </div>

            {/* Slot Details */}
            <div className="pr-24">
                <div className="flex items-baseline space-x-2 mb-2">
                    <svg
                        className="w-5 h-5 text-oc-orange flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-oc-dark">
                        {formatDate(slot.start_datetime)}
                    </h3>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                    <svg
                        className="w-5 h-5 text-oc-gray flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-oc-gray">
                        {formatTime(slot.start_datetime)} • {formatDuration(slot.duration_minutes)}
                    </p>
                </div>

                {slot.note && (
                    <div className="flex items-start space-x-2 mt-3 pt-3 border-t border-gray-100">
                        <svg
                            className="w-5 h-5 text-oc-gray flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-sm text-oc-gray">{slot.note}</p>
                    </div>
                )}

                {/* Booking Info (Admin View) */}
                {showBookingInfo && bookingInfo && !isAvailable && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-oc-dark mb-2">Réservé par:</p>
                        <div className="space-y-1 text-sm text-oc-gray">
                            <p><span className="font-medium">Nom:</span> {bookingInfo.participant_name}</p>
                            <p><span className="font-medium">Projet:</span> {bookingInfo.participant_project_name}</p>
                            <p><span className="font-medium">Email:</span> {bookingInfo.participant_email}</p>
                            {bookingInfo.participant_phone && (
                                <p><span className="font-medium">Tél:</span> {bookingInfo.participant_phone}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SlotCard;
