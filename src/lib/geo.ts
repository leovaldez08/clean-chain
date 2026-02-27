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

// Simplified ward estimation for Madurai (100 wards)
// Uses nearest-center lookup from a set of approximate ward centers
// For MVP: divides Madurai into a grid and assigns ward numbers
const WARD_GRID_SIZE = 10; // 10x10 grid = 100 wards
const MADURAI_BOUNDS = {
  minLat: 9.85,
  maxLat: 9.99,
  minLng: 78.04,
  maxLng: 78.20,
};

/** Estimate ward number from coordinates (simplified grid-based approach) */
export function estimateWardNumber(coords: Coordinates): number {
  const latRange = MADURAI_BOUNDS.maxLat - MADURAI_BOUNDS.minLat;
  const lngRange = MADURAI_BOUNDS.maxLng - MADURAI_BOUNDS.minLng;

  const latIdx = Math.min(
    WARD_GRID_SIZE - 1,
    Math.max(0, Math.floor(((coords.lat - MADURAI_BOUNDS.minLat) / latRange) * WARD_GRID_SIZE))
  );
  const lngIdx = Math.min(
    WARD_GRID_SIZE - 1,
    Math.max(0, Math.floor(((coords.lng - MADURAI_BOUNDS.minLng) / lngRange) * WARD_GRID_SIZE))
  );

  return latIdx * WARD_GRID_SIZE + lngIdx + 1; // 1-100
}
