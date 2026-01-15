import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';
import { customAlphabet } from 'nanoid';
import crypto from 'crypto';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

const sql = neon(process.env.DATABASE_URL!);

export const handler: Handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { title, description, organizer_name, organizer_email, slots } = body;

        // Validation
        if (!title || !organizer_name || !organizer_email || !slots || slots.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        // Generate unique slug and admin token
        const public_slug = nanoid();
        const admin_token = crypto.randomBytes(32).toString('hex');

        // Create project
        const [project] = await sql`
      INSERT INTO projects (title, description, organizer_name, organizer_email, public_slug, admin_token)
      VALUES (${title}, ${description || null}, ${organizer_name}, ${organizer_email}, ${public_slug}, ${admin_token})
      RETURNING id
    `;

        // Create slots
        for (const slot of slots) {
            await sql`
        INSERT INTO slots (project_id, start_datetime, duration_minutes, note, status)
        VALUES (
          ${project.id}, 
          ${slot.start_datetime}, 
          ${slot.duration_minutes}, 
          ${slot.note || null}, 
          'available'
        )
      `;
        }

        // Generate URLs
        const baseUrl = event.headers.origin || 'https://your-site.netlify.app';
        const public_url = `${baseUrl}/booking/${public_slug}`;
        const admin_url = `${baseUrl}/admin/${public_slug}?token=${admin_token}`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                project_id: project.id,
                public_slug,
                admin_token,
                public_url,
                admin_url,
            }),
        };
    } catch (error) {
        console.error('Error creating project:', error);
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
