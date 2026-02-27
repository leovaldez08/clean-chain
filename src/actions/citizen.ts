"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { STORAGE_BUCKET, MAX_REPORTS_PER_HOUR } from "@/lib/constants";
import { isWithinMadurai, estimateWardNumber } from "@/lib/geo";

export async function submitReport(formData: FormData) {
  const supabase = await createClient();
  const serviceClient = createServiceClient();

  const lat = parseFloat(formData.get("latitude") as string);
  const lng = parseFloat(formData.get("longitude") as string);
  const description = (formData.get("description") as string) || null;
  const severity = (formData.get("severity") as string) || "medium";
  const deviceInfo = (formData.get("deviceInfo") as string) || null;
  const photo = formData.get("photo") as File;

  if (!photo || !lat || !lng) {
    return { error: "Photo, latitude, and longitude are required." };
  }

  // Validate Madurai geofence (bypass in demo mode)
  if (process.env.DEMO_MODE !== "true" && !isWithinMadurai({ lat, lng })) {
    return { error: "Out of Zone: Reports are currently limited to the Madurai municipal limits." };
  }

  // Get current anonymous user
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  // Rate limiting (3 per hour)
  if (userId) {
    const { data: countData } = await serviceClient.rpc("count_recent_reports", {
      p_user_id: userId,
      p_hours: 1,
    });
    if (countData !== null && countData >= MAX_REPORTS_PER_HOUR) {
      return { error: `Rate limit exceeded. Maximum ${MAX_REPORTS_PER_HOUR} reports per hour.` };
    }
  }

  // Check nearby duplicates
  const { data: hasDuplicate } = await serviceClient.rpc("check_nearby_duplicate", {
    p_lat: lat,
    p_lng: lng,
    p_radius_meters: 30,
    p_hours: 2,
  });

  if (hasDuplicate) {
    return { warning: "A similar incident has already been reported nearby in the last 2 hours.", duplicate: true };
  }

  // Upload photo to Supabase Storage
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${photo.name.split(".").pop()}`;
  const { error: uploadError } = await serviceClient.storage
    .from(STORAGE_BUCKET)
    .upload(`reports/${fileName}`, photo, {
      contentType: photo.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: "Failed to upload photo. Please try again." };
  }

  const { data: { publicUrl } } = serviceClient.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(`reports/${fileName}`);

  // Estimate ward number
  const wardNumber = estimateWardNumber({ lat, lng });

  // Insert incident
  const { error: insertError } = await serviceClient.from("incidents").insert({
    photo_url: publicUrl,
    location: `SRID=4326;POINT(${lng} ${lat})`,
    latitude: lat,
    longitude: lng,
    ward_number: wardNumber,
    description,
    severity,
    reported_by: userId || null,
    device_info: deviceInfo,
  });

  if (insertError) {
    return { error: "Failed to submit report. Please try again." };
  }

  return { success: true, wardNumber };
}
