-- =============================================================================
-- HERHUB - PRODUCTION POSTGRESQL SCHEMA FOR SUPABASE CLOUD
-- National Level Hackathon Edition
-- Tables: profiles, emergency_contacts, sos_incidents, solo_trips, vehicle_scans, awareness_posts
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (User Profile & Primary Guardian Contact)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT UNIQUE,
    full_name TEXT NOT NULL DEFAULT 'Ananya Sharma',
    avatar_initial TEXT DEFAULT 'A',
    primary_phone TEXT DEFAULT '+91 98765 00000',
    guardian_name TEXT NOT NULL DEFAULT 'Rajesh Sharma (Papa)',
    guardian_phone TEXT NOT NULL DEFAULT '+91 75240 72395',
    guardian_relation TEXT DEFAULT 'Father',
    emergency_pin TEXT DEFAULT '9999',
    safe_home_address TEXT DEFAULT 'Civil Lines, Varanasi, Uttar Pradesh',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. EMERGENCY CONTACTS TABLE
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    relation TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    avatar_letter TEXT DEFAULT 'C',
    color_hex TEXT DEFAULT '#EC4899',
    notify_on_sos BOOLEAN DEFAULT true,
    share_live_gps BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SOS INCIDENTS TABLE (High-Priority Telemetry Logs)
CREATE TABLE IF NOT EXISTS public.sos_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    trigger_type TEXT NOT NULL, -- 'navbar_bell', 'voice_sentinel', 'gesture', 'solo_trip'
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    accuracy_meters TEXT DEFAULT '5m',
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'dispatched', 'resolved', 'cancelled'
    guardian_phone TEXT NOT NULL DEFAULT '+91 75240 72395',
    whatsapp_dispatched BOOLEAN DEFAULT false,
    siren_decibels INTEGER DEFAULT 105,
    nearest_police_thana TEXT DEFAULT 'Cantonment Police Station (112)',
    battery_level INTEGER DEFAULT 92,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 4. SOLO TRIPS TABLE (Where Is My Train & Transit Guardian)
CREATE TABLE IF NOT EXISTS public.solo_trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    trip_title TEXT NOT NULL,
    origin_city TEXT NOT NULL,
    origin_station TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    destination_station TEXT NOT NULL,
    train_number TEXT NOT NULL,
    train_name TEXT NOT NULL,
    coach_number TEXT DEFAULT 'C3',
    seat_number TEXT DEFAULT '24',
    guardian_phone TEXT DEFAULT '+91 75240 72395',
    trip_status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'in_transit', 'safely_completed', 'sos_triggered'
    checkins_completed INTEGER DEFAULT 0,
    departure_time TEXT,
    arrival_time TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. VEHICLE SCANS TABLE (HerScan 360 AI Camera & Child Lock Audits)
CREATE TABLE IF NOT EXISTS public.vehicle_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plate_number TEXT NOT NULL,
    state_code TEXT NOT NULL,
    rto_office TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    vehicle_class TEXT NOT NULL,
    registered_owner TEXT NOT NULL,
    father_name TEXT,
    commercial_permit_no TEXT,
    permit_valid_until TEXT,
    child_lock_hazard BOOLEAN NOT NULL DEFAULT false,
    child_lock_status TEXT NOT NULL,
    window_tint_compliance TEXT NOT NULL,
    police_cleared BOOLEAN NOT NULL DEFAULT true,
    ncrb_status TEXT DEFAULT 'CLEAN / VERIFIED',
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. AWARENESS POSTS TABLE (Community Safety Wall)
CREATE TABLE IF NOT EXISTS public.awareness_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_alias TEXT NOT NULL DEFAULT 'Anonymous Sister',
    city TEXT NOT NULL DEFAULT 'Varanasi',
    locality TEXT NOT NULL DEFAULT 'Assi Ghat Road',
    category TEXT NOT NULL DEFAULT 'Night Safety', -- 'Night Safety', 'Street Lighting', 'Safe Cab', 'Police Beat'
    report_text TEXT NOT NULL,
    upvotes INTEGER DEFAULT 42,
    police_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- SEED SAMPLE DATA (Initial Hackathon Records)
