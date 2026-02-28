"use client";

import { useState, useRef, useTransition, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Camera,
  MapPin,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  BarChart3,
  Trophy,
  Clock,
  Sparkles,
} from "lucide-react";
import { submitReport } from "@/actions/citizen";
import { getUserImpact } from "@/actions/impact";
import type { UserImpact } from "@/actions/impact";
import { isWithinMadurai, getDeviceInfo } from "@/lib/geo";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        let { width, height } = img;
        const maxDim = 1200;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create new file with .jpg extension
              const newName = file.name.replace(/\.[^/.]+$/, ".jpg");
              resolve(new File([blob], newName, { type: "image/jpeg" }));
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.8,
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

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
  const [activeTab, setActiveTab] = useState<"report" | "impact">("report");
  const [impact, setImpact] = useState<UserImpact | null>(null);
  const [impactLoading, setImpactLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DEMO MODE STATE
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const [demoWard, setDemoWard] = useState<number | "">("");

  const DEMO_WARDS: Record<number, { name: string; lat: number; lng: number }> =
    {
      12: { name: "Ward 12 - Meenakshi Temple", lat: 9.9195, lng: 78.1193 },
      24: { name: "Ward 24 - Periyar Bus Stand", lat: 9.9272, lng: 78.1268 },
      45: { name: "Ward 45 - Anna Nagar", lat: 9.9282, lng: 78.145 },
    };

  const loadImpact = useCallback(async () => {
    setImpactLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        await supabase.auth.signInAnonymously();
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const result = await getUserImpact(user.id);
        if (result.data) setImpact(result.data);
      }
    } catch {
      // silent
    } finally {
      setImpactLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "impact") loadImpact();
  }, [activeTab, loadImpact]);

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

        const compressedPhoto = await compressImage(photo);

        const formData = new FormData();
        formData.append("photo", compressedPhoto);
        formData.append("latitude", coords.lat.toString());
        formData.append("longitude", coords.lng.toString());
        formData.append("severity", severity);
        formData.append("description", description);
        formData.append("deviceInfo", getDeviceInfo());

        if (isDemoMode && demoWard !== "") {
          formData.append("forcedWard", demoWard.toString());
        }

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-192.png"
              alt="CleanChain"
              className="w-8 h-8 rounded-lg"
            />
            <div>
              <h1 className="font-bold text-sm">CleanChain</h1>
              <p className="text-xs text-muted-foreground">Citizen Reporter</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Tab Bar */}
        <div className="max-w-lg mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab("report")}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === "report"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Send className="w-4 h-4 inline mr-1.5" />
            Report
          </button>
          <button
            onClick={() => setActiveTab("impact")}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === "impact"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-1.5" />
            My Impact
          </button>
        </div>
      </header>

      {activeTab === "report" ? (
        <div className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
          {/* Onboarding Steps */}
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground px-2 pb-2">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Camera className="w-4 h-4" />
              </div>
              <span>1. Snap</span>
            </div>
            <div className="w-8 h-[2px] bg-border/50 rounded-full" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
              <span>2. Pin</span>
            </div>
            <div className="w-8 h-[2px] bg-border/50 rounded-full" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Send className="w-4 h-4" />
              </div>
              <span>3. Done</span>
            </div>
          </div>

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
                disabled={gpsLoading || (isDemoMode && demoWard !== "")}
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

            {/* DEMO MODE OVERRIDE */}
            {isDemoMode && (
              <div className="mt-4 p-4 rounded-xl border-2 border-primary/20 bg-primary/5 animate-fade-in">
                <label className="text-xs font-bold text-primary mb-2 flex flex-col">
                  <span className="flex items-center gap-1 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Demo Override
                  </span>
                  <span className="text-muted-foreground font-normal">
                    Select a pilot ward directly to spoof GPS location for
                    presentation.
                  </span>
                </label>
                <select
                  value={demoWard}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setDemoWard("");
                      setCoords(null);
                    } else {
                      const wardId = parseInt(val);
                      setDemoWard(wardId);
                      setCoords({
                        lat: DEMO_WARDS[wardId].lat,
                        lng: DEMO_WARDS[wardId].lng,
                      });
                      toast.success(
                        `Demo GPS locked to ${DEMO_WARDS[wardId].name}`,
                      );
                    }
                  }}
                  className="w-full mt-2 p-3 rounded-lg border border-border bg-background text-sm cursor-pointer outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">-- Let Browser Grab Real GPS --</option>
                  {Object.entries(DEMO_WARDS).map(([id, info]) => (
                    <option key={id} value={id}>
                      {info.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <label className="text-sm font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-emerald-500" />
                Waste Type / Severity
              </div>
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setSeverity("low")}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all text-left flex flex-col gap-1 cursor-pointer border ${
                  severity === "low"
                    ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400 ring-1 ring-green-500/30"
                    : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <span className="font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Organic / Wet Waste
                </span>
                <span className="text-xs opacity-80 font-normal ml-4">
                  Food waste, leaves, compostable (Low Severity)
                </span>
              </button>

              <button
                onClick={() => setSeverity("medium")}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all text-left flex flex-col gap-1 cursor-pointer border ${
                  severity === "medium"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500/30"
                    : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <span className="font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Recyclable / Dry Waste
                </span>
                <span className="text-xs opacity-80 font-normal ml-4">
                  Plastics, paper, glass, cardboard (Medium Severity)
                </span>
              </button>

              <button
                onClick={() => setSeverity("high")}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all text-left flex flex-col gap-1 cursor-pointer border ${
                  severity === "high"
                    ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400 ring-1 ring-red-500/30"
                    : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <span className="font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Hazardous / Mixed / E-Waste
                </span>
                <span className="text-xs opacity-80 font-normal ml-4">
                  Batteries, medical, large mixed dumps (High Severity)
                </span>
              </button>
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
            By submitting, your GPS location and device info will be recorded
            for accountability.
          </p>
        </div>
      ) : (
        /* My Impact Tab */
        <div className="max-w-lg mx-auto px-4 py-6">
          {impactLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : impact ? (
            <div className="space-y-6">
              {/* Clean Score Hero */}
              <div className="text-center py-8">
                <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center relative">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/20"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${(impact.cleanScore / 100) * 314} 314`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="scoreGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-3xl font-bold">
                    {impact.cleanScore}
                  </span>
                </div>
                <h2 className="text-lg font-bold">Your Clean Score</h2>
                <p className="text-sm text-muted-foreground">
                  {impact.cleanScore >= 80
                    ? "🌟 Champion Reporter!"
                    : impact.cleanScore >= 50
                      ? "💪 Active Contributor"
                      : "🌱 Getting Started"}
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <BarChart3 className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-2xl font-bold">{impact.totalReports}</p>
                  <p className="text-xs text-muted-foreground">Reports Filed</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                  <p className="text-2xl font-bold">{impact.resolvedReports}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <Clock className="w-5 h-5 text-amber-500 mb-2" />
                  <p className="text-2xl font-bold">
                    {impact.avgCleanupMinutes}
                    <span className="text-sm font-normal">m</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Cleanup</p>
                </div>
                <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <Trophy className="w-5 h-5 text-violet-500 mb-2" />
                  <p className="text-2xl font-bold">
                    {impact.totalReports > 0
                      ? Math.round(
                          (impact.resolvedReports / impact.totalReports) * 100,
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Resolution Rate
                  </p>
                </div>
              </div>

              {impact.totalReports === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    No reports yet. Switch to the Report tab and start making an
                    impact!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                Unable to load impact data.
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
