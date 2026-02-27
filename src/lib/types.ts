export interface Incident {
  id: string;
  photo_url: string;
  latitude: number;
  longitude: number;
  ward_number: number | null;
  description: string | null;
  severity: "low" | "medium" | "high";
  status: "pending" | "resolved";
  reported_at: string;
  reported_by: string | null;
  device_info: string | null;
  clearance_photo_url: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  response_time_minutes: number | null;
  created_at: string;
}

export interface IncidentInsert {
  photo_url: string;
  latitude: number;
  longitude: number;
  ward_number?: number | null;
  description?: string | null;
  severity?: "low" | "medium" | "high";
  reported_by?: string | null;
  device_info?: string | null;
}

export interface IncidentUpdate {
  status?: "pending" | "resolved";
  clearance_photo_url?: string | null;
  resolved_at?: string | null;
  resolved_by?: string | null;
  response_time_minutes?: number | null;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AdminMetrics {
  totalToday: number;
  pendingCount: number;
  resolvedCount: number;
  avgResponseMinutes: number;
  topWards: { ward_number: number; count: number }[];
}

export interface IncidentFilters {
  status?: "pending" | "resolved" | "all";
  dateFrom?: string;
  dateTo?: string;
  severity?: "low" | "medium" | "high";
  ward?: number;
}
