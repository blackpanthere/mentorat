import type {
    CreateProjectRequest,
    CreateProjectResponse,
    ProjectWithSlots,
    BookSlotRequest,
    BookSlotResponse,
    AdminDashboardData,
} from '../types';

const API_BASE = import.meta.env.DEV ? 'http://localhost:8888/api' : '/api';

export async function createProject(data: CreateProjectRequest): Promise<CreateProjectResponse> {
    const response = await fetch(`${API_BASE}/create-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
    }

    return response.json();
}

export async function getProject(slug: string): Promise<ProjectWithSlots> {
    const response = await fetch(`${API_BASE}/projects/${slug}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch project');
    }

    return response.json();
}

export async function bookSlot(
    slotId: string,
    data: BookSlotRequest
): Promise<BookSlotResponse> {
    const response = await fetch(`${API_BASE}/slots/${slotId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to book slot');
    }

    return response.json();
}

export async function getAdminData(
    slug: string,
    token: string
): Promise<AdminDashboardData> {
    const response = await fetch(`${API_BASE}/projects/${slug}/admin?token=${encodeURIComponent(token)}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch admin data');
    }

    return response.json();
}
