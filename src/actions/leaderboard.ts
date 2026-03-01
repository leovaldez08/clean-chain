"use server";

import { createServiceClient } from "@/lib/supabase/server";

export interface WardScore {
  ward_number: number;
  total_incidents: number;
  pending_count: number;
  resolved_count: number;
  avg_response_minutes: number;
  clean_score: number;
  trend: "up" | "down" | "stable";
}

export interface RecurringHotspot {
  latitude: number;
  longitude: number;
  incident_count: number;
  ward_number: number | null;
}

export async function getWardLeaderboard(): Promise<{
  data: WardScore[] | null;
  error: string | null;
}> {
  const serviceClient = createServiceClient();

  const { data: incidents, error } = await serviceClient
    .from("incidents")
    .select("ward_number, status, severity, response_time_minutes, reported_at")
    .not("ward_number", "is", null);

  if (error) return { data: null, error: error.message };
  if (!incidents || incidents.length === 0) return { data: [], error: null };

  const wardMap = new Map<number, typeof incidents>();

  for (const inc of incidents) {
    if (inc.ward_number === null) continue;
    if (!wardMap.has(inc.ward_number)) wardMap.set(inc.ward_number, []);
    wardMap.get(inc.ward_number)!.push(inc);
  }

  const scores: WardScore[] = [];

  for (const [ward_number, wardIncidents] of wardMap) {
    const total_incidents = wardIncidents.length;
    const pending_count = wardIncidents.filter(
      (i) => i.status === "pending",
    ).length;
    const resolved_count = wardIncidents.filter(
      (i) => i.status === "resolved",
    ).length;

    const responseTimes = wardIncidents
      .filter((i) => i.response_time_minutes !== null)
      .map((i) => i.response_time_minutes as number);

    const avg_response_minutes = responseTimes.length
      ? Math.round(
          responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length,
        )
      : 0;

    // We want the score to react positively when things are resolved
    const resolution_rate =
      total_incidents > 0 ? resolved_count / total_incidents : 1;

    // Base 50 + up to 50 based on resolution rate
    let score = 50 + 50 * resolution_rate;

    // Penalize for slow avg response (cap penalty at 20 points)
    const responsePenalty = Math.min(20, (avg_response_minutes / 60) * 10);
    score -= responsePenalty;

    const clean_score = Math.max(0, Math.min(100, Math.round(score)));

    // If resolution rate > 50%, trend is up. If < 30%, trend is down.
    const trend: "up" | "down" | "stable" =
      resolution_rate > 0.5 ? "up" : resolution_rate < 0.3 ? "down" : "stable";

    scores.push({
      ward_number,
      total_incidents,
      pending_count,
      resolved_count,
      avg_response_minutes,
      clean_score,
      trend,
    });
  }

  scores.sort((a, b) => b.clean_score - a.clean_score);
  return { data: scores, error: null };
}

export async function getRecurringHotspots(): Promise<{
  data: RecurringHotspot[] | null;
  error: string | null;
}> {
  const serviceClient = createServiceClient();

  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: incidents, error } = await serviceClient
    .from("incidents")
    .select("latitude, longitude, ward_number")
    .gte("reported_at", sevenDaysAgo);

  if (error) return { data: null, error: error.message };
  if (!incidents || incidents.length === 0) return { data: [], error: null };

  // Cluster incidents within ~50m radius
  const CLUSTER_RADIUS_DEG = 0.00045;
  const clusters: {
    lat: number;
    lng: number;
    count: number;
    ward_number: number | null;
  }[] = [];

  for (const inc of incidents) {
    let found = false;
    for (const c of clusters) {
      if (
        Math.abs(c.lat - inc.latitude) < CLUSTER_RADIUS_DEG &&
        Math.abs(c.lng - inc.longitude) < CLUSTER_RADIUS_DEG
      ) {
        c.count++;
        c.lat = (c.lat + inc.latitude) / 2;
        c.lng = (c.lng + inc.longitude) / 2;
        found = true;
        break;
      }
    }
    if (!found) {
      clusters.push({
        lat: inc.latitude,
        lng: inc.longitude,
        count: 1,
        ward_number: inc.ward_number,
      });
    }
  }

  const hotspots = clusters
    .filter((c) => c.count >= 3)
    .map((c) => ({
      latitude: c.lat,
      longitude: c.lng,
      incident_count: c.count,
      ward_number: c.ward_number,
    }));

  return { data: hotspots, error: null };
}

