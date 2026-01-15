export interface Project {
    id: string;
    title: string;
    description?: string;
    organizer_name: string;
    organizer_email: string;
    public_slug: string;
    admin_token: string;
    created_at: string;
}

export interface Slot {
    id: string;
    project_id: string;
    start_datetime: string;
    duration_minutes: number;
    note?: string;
    status: 'available' | 'booked';
    created_at: string;
}

export interface Booking {
    id: string;
    slot_id: string;
    project_id: string;
    participant_name: string;
    participant_project_name: string;
    participant_email: string;
    participant_phone?: string;
    created_at: string;
}

export interface CreateProjectRequest {
    title: string;
    description?: string;
    organizer_name: string;
    organizer_email: string;
    slots: {
        start_datetime: string;
        duration_minutes: number;
        note?: string;
    }[];
}

export interface CreateProjectResponse {
    project_id: string;
    public_slug: string;
    admin_token: string;
    public_url: string;
    admin_url: string;
}

export interface BookSlotRequest {
    participant_name: string;
    participant_project_name: string;
    participant_email: string;
    participant_phone?: string;
}

export interface BookSlotResponse {
    success: boolean;
    booking_id?: string;
    message?: string;
}

export interface ProjectWithSlots extends Project {
    slots: SlotWithBooking[];
}

export interface SlotWithBooking extends Slot {
    booking?: Booking;
}

export interface AdminDashboardData {
    project: Project;
    slots: SlotWithBooking[];
    stats: {
        total_slots: number;
        booked_slots: number;
        available_slots: number;
    };
}
