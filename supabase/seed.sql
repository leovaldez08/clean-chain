-- Seed data for CleanChain Demo
-- 40 incidents across 3 pilot wards in Madurai

-- Clear existing data
TRUNCATE incidents;

INSERT INTO incidents (
  photo_url, clearance_photo_url, location, latitude, longitude, ward_number,
  description, severity, status, reported_at, response_time_minutes
) VALUES
  -- ════════════════════════════════════════════
  -- WARD 12 — Meenakshi Temple Zone (PENDING)
  -- ════════════════════════════════════════════
  (
    'https://picsum.photos/seed/waste1/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1193, 9.9195), 4326)::geography,
    9.9195, 78.1193, 12,
    'Overflowing garbage bin near Meenakshi Temple east entrance — affecting tourist footfall', 'high', 'pending',
    now() - interval '1 hour 20 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste2/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1198, 9.9200), 4326)::geography,
    9.9200, 78.1198, 12,
    'Plastic waste pile near temple tank drainage — foul odor reported', 'high', 'pending',
    now() - interval '2 hours 45 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste3/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1185, 9.9190), 4326)::geography,
    9.9190, 78.1185, 12,
    'Food waste from street vendors blocking storm drain near South Masi Street', 'medium', 'pending',
    now() - interval '3 hours 10 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste4/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1170, 9.9185), 4326)::geography,
    9.9185, 78.1170, 12,
    'Uncollected garbage bags piled up near flower market — attracting stray dogs', 'high', 'pending',
    now() - interval '45 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste5/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1210, 9.9205), 4326)::geography,
    9.9205, 78.1210, 12,
    'Construction debris left on pavement near West Tower Street junction', 'medium', 'pending',
    now() - interval '5 hours', NULL
  ),

  -- ════════════════════════════════════════════
  -- WARD 12 — Meenakshi Temple Zone (RESOLVED)
  -- ════════════════════════════════════════════
  (
    'https://picsum.photos/seed/waste1/400/300',
    'https://picsum.photos/seed/clean1/400/300',
    ST_SetSRID(ST_MakePoint(78.1188, 9.9192), 4326)::geography,
    9.9192, 78.1188, 12,
    'Temple corridor waste cleared — fresh flowers and organic waste removed', 'high', 'resolved',
    now() - interval '8 hours', 35
  ),
  (
    'https://picsum.photos/seed/waste2/400/300',
    'https://picsum.photos/seed/clean2/400/300',
    ST_SetSRID(ST_MakePoint(78.1195, 9.9188), 4326)::geography,
    9.9188, 78.1195, 12,
    'Street sweeping completed around North Chitrai Street — debris cleared', 'medium', 'resolved',
    now() - interval '12 hours', 55
  ),
  (
    'https://picsum.photos/seed/waste3/400/300',
    'https://picsum.photos/seed/clean3/400/300',
    ST_SetSRID(ST_MakePoint(78.1202, 9.9198), 4326)::geography,
    9.9198, 78.1202, 12,
    'Market waste from Puthu Mandapam area cleaned up after evening market', 'low', 'resolved',
    now() - interval '1 day 2 hours', 120
  ),
  (
    'https://picsum.photos/seed/waste4/400/300',
    'https://picsum.photos/seed/clean4/400/300',
    ST_SetSRID(ST_MakePoint(78.1182, 9.9210), 4326)::geography,
    9.9210, 78.1182, 12,
    'Drain blockage near East Avani Moola Street cleared successfully', 'high', 'resolved',
    now() - interval '6 hours', 25
  ),

  -- ════════════════════════════════════════════
  -- WARD 24 — Periyar Bus Stand Zone (PENDING)
  -- ════════════════════════════════════════════
  (
    'https://picsum.photos/seed/waste1/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1270, 9.9270), 4326)::geography,
    9.9270, 78.1270, 24,
    'Massive garbage dump behind Periyar bus stand — 3+ days uncollected', 'high', 'pending',
    now() - interval '30 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste2/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1275, 9.9265), 4326)::geography,
    9.9265, 78.1275, 24,
    'Plastic bottles and food packaging scattered across bus bay area', 'medium', 'pending',
    now() - interval '2 hours', NULL
  ),
  (
    'https://picsum.photos/seed/waste4/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1260, 9.9280), 4326)::geography,
    9.9280, 78.1260, 24,
    'Open dumping near railway overbridge — waste sliding down slope', 'high', 'pending',
    now() - interval '4 hours', NULL
  ),
  (
    'https://picsum.photos/seed/waste5/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1265, 9.9290), 4326)::geography,
    9.9290, 78.1265, 24,
    'Overflowing public bin at auto stand entrance — waste spilling on road', 'medium', 'pending',
    now() - interval '1 hour 30 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste3/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1285, 9.9275), 4326)::geography,
    9.9275, 78.1285, 24,
    'Sewage overflow near public toilet block — hazardous condition', 'high', 'pending',
    now() - interval '55 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste1/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1280, 9.9260), 4326)::geography,
    9.9260, 78.1280, 24,
    'Mixed waste dumped in open lot behind ticket counter', 'low', 'pending',
    now() - interval '6 hours 30 minutes', NULL
  ),

  -- ════════════════════════════════════════════
  -- WARD 24 — Periyar Bus Stand Zone (RESOLVED)
  -- ════════════════════════════════════════════
  (
    'https://picsum.photos/seed/waste2/400/300',
    'https://picsum.photos/seed/clean1/400/300',
    ST_SetSRID(ST_MakePoint(78.1268, 9.9272), 4326)::geography,
    9.9272, 78.1268, 24,
    'Bus stand platform waste cleared — morning shift cleanup team', 'high', 'resolved',
    now() - interval '10 hours', 40
  ),
  (
    'https://picsum.photos/seed/waste3/400/300',
    'https://picsum.photos/seed/clean2/400/300',
    ST_SetSRID(ST_MakePoint(78.1278, 9.9268), 4326)::geography,
    9.9268, 78.1278, 24,
    'Road-side waste bins emptied along Simmakkal main road', 'medium', 'resolved',
    now() - interval '14 hours', 65
  ),
  (
    'https://picsum.photos/seed/waste4/400/300',
    'https://picsum.photos/seed/clean3/400/300',
    ST_SetSRID(ST_MakePoint(78.1255, 9.9282), 4326)::geography,
    9.9282, 78.1255, 24,
    'Drain near taxi stand unblocked — flowing freely now', 'high', 'resolved',
    now() - interval '18 hours', 30
  ),
  (
    'https://picsum.photos/seed/waste5/400/300',
    'https://picsum.photos/seed/clean4/400/300',
    ST_SetSRID(ST_MakePoint(78.1272, 9.9258), 4326)::geography,
    9.9258, 78.1272, 24,
    'Market waste from Mattuthavani junction area cleared', 'medium', 'resolved',
    now() - interval '1 day', 90
  ),
  (
    'https://picsum.photos/seed/waste1/400/300',
    'https://picsum.photos/seed/clean1/400/300',
    ST_SetSRID(ST_MakePoint(78.1290, 9.9285), 4326)::geography,
    9.9285, 78.1290, 24,
    'Construction material removed from footpath near housing board colony', 'low', 'resolved',
    now() - interval '2 days', 180
  ),

  -- ════════════════════════════════════════════
  -- WARD 45 — Anna Nagar Zone (PENDING)
  -- ════════════════════════════════════════════
  (
    'https://picsum.photos/seed/waste3/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1350, 9.9400), 4326)::geography,
    9.9400, 78.1350, 45,
    'Household waste dumped on vacant plot — recurring issue 3rd time this week', 'high', 'pending',
    now() - interval '40 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste5/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1345, 9.9410), 4326)::geography,
    9.9410, 78.1345, 45,
    'Green waste and garden trimmings left on pavement near Anna Nagar park', 'low', 'pending',
    now() - interval '3 hours', NULL
  ),
  (
    'https://picsum.photos/seed/waste2/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1360, 9.9395), 4326)::geography,
    9.9395, 78.1360, 45,
    'Plastic carry bags clogging drainage near KK Nagar main road', 'medium', 'pending',
    now() - interval '1 hour', NULL
  ),
  (
    'https://picsum.photos/seed/waste4/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1340, 9.9405), 4326)::geography,
    9.9405, 78.1340, 45,
    'Street dog menace due to accumulated food waste near school compound', 'high', 'pending',
    now() - interval '2 hours 30 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste1/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1355, 9.9390), 4326)::geography,
    9.9390, 78.1355, 45,
    'Electronic waste dumped near community hall — hazardous materials visible', 'high', 'pending',
    now() - interval '50 minutes', NULL
  ),

  -- ════════════════════════════════════════════
  -- WARD 45 — Anna Nagar Zone (RESOLVED)
  -- ════════════════════════════════════════════
  (
    'https://picsum.photos/seed/waste3/400/300',
    'https://picsum.photos/seed/clean2/400/300',
    ST_SetSRID(ST_MakePoint(78.1348, 9.9402), 4326)::geography,
    9.9402, 78.1348, 45,
    'Residential colony waste collected on schedule — area sanitized', 'medium', 'resolved',
    now() - interval '7 hours', 45
  ),
  (
    'https://picsum.photos/seed/waste5/400/300',
    'https://picsum.photos/seed/clean3/400/300',
    ST_SetSRID(ST_MakePoint(78.1358, 9.9408), 4326)::geography,
    9.9408, 78.1358, 45,
    'Park maintenance team cleaned surrounding waste near playground', 'low', 'resolved',
    now() - interval '16 hours', 70
  ),
  (
    'https://picsum.photos/seed/waste2/400/300',
    'https://picsum.photos/seed/clean4/400/300',
    ST_SetSRID(ST_MakePoint(78.1342, 9.9398), 4326)::geography,
    9.9398, 78.1342, 45,
    'Overflowing skip bin near market replaced with larger container', 'high', 'resolved',
    now() - interval '20 hours', 50
  ),
  (
    'https://picsum.photos/seed/waste4/400/300',
    'https://picsum.photos/seed/clean1/400/300',
    ST_SetSRID(ST_MakePoint(78.1365, 9.9415), 4326)::geography,
    9.9415, 78.1365, 45,
    'Illegal dump site near canal cleared — 2 truck loads removed', 'high', 'resolved',
    now() - interval '4 hours', 20
  ),

  -- ════════════════════════════════════════════
  -- HOTSPOT CLUSTERS (repeat reports for heatmap density)
  -- ════════════════════════════════════════════

  -- Temple entrance cluster (Ward 12) — 4 reports within 50m
  (
    'https://picsum.photos/seed/waste1/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1191, 9.9194), 4326)::geography,
    9.9194, 78.1191, 12,
    'Repeat complaint: waste accumulating near temple east gate', 'high', 'pending',
    now() - interval '90 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste3/400/300',
    'https://picsum.photos/seed/clean2/400/300',
    ST_SetSRID(ST_MakePoint(78.1194, 9.9196), 4326)::geography,
    9.9196, 78.1194, 12,
    'Evening market waste near temple cleared by sanitation worker', 'medium', 'resolved',
    now() - interval '5 hours', 42
  ),
  (
    'https://picsum.photos/seed/waste5/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1196, 9.9193), 4326)::geography,
    9.9193, 78.1196, 12,
    'Tourist area waste bins full — needs immediate attention', 'high', 'pending',
    now() - interval '25 minutes', NULL
  ),

  -- Bus stand entrance cluster (Ward 24) — 4 reports within 50m
  (
    'https://picsum.photos/seed/waste4/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1271, 9.9271), 4326)::geography,
    9.9271, 78.1271, 24,
    'Bus stand platform littered with wrappers and cups after evening rush', 'medium', 'pending',
    now() - interval '1 hour 15 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste2/400/300',
    'https://picsum.photos/seed/clean3/400/300',
    ST_SetSRID(ST_MakePoint(78.1273, 9.9269), 4326)::geography,
    9.9269, 78.1273, 24,
    'Bus stand area cleaned after citizen complaint — well done team!', 'medium', 'resolved',
    now() - interval '9 hours', 38
  ),
  (
    'https://picsum.photos/seed/waste1/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1269, 9.9273), 4326)::geography,
    9.9273, 78.1269, 24,
    'Repeat issue: waste reappearing at bus stand north entrance daily', 'high', 'pending',
    now() - interval '35 minutes', NULL
  ),

  -- School area cluster (Ward 45) — 3 reports within 50m
  (
    'https://picsum.photos/seed/waste5/400/300',
    NULL,
    ST_SetSRID(ST_MakePoint(78.1341, 9.9406), 4326)::geography,
    9.9406, 78.1341, 45,
    'Waste pile growing near school entrance — children walking through', 'high', 'pending',
    now() - interval '1 hour 45 minutes', NULL
  ),
  (
    'https://picsum.photos/seed/waste3/400/300',
    'https://picsum.photos/seed/clean4/400/300',
    ST_SetSRID(ST_MakePoint(78.1343, 9.9404), 4326)::geography,
    9.9404, 78.1343, 45,
    'School area cleaned — civic worker responded to parent complaint', 'high', 'resolved',
    now() - interval '3 hours 30 minutes', 15
  ),

  -- Older resolved for trend data (4-7 days ago)
  (
    'https://picsum.photos/seed/waste2/400/300',
    'https://picsum.photos/seed/clean1/400/300',
    ST_SetSRID(ST_MakePoint(78.1200, 9.9190), 4326)::geography,
    9.9190, 78.1200, 12,
    'Weekly drain cleaning completed near Avaniapuram road', 'medium', 'resolved',
    now() - interval '4 days', 60
  ),
  (
    'https://picsum.photos/seed/waste4/400/300',
    'https://picsum.photos/seed/clean2/400/300',
    ST_SetSRID(ST_MakePoint(78.1275, 9.9285), 4326)::geography,
    9.9285, 78.1275, 24,
    'Large-scale cleanup drive completed at Mattuthavani junction', 'high', 'resolved',
    now() - interval '5 days', 45
  ),
  (
    'https://picsum.photos/seed/waste1/400/300',
    'https://picsum.photos/seed/clean3/400/300',
    ST_SetSRID(ST_MakePoint(78.1350, 9.9410), 4326)::geography,
    9.9410, 78.1350, 45,
    'Anna Nagar colony weekend cleanup completed', 'low', 'resolved',
    now() - interval '6 days', 150
  ),
  (
    'https://picsum.photos/seed/waste5/400/300',
    'https://picsum.photos/seed/clean4/400/300',
    ST_SetSRID(ST_MakePoint(78.1190, 9.9200), 4326)::geography,
    9.9200, 78.1190, 12,
    'Temple road deep cleaning after festival', 'high', 'resolved',
    now() - interval '3 days', 35
  );

-- Set resolved_at for resolved incidents
UPDATE incidents
SET resolved_at = reported_at + (response_time_minutes || ' minutes')::interval
WHERE status = 'resolved' AND resolved_at IS NULL;
