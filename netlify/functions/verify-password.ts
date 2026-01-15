import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
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
        const { password } = body;

        // Get password from environment variable
        const correctPassword = process.env.ORGANIZER_PASSWORD || 'orangecorners2024';

        if (password === correctPassword) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true }),
            };
        } else {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ message: 'Invalid password' }),
            };
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};
