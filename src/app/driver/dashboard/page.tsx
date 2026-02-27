"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Camera,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { getNearbyPendingIncidents, resolveIncident } from "@/actions/driver";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Incident } from "@/lib/types";

export default function DriverDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );
  const [clearancePhoto, setClearancePhoto] = useState<File | null>(null);
  const [clearancePreview, setClearancePreview] = useState<string | null>(null);
  const [driverCoords, setDriverCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const result = await getNearbyPendingIncidents(latitude, longitude);
        if (result.data) setIncidents(result.data);
        setLoading(false);
      },
      () => {
        toast.error("Location access needed to show nearby incidents.");
        setLoading(false);
      },
      { enableHighAccuracy: true },
    );
  };

  const grabDriverGPS = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDriverCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsLoading(false);
        toast.success("GPS location captured!");
      },
      () => {
        toast.error("Failed to get GPS. Enable location access.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const handleClearance = () => {
    if (!selectedIncident || !clearancePhoto || !driverCoords) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("incidentId", selectedIncident.id);
      formData.append("photo", clearancePhoto);
      formData.append("latitude", driverCoords.lat.toString());
      formData.append("longitude", driverCoords.lng.toString());

      const result = await resolveIncident(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`Cleared in ${result.responseTimeMinutes} minutes!`);
      setSelectedIncident(null);
      setClearancePhoto(null);
      setClearancePreview(null);
      setDriverCoords(null);
      loadIncidents();
    });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/driver");
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setClearancePhoto(file);
    setClearancePreview(URL.createObjectURL(file));
  };

  const timeSince = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Clearance modal
  if (selectedIncident) {
    return (
      <main className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedIncident(null);
                setClearancePhoto(null);
                setClearancePreview(null);
                setDriverCoords(null);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <h1 className="font-bold text-sm">Clear Incident</h1>
            <div className="w-12" />
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Original report */}
          <div className="rounded-xl border border-border overflow-hidden">
            <img
              src={selectedIncident.photo_url}
              alt="Incident"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  {selectedIncident.latitude.toFixed(5)},{" "}
                  {selectedIncident.longitude.toFixed(5)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {timeSince(selectedIncident.reported_at)}
                </span>
              </div>
              {selectedIncident.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedIncident.description}
                </p>
              )}
            </div>
          </div>

          {/* GPS capture */}
          <section className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              Your Current Location
            </label>
            {driverCoords ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-emerald-700 dark:text-emerald-300">
                    Location captured
                  </p>
                  <p className="text-muted-foreground text-xs font-mono">
                    {driverCoords.lat.toFixed(6)}, {driverCoords.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={grabDriverGPS}
                disabled={gpsLoading}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {gpsLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Acquiring GPS...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Capture My Location
                  </>
                )}
              </button>
            )}
          </section>

          {/* Clearance photo */}
          <section className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-500" />
              Clearance Photo
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
            {clearancePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img
                  src={clearancePreview}
                  alt="Clearance"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 text-white text-xs font-medium rounded-lg hover:bg-black/80 transition-colors cursor-pointer"
                >
                  Retake
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-xl border-2 border-dashed border-border hover:border-emerald-500/50 bg-muted/30 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer"
              >
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Take clearance photo
                </span>
              </button>
            )}
          </section>

          {/* Submit */}
          <button
            onClick={handleClearance}
            disabled={isPending || !clearancePhoto || !driverCoords}
            className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-muted disabled:text-muted-foreground text-white font-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Mark as Cleared
              </>
            )}
          </button>
        </div>
      </main>
    );
  }

  // Incidents list
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Driver Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Pending clearance tasks
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-sm text-muted-foreground">
              Loading incidents...
            </p>
          </div>
        ) : incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/30" />
            <p className="text-muted-foreground">No pending incidents nearby</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {incidents.length} pending incident
              {incidents.length !== 1 ? "s" : ""}
            </p>
            {incidents.map((incident) => (
              <button
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-emerald-500/30 bg-card transition-all cursor-pointer text-left"
              >
                <img
                  src={incident.photo_url}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        incident.severity === "high"
                          ? "bg-red-500/10 text-red-500"
                          : incident.severity === "medium"
                            ? "bg-orange-500/10 text-orange-500"
                            : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {incident.severity}
                    </span>
                    {incident.ward_number && (
                      <span className="text-xs text-muted-foreground">
                        Ward {incident.ward_number}
                      </span>
                    )}
                  </div>
                  <p className="text-sm truncate text-muted-foreground">
                    {incident.description ||
                      `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {timeSince(incident.reported_at)}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
