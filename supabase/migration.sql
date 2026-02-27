-- 1. Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  ward_number INTEGER,
  description TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  reported_at TIMESTAMPTZ DEFAULT now(),
  reported_by UUID,
  device_info TEXT,
  clearance_photo_url TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  response_time_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents (status);
CREATE INDEX IF NOT EXISTS idx_incidents_ward ON incidents (ward_number);
CREATE INDEX IF NOT EXISTS idx_incidents_reported_at ON incidents (reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_reported_by ON incidents (reported_by);

-- 4. Enable Row Level Security
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Anyone (including anonymous) can insert new reports
CREATE POLICY "Anyone can report incidents"
  ON incidents FOR INSERT
  WITH CHECK (true);

-- Anonymous users can read their own reports
CREATE POLICY "Anonymous users read own reports"
  ON incidents FOR SELECT
  USING (auth.uid() = reported_by);

-- Authenticated users (drivers/admins) can read all incidents
CREATE POLICY "Authenticated users read all"
  ON incidents FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users (drivers) can update incidents they are resolving
CREATE POLICY "Drivers can resolve incidents"
  ON incidents FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 6. Storage bucket for incident photos
-- STEP 1: Create bucket "incident-photos" in Supabase Dashboard > Storage (set to Public)
-- STEP 2: Run the policies below AFTER creating the bucket:

-- Allow anyone to upload photos to incident-photos bucket
CREATE POLICY "Allow public uploads to incident-photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'incident-photos');

-- Allow public read access to incident photos
CREATE POLICY "Allow public read access to incident-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'incident-photos');

-- 7. Function: Check nearby duplicates (within 30m, last 2 hours)
CREATE OR REPLACE FUNCTION check_nearby_duplicate(
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION,
  p_radius_meters INTEGER DEFAULT 30,
  p_hours INTEGER DEFAULT 2
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM incidents
    WHERE status = 'pending'
      AND reported_at > now() - (p_hours || ' hours')::INTERVAL
      AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
        p_radius_meters
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Function: Validate driver proximity (within specified meters)
CREATE OR REPLACE FUNCTION validate_driver_proximity(
  p_incident_id UUID,
  p_driver_lat DOUBLE PRECISION,
  p_driver_lng DOUBLE PRECISION,
  p_max_distance_meters INTEGER DEFAULT 75
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM incidents
    WHERE id = p_incident_id
      AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(p_driver_lng, p_driver_lat), 4326)::geography,
        p_max_distance_meters
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Function: Count recent reports by user (for rate limiting)
CREATE OR REPLACE FUNCTION count_recent_reports(
  p_user_id UUID,
  p_hours INTEGER DEFAULT 1
)
RETURNS INTEGER AS $$
DECLARE
  report_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO report_count
  FROM incidents
  WHERE reported_by = p_user_id
    AND reported_at > now() - (p_hours || ' hours')::INTERVAL;
  RETURN report_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