-- =============================================================================

-- Default Profile
INSERT INTO public.profiles (
    id, user_email, full_name, avatar_initial, primary_phone, guardian_name, guardian_phone, guardian_relation
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ananya.sharma@herhub.safety',
    'Ananya Sharma',
    'A',
    '+91 98765 43210',
    'Rajesh Sharma (Papa)',
    '+91 75240 72395',
    'Father'
) ON CONFLICT (id) DO NOTHING;

-- Emergency Contacts Seed
INSERT INTO public.emergency_contacts (profile_id, contact_name, relation, phone_number, avatar_letter, color_hex, notify_on_sos)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rajesh Sharma (Papa)', 'Father / Primary Guardian', '+91 75240 72395', 'P', '#EC4899', true),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rahul Bhaiya', 'Brother', '+91 91234 56789', 'R', '#7C3AED', true),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'National Police Help (ERSS)', 'Police Emergency', '112', '1', '#EF4444', true),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Railway Police Security (RPF)', 'Train Police', '139', 'R', '#2563EB', true)
ON CONFLICT DO NOTHING;

-- Sample Past Trips
INSERT INTO public.solo_trips (profile_id, trip_title, origin_city, origin_station, destination_city, destination_station, train_number, train_name, trip_status, checkins_completed)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Delhi to Jaipur Solo Cultural Voyage', 'Delhi', 'Delhi Cantt (DEC)', 'Jaipur', 'Jaipur Junction (JP)', '20978', 'Delhi Cantt - Ajmer Vande Bharat Express', 'safely_completed', 5),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Varanasi to Lucknow Transit', 'Varanasi', 'Varanasi Junction (BSB)', 'Lucknow', 'Lucknow Charbagh (LKO)', '14203', 'Lucknow Intercity Express', 'safely_completed', 4)
ON CONFLICT DO NOTHING;

-- Sample Awareness Posts
INSERT INTO public.awareness_posts (author_alias, city, locality, category, report_text, upvotes, police_verified)
VALUES
    ('Anonymous Sister #408', 'Varanasi', 'BHU Cantt Road', 'Night Safety', 'Streetlights working properly. Police PCR van stationed at junction until 2:30 AM.', 184, true),
    ('Commuter Safe #211', 'Delhi', 'Rajiv Chowk Metro Exit Gate 4', 'Safe Cab', 'Pink auto stand is active after 9 PM with verified female escorts.', 312, true),
    ('Student Shield #109', 'Jaipur', 'Sindhi Camp Bus Station', 'Police Beat', 'All-women Nirbhaya squad patrolling every 15 minutes. High safety score.', 96, true)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solo_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awareness_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for hackathon demo mode
CREATE POLICY "Public Read All" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert All" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public Contacts Read" ON public.emergency_contacts FOR SELECT USING (true);
CREATE POLICY "Public Contacts Write" ON public.emergency_contacts FOR ALL USING (true);

CREATE POLICY "Public SOS Read" ON public.sos_incidents FOR SELECT USING (true);
CREATE POLICY "Public SOS Write" ON public.sos_incidents FOR ALL USING (true);

CREATE POLICY "Public Trips Read" ON public.solo_trips FOR SELECT USING (true);
CREATE POLICY "Public Trips Write" ON public.solo_trips FOR ALL USING (true);

CREATE POLICY "Public Vehicle Read" ON public.vehicle_scans FOR SELECT USING (true);
CREATE POLICY "Public Vehicle Write" ON public.vehicle_scans FOR ALL USING (true);

CREATE POLICY "Public Posts Read" ON public.awareness_posts FOR SELECT USING (true);
CREATE POLICY "Public Posts Write" ON public.awareness_posts FOR ALL USING (true);
