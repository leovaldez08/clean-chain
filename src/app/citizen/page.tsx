"use client";

import { useState, useRef, useTransition } from "react";
import { toast } from "sonner";
import {
  Camera,
  MapPin,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { submitReport } from "@/actions/citizen";
import { isWithinMadurai, getDeviceInfo } from "@/lib/geo";
import { createClient } from "@/lib/supabase/client";
import { SEVERITY_OPTIONS } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CitizenPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [gpsLoading, setGpsLoading] = useState(false);
  const [severity, setSeverity] = useState<string>("medium");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const grabGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (!isWithinMadurai({ lat: latitude, lng: longitude })) {
          toast.error(
            "Out of Zone: Reports are currently limited to the Madurai municipal limits.",
          );
          setGpsLoading(false);
          return;
        }
        setCoords({ lat: latitude, lng: longitude });
        setGpsLoading(false);
        toast.success("GPS location captured!");
      },
      () => {
        toast.error("Failed to get location. Please enable GPS and try again.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const handleSubmit = async () => {
    if (!photo) return toast.error("Please capture a photo first.");
    if (!coords) return toast.error("Please capture your GPS location.");

    startTransition(async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          await supabase.auth.signInAnonymously();
        }

        const formData = new FormData();
        formData.append("photo", photo);
        formData.append("latitude", coords.lat.toString());
        formData.append("longitude", coords.lng.toString());
        formData.append("severity", severity);
        formData.append("description", description);
        formData.append("deviceInfo", getDeviceInfo());

        const result = await submitReport(formData);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.warning) {
          toast.warning(result.warning);
          return;
        }

        if (result.success) {
          toast.success(`Report submitted! Ward #${result.wardNumber}`);
          setSubmitted(true);
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="max-w-sm w-full text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Report Submitted!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for helping keep Madurai clean. Your report has been
            logged and will be addressed by our team.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setPhoto(null);
              setPhotoPreview(null);
              setCoords(null);
              setDescription("");
              setSeverity("medium");
            }}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Report Another Incident
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">CleanChain</h1>
              <p className="text-xs text-muted-foreground">
                Report Waste Incident
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <section className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-500" />
            Photo Evidence
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
            id="photo-input"
          />
          {photoPreview ? (
            <div className="relative rounded-xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Captured incident"
                className="w-full h-64 object-cover"
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
              className="w-full h-48 rounded-xl border-2 border-dashed border-border hover:border-emerald-500/50 bg-muted/30 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-sm text-muted-foreground">
                Tap to capture photo
              </span>
            </button>
          )}
        </section>

        <section className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            GPS Location
          </label>
          {coords ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  Location captured
                </p>
                <p className="text-muted-foreground text-xs font-mono">
                  {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={grabGPS}
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

        <section className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-emerald-500" />
            Severity
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SEVERITY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setSeverity(opt)}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer ${
                  severity === opt
                    ? opt === "low"
                      ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/30"
                      : opt === "medium"
                        ? "bg-orange-500/10 text-orange-600 border border-orange-500/30"
                        : "bg-red-500/10 text-red-600 border border-red-500/30"
                    : "bg-muted/30 text-muted-foreground border border-border hover:bg-muted/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-500" />
            Description{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Overflowing bin near the bus stop..."
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-muted-foreground"
          />
        </section>

        <button
          onClick={handleSubmit}
          disabled={isPending || !photo || !coords}
          className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-muted disabled:text-muted-foreground text-white font-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed text-base"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Report
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          By submitting, your GPS location and device info will be recorded for
          accountability.
        </p>
      </div>
    </main>
  );
}
