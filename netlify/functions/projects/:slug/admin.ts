import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    try {
        const slug = event.path.split('/')[3]; // /api/projects/:slug/admin
        const token = event.queryStringParameters?.token;

        if (!slug || !token) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Missing slug or token' }),
            };
        }

        // Verify admin token
        const [project] = await sql`
      SELECT id, title, description, organizer_name, organizer_email, created_at
      FROM projects
      WHERE public_slug = ${slug}
      AND admin_token = ${token}
    `;

        if (!project) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ message: 'Invalid credentials' }),
            };
        }

        // Get all slots with booking information
        const slots = await sql`
      SELECT 
        s.id,
        s.project_id,
        s.start_datetime,
        s.duration_minutes,
        s.note,
        s.status,
        s.created_at,
        b.id as booking_id,
        b.participant_name,
        b.participant_project_name,
        b.participant_email,
        b.participant_phone,
        b.created_at as booking_created_at
      FROM slots s
      LEFT JOIN bookings b ON s.id = b.slot_id
      WHERE s.project_id = ${project.id}
      ORDER BY s.start_datetime ASC
    `;

        // Transform data to include booking info in slots
        const slotsWithBookings = slots.map(slot => ({
            id: slot.id,
            project_id: slot.project_id,
            start_datetime: slot.start_datetime,
            duration_minutes: slot.duration_minutes,
            note: slot.note,
            status: slot.status,
            created_at: slot.created_at,
            booking: slot.booking_id ? {
                id: slot.booking_id,
                slot_id: slot.id,
                project_id: slot.project_id,
                participant_name: slot.participant_name,
                participant_project_name: slot.participant_project_name,
                participant_email: slot.participant_email,
                participant_phone: slot.participant_phone,
                created_at: slot.booking_created_at,
            } : undefined,
        }));

        // Calculate stats
        const total_slots = slots.length;
        const booked_slots = slots.filter(s => s.status === 'booked').length;
        const available_slots = total_slots - booked_slots;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                project,
                slots: slotsWithBookings,
                stats: {
                    total_slots,
                    booked_slots,
                    available_slots,
                },
            }),
        };
    } catch (error) {
        console.error('Error fetching admin data:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            }),
        };
    }
};
