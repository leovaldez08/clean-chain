// Madurai city center coordinates
export const MADURAI_CENTER = {
  lat: 9.9252,
  lng: 78.1198,
} as const;

// Geofence radius in kilometers (reports only allowed within this radius of city center)
export const MADURAI_GEOFENCE_KM = 20;

// Driver must be within this distance (meters) to clear an incident
export const DRIVER_CLEARANCE_RADIUS_M = 100;

// Duplicate report detection: same-area radius in meters
export const DUPLICATE_RADIUS_M = 30;

// Duplicate report detection: time window in hours
export const DUPLICATE_TIME_HOURS = 2;

// Rate limiting: max reports per hour per anonymous UID
export const MAX_REPORTS_PER_HOUR = 3;

// Map defaults
export const MAP_DEFAULT_ZOOM = 13;
export const MAP_MIN_ZOOM = 11;
export const MAP_MAX_ZOOM = 18;

// Supabase Storage bucket
export const STORAGE_BUCKET = "incident-photos";

// Severity options
export const SEVERITY_OPTIONS = ["low", "medium", "high"] as const;
export type Severity = (typeof SEVERITY_OPTIONS)[number];

// Incident status
export const STATUS_OPTIONS = ["pending", "resolved"] as const;
export type IncidentStatus = (typeof STATUS_OPTIONS)[number];
