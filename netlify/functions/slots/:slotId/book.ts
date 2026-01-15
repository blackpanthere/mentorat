import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

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
        const slotId = event.path.split('/')[3]; // /api/slots/:slotId/book
        const body = JSON.parse(event.body || '{}');
        const { participant_name, participant_project_name, participant_email, participant_phone } = body;

        // Validation
        if (!participant_name || !participant_project_name || !participant_email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(participant_email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Invalid email address' }),
            };
        }

        // Get slot and project info
        const [slot] = await sql`
      SELECT id, project_id, status
      FROM slots
      WHERE id = ${slotId}
    `;

        if (!slot) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Slot not found' }),
            };
        }

        // Check if user already has a booking for this project
        const [existingBooking] = await sql`
      SELECT id
      FROM bookings
      WHERE project_id = ${slot.project_id}
      AND participant_email = ${participant_email}
    `;

        if (existingBooking) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    message: 'Vous avez déjà réservé un créneau pour cette session de mentorat.'
                }),
            };
        }

        // Use transaction to prevent race conditions
        try {
            // Lock the slot row and check availability
            const [lockedSlot] = await sql`
        SELECT id, status
        FROM slots
        WHERE id = ${slotId}
        FOR UPDATE
      `;

            if (lockedSlot.status !== 'available') {
                return {
                    statusCode: 409,
                    headers,
                    body: JSON.stringify({
                        message: 'Ce créneau vient d\'être réservé. Veuillez en choisir un autre.'
                    }),
                };
            }

            // Update slot status
            await sql`
        UPDATE slots
        SET status = 'booked'
        WHERE id = ${slotId}
      `;

            // Create booking
            const [booking] = await sql`
        INSERT INTO bookings (
          slot_id, 
          project_id, 
          participant_name, 
          participant_project_name, 
          participant_email, 
          participant_phone
        )
        VALUES (
          ${slotId},
          ${slot.project_id},
          ${participant_name},
          ${participant_project_name},
          ${participant_email},
          ${participant_phone || null}
        )
        RETURNING id
      `;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    booking_id: booking.id,
                    message: 'Booking successful',
                }),
            };
        } catch (txError) {
            console.error('Transaction error:', txError);
            throw txError;
        }
    } catch (error) {
        console.error('Error booking slot:', error);
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
