"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { Incident } from "@/lib/types";
import { MADURAI_CENTER, MAP_DEFAULT_ZOOM } from "@/lib/constants";

// Fix Leaflet default icon path issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const pendingIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:28px;height:28px;background:#ef4444;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);position:relative;"><div style="position:absolute;inset:0;border-radius:50%;background:#ef4444;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;opacity:0.3;"></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const resolvedIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:24px;height:24px;background:#10b981;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    // Dynamically import leaflet.heat
    import("leaflet.heat").then(() => {
      const heat = (
        L as unknown as {
          heatLayer: (
            latlngs: [number, number, number][],
            options?: Record<string, unknown>,
          ) => L.Layer;
        }
      ).heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.2: "#10b981",
          0.4: "#f59e0b",
          0.6: "#f97316",
          0.8: "#ef4444",
          1.0: "#dc2626",
        },
      });
      heat.addTo(map);

      return () => {
        map.removeLayer(heat);
      };
    });
  }, [map, points]);

  return null;
}

interface IncidentMapProps {
  incidents: Incident[];
  showHeatmap: boolean;
  onMarkerClick?: (incident: Incident) => void;
}

export default function IncidentMap({
  incidents,
  showHeatmap,
  onMarkerClick,
}: IncidentMapProps) {
  const heatPoints: [number, number, number][] = incidents
    .filter((i) => i.status === "pending")
    .map((i) => [
      i.latitude,
      i.longitude,
      i.severity === "high" ? 1 : i.severity === "medium" ? 0.6 : 0.3,
    ]);

  return (
    <MapContainer
      center={[MADURAI_CENTER.lat, MADURAI_CENTER.lng]}
      zoom={MAP_DEFAULT_ZOOM}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.latitude, incident.longitude]}
          icon={incident.status === "pending" ? pendingIcon : resolvedIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(incident),
          }}
        >
          <Popup>
            <div style={{ maxWidth: 200, fontFamily: "system-ui" }}>
              <img
                src={incident.photo_url}
                alt=""
                style={{
                  width: "100%",
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                {incident.status} • {incident.severity}
              </p>
              {incident.ward_number && (
                <p
                  style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}
                >
                  Ward {incident.ward_number}
                </p>
              )}
              {incident.response_time_minutes && (
                <p
                  style={{ fontSize: 11, color: "#10b981", margin: "4px 0 0" }}
                >
                  Resolved in {incident.response_time_minutes}m
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {showHeatmap && <HeatmapLayer points={heatPoints} />}
    </MapContainer>
  );
}
