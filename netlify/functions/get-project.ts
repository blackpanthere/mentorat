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
        // Extract slug from path: /api/get-project/abc123
        const pathParts = event.path.split('/');
        const slug = pathParts[pathParts.length - 1];

        if (!slug) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Missing project slug' }),
            };
        }

        // Get project
        const [project] = await sql`
      SELECT id, title, description, organizer_name, created_at
      FROM projects
      WHERE public_slug = ${slug}
    `;

        if (!project) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Project not found' }),
            };
        }

        // Get slots
        const slots = await sql`
      SELECT id, project_id, start_datetime, duration_minutes, note, status, created_at
      FROM slots
      WHERE project_id = ${project.id}
      ORDER BY start_datetime ASC
    `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                ...project,
                slots,
            }),
        };
    } catch (error) {
        console.error('Error fetching project:', error);
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
