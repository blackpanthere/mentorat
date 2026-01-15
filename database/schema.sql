-- Orange Corners Mentorship Booking System
-- Database Schema

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    organizer_name VARCHAR(255) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    public_slug VARCHAR(100) UNIQUE NOT NULL,
    admin_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Slots table
CREATE TABLE IF NOT EXISTS slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    start_datetime TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    note TEXT,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id UUID NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    participant_name VARCHAR(255) NOT NULL,
    participant_project_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    participant_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, participant_email)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_slots_project_id ON slots(project_id);
CREATE INDEX IF NOT EXISTS idx_slots_status ON slots(status);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_project_email ON bookings(project_id, participant_email);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(public_slug);

-- Comments for documentation
COMMENT ON TABLE projects IS 'Stores mentorship project information';
COMMENT ON TABLE slots IS 'Stores individual time slots for each project';
COMMENT ON TABLE bookings IS 'Stores participant bookings for slots';
COMMENT ON CONSTRAINT bookings_project_id_participant_email_key ON bookings IS 'Ensures one booking per participant per project';
