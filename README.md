# Orange Corners - Mentorship Booking System

A complete web application for managing mentorship booking sessions for the Orange Corners entrepreneurship program. Built with React, TypeScript, Tailwind CSS, and deployed on Netlify with serverless functions and PostgreSQL database.

## Features

### For Organizers
- Create mentorship projects with multiple time slots
- Generate unique public booking links
- Secure admin dashboard with statistics
- Track reservations in real-time
- Export booking data to CSV
- Mobile-responsive interface

### For Entrepreneurs
- View available mentorship slots
- Book one-on-one sessions
- Automatic duplicate booking prevention
- Instant confirmation
- Mobile-friendly booking experience

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom Orange Corners branding
- **Backend**: Netlify Functions (serverless)
- **Database**: PostgreSQL (Neon recommended)
- **Routing**: React Router
- **Deployment**: Netlify

## Prerequisites

- Node.js 18+ and npm
- A Neon PostgreSQL database (or any PostgreSQL provider)
- Netlify account (for deployment)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
cd /Volumes/sms/Orangecornermentorat
npm install
```

### 2. Set Up Database

Create a PostgreSQL database on [Neon](https://neon.tech) (free tier available).

Run the database schema:

```bash
# Connect to your database and run:
psql <your-database-url> < database/schema.sql
```

Or manually execute the SQL in `database/schema.sql` using your database provider's console.

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your database URL:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### 4. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 5. Run Development Server

```bash
netlify dev
```

This will start:
- Frontend dev server on `http://localhost:8888`
- Netlify Functions on `http://localhost:8888/api/*`

## Project Structure

```
/Volumes/sms/Orangecornermentorat/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Header.tsx
│   │   └── SlotCard.tsx
│   ├── pages/           # Page components
│   │   ├── CreateProject.tsx
│   │   ├── BookingPage.tsx
│   │   ├── ConfirmationPage.tsx
│   │   └── AdminDashboard.tsx
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions and API client
│   ├── App.tsx          # Main app with routing
│   └── index.css        # Global styles and design system
├── netlify/
│   └── functions/       # Serverless API endpoints
│       ├── create-project.ts
│       ├── projects/:slug.ts
│       ├── slots/:slotId/book.ts
│       └── projects/:slug/admin.ts
├── database/
│   └── schema.sql       # PostgreSQL database schema
├── public/              # Static assets
└── netlify.toml         # Netlify configuration
```

## API Endpoints

### POST `/api/create-project`
Create a new mentorship project with slots.

**Request:**
```json
{
  "title": "Mentorat Orange Corners – Batch 3",
  "description": "Session de mentorat...",
  "organizer_name": "John Doe",
  "organizer_email": "john@example.com",
  "slots": [
    {
      "start_datetime": "2026-02-15T10:00:00Z",
      "duration_minutes": 60,
      "note": "Mentor A - Zoom"
    }
  ]
}
```

**Response:**
```json
{
  "project_id": "uuid",
  "public_slug": "abc123",
  "admin_token": "token",
  "public_url": "https://site.com/booking/abc123",
  "admin_url": "https://site.com/admin/abc123?token=..."
}
```

### GET `/api/projects/:slug`
Get project details and available slots (public endpoint).

### POST `/api/slots/:slotId/book`
Book a specific slot.

**Request:**
```json
{
  "participant_name": "Jean Dupont",
  "participant_project_name": "Mon Projet",
  "participant_email": "jean@example.com",
  "participant_phone": "+33 6 12 34 56 78"
}
```

### GET `/api/projects/:slug/admin?token=xxx`
Get admin dashboard data (requires admin token).

## Deployment to Netlify

### 1. Connect Repository

```bash
netlify init
```

Follow the prompts to connect your repository.

### 2. Set Environment Variables

In Netlify dashboard, go to **Site settings > Environment variables** and add:

```
DATABASE_URL=your_neon_database_url
```

### 3. Deploy

```bash
netlify deploy --prod
```

Or push to your connected Git repository for automatic deployment.

## Usage Guide

### Creating a Mentorship Project

1. Visit the homepage
2. Fill in project details (title, description, organizer info)
3. Add time slots with date, time, duration, and optional notes
4. Click "Créer le projet"
5. Copy the public link to share with entrepreneurs
6. Save the admin link for tracking bookings

### Booking a Slot (Entrepreneur)

1. Open the public booking link
2. View available slots
3. Click on a desired slot
4. Fill in your details (name, project, email, phone)
5. Confirm booking
6. Receive confirmation

### Managing Bookings (Organizer)

1. Open the admin link (with token)
2. View statistics and booking status
3. Filter slots by status
4. Export bookings to CSV

## Key Features

### Concurrency Control
The booking system uses database row-level locking to prevent double bookings when multiple users try to book the same slot simultaneously.

### Duplicate Prevention
Each entrepreneur can only book one slot per project (enforced by email address).

### Mobile-First Design
Fully responsive interface optimized for mobile devices.

### Security
- Admin access protected by secure tokens
- CORS enabled for API endpoints
- Input validation on all forms

## Customization

### Brand Colors
Edit `tailwind.config.js` to customize colors:

```javascript
colors: {
  'oc-orange': '#FF6B35',  // Primary orange
  'oc-dark': '#2D3142',    // Dark text
  'oc-gray': '#4F5D75',    // Secondary gray
  'oc-light': '#F8F9FA',   // Light background
}
```

### Logo
Replace `/public/orange-corners-logo.svg` with your own logo.

## Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is correctly set in `.env` (local) and Netlify environment variables (production)
- Check that your database allows connections from Netlify's IP ranges

### Functions Not Working Locally
- Make sure you're using `netlify dev` instead of `npm run dev`
- Check that `netlify.toml` is properly configured

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)

## License

MIT

## Support

For issues or questions, contact the Orange Corners program organizers.
