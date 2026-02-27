"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { AdminMetrics, IncidentFilters } from "@/lib/types";

export async function getIncidents(filters?: IncidentFilters) {
  const serviceClient = createServiceClient();

  let query = serviceClient.from("incidents").select("*");

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters?.severity) {
    query = query.eq("severity", filters.severity);
  }
  if (filters?.ward) {
    query = query.eq("ward_number", filters.ward);
  }
  if (filters?.dateFrom) {
    query = query.gte("reported_at", filters.dateFrom);
  }
  if (filters?.dateTo) {
    query = query.lte("reported_at", filters.dateTo);
  }

  const { data, error } = await query.order("reported_at", { ascending: false }).limit(500);

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function getMetrics(): Promise<{ data: AdminMetrics | null; error: string | null }> {
  const serviceClient = createServiceClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Total today
  const { count: totalToday } = await serviceClient
    .from("incidents")
    .select("*", { count: "exact", head: true })
    .gte("reported_at", todayStart.toISOString());

  // Pending count
  const { count: pendingCount } = await serviceClient
    .from("incidents")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Resolved count
  const { count: resolvedCount } = await serviceClient
    .from("incidents")
    .select("*", { count: "exact", head: true })
    .eq("status", "resolved");

  // Avg response time
  const { data: avgData } = await serviceClient
    .from("incidents")
    .select("response_time_minutes")
    .eq("status", "resolved")
    .not("response_time_minutes", "is", null);

  const avgResponseMinutes = avgData?.length
    ? Math.round(avgData.reduce((sum, r) => sum + (r.response_time_minutes || 0), 0) / avgData.length)
    : 0;

  // Top hotspot wards
  const { data: wardData } = await serviceClient
    .from("incidents")
    .select("ward_number")
    .eq("status", "pending")
    .not("ward_number", "is", null);

  const wardCounts: Record<number, number> = {};
  wardData?.forEach((row) => {
    if (row.ward_number) {
      wardCounts[row.ward_number] = (wardCounts[row.ward_number] || 0) + 1;
    }
  });

  const topWards = Object.entries(wardCounts)
    .map(([ward, count]) => ({ ward_number: parseInt(ward), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    data: {
      totalToday: totalToday || 0,
      pendingCount: pendingCount || 0,
      resolvedCount: resolvedCount || 0,
      avgResponseMinutes,
      topWards,
    },
    error: null,
  };
}

export async function loginAdmin(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { success: true };
}
