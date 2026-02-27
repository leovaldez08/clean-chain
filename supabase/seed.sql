-- Seed data for CleanChain demo
-- Run AFTER migration.sql in Supabase SQL Editor

-- Insert sample incidents across Madurai wards
INSERT INTO incidents (
  photo_url, location, latitude, longitude, ward_number,
  description, severity, status, reported_at, response_time_minutes
) VALUES
  -- Pending incidents (red pins on map)
  (
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400',
    ST_SetSRID(ST_MakePoint(78.1198, 9.9252), 4326)::geography,
    9.9252, 78.1198, 12,
    'Overflowing garbage bin near Meenakshi Temple entrance', 'high', 'pending',
    now() - interval '2 hours', NULL
  ),
  (
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400',
    ST_SetSRID(ST_MakePoint(78.1350, 9.9310), 4326)::geography,
    9.9310, 78.1350, 24,
    'Plastic waste dumped near Vaigai River bank', 'high', 'pending',
    now() - interval '4 hours', NULL
  ),
  (
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    ST_SetSRID(ST_MakePoint(78.1050, 9.9180), 4326)::geography,
    9.9180, 78.1050, 45,
    'Construction debris blocking drain', 'medium', 'pending',
    now() - interval '6 hours', NULL
  ),
  (
    'https://images.unsplash.com/photo-1567093719008-90cac19a3bc1?w=400',
    ST_SetSRID(ST_MakePoint(78.1420, 9.9400), 4326)::geography,
    9.9400, 78.1420, 67,
    'Uncollected household waste on street corner', 'medium', 'pending',
    now() - interval '8 hours', NULL
  ),
  (
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400',
    ST_SetSRID(ST_MakePoint(78.0980, 9.9100), 4326)::geography,
    9.9100, 78.0980, 33,
    'Garbage scattered near school playground', 'high', 'pending',
    now() - interval '1 hour', NULL
  ),
  (
    'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400',
    ST_SetSRID(ST_MakePoint(78.1280, 9.9350), 4326)::geography,
    9.9350, 78.1280, 56,
    'Open dump site near residential area', 'high', 'pending',
    now() - interval '3 hours', NULL
  ),
  (
    'https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=400',
    ST_SetSRID(ST_MakePoint(78.1150, 9.9220), 4326)::geography,
    9.9220, 78.1150, 18,
    'Market waste left uncollected after closing', 'medium', 'pending',
    now() - interval '5 hours', NULL
  ),
  (
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400',
    ST_SetSRID(ST_MakePoint(78.1090, 9.9280), 4326)::geography,
    9.9280, 78.1090, 41,
    'Sewage overflow near bus stand', 'low', 'pending',
    now() - interval '30 minutes', NULL
  ),

  -- Resolved incidents (green pins on map)
  (
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
    ST_SetSRID(ST_MakePoint(78.1220, 9.9270), 4326)::geography,
    9.9270, 78.1220, 15,
    'Waste dump cleared near park', 'medium', 'resolved',
    now() - interval '12 hours', 45
  ),
  (
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    ST_SetSRID(ST_MakePoint(78.1300, 9.9200), 4326)::geography,
    9.9200, 78.1300, 28,
    'Street cleaning completed after report', 'low', 'resolved',
    now() - interval '1 day', 120
  ),
  (
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400',
    ST_SetSRID(ST_MakePoint(78.1180, 9.9330), 4326)::geography,
    9.9330, 78.1180, 52,
    'Overflowing bin replaced with new one', 'high', 'resolved',
    now() - interval '18 hours', 30
  ),
  (
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    ST_SetSRID(ST_MakePoint(78.1380, 9.9150), 4326)::geography,
    9.9150, 78.1380, 72,
    'Drain blockage cleared', 'medium', 'resolved',
    now() - interval '2 days', 90
  ),
  (
    'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400',
    ST_SetSRID(ST_MakePoint(78.1100, 9.9380), 4326)::geography,
    9.9380, 78.1100, 8,
    'Illegal dumping site cleaned up', 'high', 'resolved',
    now() - interval '6 hours', 25
  ),
  (
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
    ST_SetSRID(ST_MakePoint(78.1250, 9.9120), 4326)::geography,
    9.9120, 78.1250, 38,
    'Garbage near hospital entrance removed', 'high', 'resolved',
    now() - interval '10 hours', 55
  ),
  (
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    ST_SetSRID(ST_MakePoint(78.1320, 9.9290), 4326)::geography,
    9.9290, 78.1320, 12,
    'Weekly market area cleaned post-event', 'low', 'resolved',
    now() - interval '1 day 6 hours', 180
  );

-- Set resolved_at for resolved incidents
UPDATE incidents
SET resolved_at = reported_at + (response_time_minutes || ' minutes')::interval
WHERE status = 'resolved' AND resolved_at IS NULL;
