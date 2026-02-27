"use server";

import { createServiceClient } from "@/lib/supabase/server";

export interface UserImpact {
  totalReports: number;
  resolvedReports: number;
  avgCleanupMinutes: number;
  cleanScore: number;
}

export async function getUserImpact(
  userId: string,
): Promise<{ data: UserImpact | null; error: string | null }> {
  const serviceClient = createServiceClient();

  const { data: incidents, error } = await serviceClient
    .from("incidents")
    .select("status, severity, response_time_minutes")
    .eq("reported_by", userId);

  if (error) return { data: null, error: error.message };
  if (!incidents || incidents.length === 0) {
    return {
      data: {
        totalReports: 0,
        resolvedReports: 0,
        avgCleanupMinutes: 0,
        cleanScore: 0,
      },
      error: null,
    };
  }

  const totalReports = incidents.length;
  const resolvedReports = incidents.filter(
    (i) => i.status === "resolved",
  ).length;

  const responseTimes = incidents
    .filter((i) => i.response_time_minutes !== null)
    .map((i) => i.response_time_minutes as number);

  const avgCleanupMinutes = responseTimes.length
    ? Math.round(
        responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length,
      )
    : 0;

  // Clean Score = weighted resolution rate (high severity = 3x, medium = 2x, low = 1x)
  const weightMap = { high: 3, medium: 2, low: 1 };
  let totalWeight = 0;
  let resolvedWeight = 0;
  for (const i of incidents) {
    const w = weightMap[i.severity as keyof typeof weightMap] || 1;
    totalWeight += w;
    if (i.status === "resolved") resolvedWeight += w;
  }
  const cleanScore =
    totalWeight > 0 ? Math.round((resolvedWeight / totalWeight) * 100) : 0;

  return {
    data: { totalReports, resolvedReports, avgCleanupMinutes, cleanScore },
    error: null,
  };
}

export async function getRecentResolvedIncidents() {
  const serviceClient = createServiceClient();

  const { data, error } = await serviceClient
    .from("incidents")
    .select("*")
    .eq("status", "resolved")
    .not("clearance_photo_url", "is", null)
    .order("resolved_at", { ascending: false })
    .limit(3);

  return { data, error: error?.message || null };
}
