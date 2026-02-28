"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { STORAGE_BUCKET, DRIVER_CLEARANCE_RADIUS_M } from "@/lib/constants";

export async function resolveIncident(formData: FormData) {
  const supabase = await createClient();
  const serviceClient = createServiceClient();

  const incidentId = formData.get("incidentId") as string;
  const supervisorLat = parseFloat(formData.get("latitude") as string);
  const supervisorLng = parseFloat(formData.get("longitude") as string);
  const photo = formData.get("photo") as File;

  if (!incidentId || !supervisorLat || !supervisorLng || !photo) {
    return {
      error: "Incident ID, GPS coordinates, and clearance photo are required.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Authentication required." };
  }

  const { data: isNearby } = await serviceClient.rpc(
    "validate_driver_proximity",
    {
      p_incident_id: incidentId,
      p_driver_lat: supervisorLat,
      p_driver_lng: supervisorLng,
      p_max_distance_meters: DRIVER_CLEARANCE_RADIUS_M,
    },
  );

  if (!isNearby && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return {
      error:
        "You are outside the allowed radius. Move closer to the incident location.",
    };
  }

  const fileName = `${Date.now()}-clearance-${Math.random().toString(36).slice(2)}.${photo.name.split(".").pop()}`;
  const { error: uploadError } = await serviceClient.storage
    .from(STORAGE_BUCKET)
    .upload(`clearances/${fileName}`, photo, {
      contentType: photo.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: "Failed to upload clearance photo." };
  }

  const {
    data: { publicUrl },
  } = serviceClient.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(`clearances/${fileName}`);

  const { data: incident } = await serviceClient
    .from("incidents")
    .select("reported_at")
    .eq("id", incidentId)
    .single();

  if (!incident) {
    return { error: "Incident not found." };
  }

  const reportedAt = new Date(incident.reported_at);
  const responseTimeMinutes = Math.round(
    (Date.now() - reportedAt.getTime()) / (1000 * 60),
  );

  const { error: updateError } = await serviceClient
    .from("incidents")
    .update({
      status: "resolved",
      clearance_photo_url: publicUrl,
      resolved_at: new Date().toISOString(),
      resolved_by: user.id,
      response_time_minutes: responseTimeMinutes,
    })
    .eq("id", incidentId);

  if (updateError) {
    return { error: "Failed to update incident." };
  }

  return { success: true, responseTimeMinutes };
}

export async function getNearbyPendingIncidents() {
  const supabase = await createClient();
  const serviceClient = createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", data: null };
  }

  // Extract ward number from email (e.g. ward12supervisor@cleanchain.in -> 12)
  const email = user.email || "";
  const wardMatch = email.match(/ward(\d+)/i);
  const wardNumber = wardMatch ? parseInt(wardMatch[1], 10) : null;

  let query = serviceClient
    .from("incidents")
    .select("*")
    .eq("status", "pending")
    .order("reported_at", { ascending: false })
    .limit(50);

  if (wardNumber) {
    query = query.eq("ward_number", wardNumber);
  }

  const { data, error } = await query;

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function loginSupervisor(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { success: true };
}
