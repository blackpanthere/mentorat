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
        // Extract slug from path - find it after 'get-admin' or 'admin'
        const pathParts = event.path.split('/').filter(p => p);

        let slug;
        const adminIndex = pathParts.findIndex(p => p === 'get-admin' || p === 'admin');
        if (adminIndex >= 0 && adminIndex < pathParts.length - 1) {
            slug = pathParts[adminIndex + 1];
        } else {
            // Fallback: take last segment
            slug = pathParts[pathParts.length - 1];
        }

        const token = event.queryStringParameters?.token;

        console.log('=== ADMIN REQUEST DEBUG ===');
        console.log('Full path:', event.path);
        console.log('Path parts:', pathParts);
        console.log('Admin index:', adminIndex);
        console.log('Slug extracted:', slug);
        console.log('Token received:', token ? `${token.substring(0, 10)}...` : 'NONE');
        console.log('Query params:', event.queryStringParameters);

        if (!slug || !token) {
            console.log('ERROR: Missing slug or token');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    message: 'Missing slug or token',
                    debug: {
                        slug,
                        hasToken: !!token,
                        path: event.path,
                        pathParts
                    }
                }),
            };
        }

        // Verify admin token
        const [project] = await sql`
            SELECT id, title, description, organizer_name, organizer_email, created_at, admin_token
            FROM projects
            WHERE public_slug = ${slug}
        `;

        console.log('Project found:', project ? 'YES' : 'NO');
        if (project) {
            console.log('Project ID:', project.id);
            console.log('Project title:', project.title);
        }

        if (!project) {
            console.log('ERROR: Project not found for slug:', slug);
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Project not found' }),
            };
        }

        // Check token separately for better debugging
        const tokenMatch = project.admin_token === token;
        console.log('Token comparison:');
        console.log('  Expected (first 10):', project.admin_token.substring(0, 10));
        console.log('  Received (first 10):', token.substring(0, 10));
        console.log('  Match:', tokenMatch ? 'YES' : 'NO');
        console.log('  Expected length:', project.admin_token.length);
        console.log('  Received length:', token.length);

        if (!tokenMatch) {
            console.log('ERROR: Token mismatch');
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ message: 'Invalid credentials' }),
            };
        }

        console.log('SUCCESS: Authentication passed');

        // Get all slots with booking information
        const slots = await sql`
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
                project: {
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    organizer_name: project.organizer_name,
                    organizer_email: project.organizer_email,
                    created_at: project.created_at,
                },
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