export async function getTrendData(): Promise<{
  data: { date: string; reports: number; avgResponse: number }[] | null;
  error: string | null;
}> {
  const serviceClient = createServiceClient();

  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: incidents, error } = await serviceClient
    .from("incidents")
    .select("reported_at, response_time_minutes, status")
    .gte("reported_at", sevenDaysAgo)
    .order("reported_at", { ascending: true });

  if (error) return { data: null, error: error.message };
  if (!incidents) return { data: [], error: null };

  const dayMap = new Map<
    string,
    { reports: number; responseTimes: number[] }
  >();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dayMap.set(key, { reports: 0, responseTimes: [] });
  }

  for (const inc of incidents) {
    const key = inc.reported_at.split("T")[0];
    if (dayMap.has(key)) {
      const entry = dayMap.get(key)!;
      entry.reports++;
      if (inc.response_time_minutes !== null) {
        entry.responseTimes.push(inc.response_time_minutes);
      }
    }
  }

  const trendData = Array.from(dayMap.entries()).map(([date, entry]) => ({
    date: new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    reports: entry.reports,
    avgResponse: entry.responseTimes.length
      ? Math.round(
          entry.responseTimes.reduce((s, t) => s + t, 0) /
            entry.responseTimes.length,
        )
      : 0,
  }));

  return { data: trendData, error: null };
}

export interface EmergingHotspot {
  ward_number: number;
  current_incidents: number;
  trend_pattern: number[];
  acceleration_rate: number;
}

export async function getEmergingHotspots(): Promise<{
  data: EmergingHotspot[] | null;
  error: string | null;
}> {
  const serviceClient = createServiceClient();

  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: incidents, error } = await serviceClient
    .from("incidents")
    .select("ward_number, reported_at")
    .not("ward_number", "is", null)
    .gte("reported_at", sevenDaysAgo);

  if (error) return { data: null, error: error.message };
  if (!incidents) return { data: [], error: null };

  const wardDayCounts = new Map<number, number[]>();

  incidents.forEach((inc) => {
    if (inc.ward_number !== null && !wardDayCounts.has(inc.ward_number)) {
      wardDayCounts.set(inc.ward_number, new Array(7).fill(0));
    }
  });

  const nowMs = Date.now();
  for (const inc of incidents) {
    if (inc.ward_number === null) continue;
    const msAgo = nowMs - new Date(inc.reported_at).getTime();
    const daysAgo = Math.floor(msAgo / (24 * 60 * 60 * 1000));
    if (daysAgo >= 0 && daysAgo < 7) {
      const index = 6 - daysAgo;
      wardDayCounts.get(inc.ward_number)![index]++;
    }
  }

  const emerging: EmergingHotspot[] = [];

  for (const [ward, counts] of wardDayCounts.entries()) {
    const recent = counts.slice(-3); // Last 3 days
    const isIncreasing = recent[0] < recent[1] && recent[1] < recent[2];
    const hasVolume = recent[2] >= 2;

    const avgOld = counts.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
    const avgNew = recent.reduce((a, b) => a + b, 0) / 3;
    const constitutesSpike = avgNew > avgOld * 1.5 && avgNew >= 2;

    if ((isIncreasing && hasVolume) || constitutesSpike) {
      emerging.push({
        ward_number: ward,
        current_incidents: recent[2],
        trend_pattern: counts,
        acceleration_rate:
          avgOld > 0 ? Number(((avgNew - avgOld) / avgOld).toFixed(2)) : avgNew,
      });
    }
  }

  emerging.sort((a, b) => b.acceleration_rate - a.acceleration_rate);
  return { data: emerging, error: null };
}
