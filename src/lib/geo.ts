import { MADURAI_CENTER, MADURAI_GEOFENCE_KM } from "./constants";
import type { Coordinates } from "./types";

const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Haversine distance between two points in kilometers */
export function haversineDistance(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h =
    sinLat * sinLat +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * sinLng * sinLng;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Check if coordinates fall within Madurai geofence */
export function isWithinMadurai(coords: Coordinates): boolean {
  const distance = haversineDistance(coords, MADURAI_CENTER);
  return distance <= MADURAI_GEOFENCE_KM;
}

/** Get device metadata from user agent string */
export function getDeviceInfo(): string {
  if (typeof navigator === "undefined") return "server";
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const platform = isIOS ? "iOS" : isAndroid ? "Android" : "Desktop";
  return `${platform} | ${ua.slice(0, 120)}`;
}

const PILOT_WARDS = [
  { id: 12, lat: 9.9195, lng: 78.1193 }, // Meenakshi Temple
  { id: 24, lat: 9.9272, lng: 78.1268 }, // Periyar Bus Stand
  { id: 45, lat: 9.9282, lng: 78.145 }, // Anna Nagar
];

/** Estimate ward number from coordinates (snaps to closest pilot ward) */
export function estimateWardNumber(coords: Coordinates): number {
  let closestWard = 12;
  let minDistance = Infinity;

  for (const ward of PILOT_WARDS) {
    const dist = haversineDistance(coords, { lat: ward.lat, lng: ward.lng });
    if (dist < minDistance) {
      minDistance = dist;
      closestWard = ward.id;
    }
  }

  return closestWard;
}
