"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { getIncidents, getMetrics } from "@/actions/admin";
import type { Incident, AdminMetrics, IncidentFilters } from "@/lib/types";
import {
  MapPin,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  LogOut,
  RefreshCw,
  Flame,
  TrendingUp,
  Eye,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

const IncidentMap = dynamic(() => import("@/components/incident-map"), {
  ssr: false,
});

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );
  const [filters, setFilters] = useState<IncidentFilters>({ status: "all" });
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const loadData = useCallback(async () => {
    const [incidentsResult, metricsResult] = await Promise.all([
      getIncidents(filters),
      getMetrics(),
    ]);
    if (incidentsResult.data) setIncidents(incidentsResult.data);
    if (metricsResult.data) setMetrics(metricsResult.data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Supabase Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("incidents-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "incidents" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setIncidents((prev) => [payload.new as Incident, ...prev]);
            toast.info("New incident reported!", {
              icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
            });
          }
          if (payload.eventType === "UPDATE") {
            setIncidents((prev) =>
              prev.map((i) =>
                i.id === (payload.new as Incident).id
                  ? (payload.new as Incident)
                  : i,
              ),
            );
            if ((payload.new as Incident).status === "resolved") {
              toast.success("Incident resolved!", {
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
              });
            }
          }
          loadData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const pendingIncidents = incidents.filter((i) => i.status === "pending");
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved");

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">CleanChain Admin</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                showHeatmap
                  ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
                  : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Heatmap
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-all cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button
              onClick={() => {
                setLoading(true);
                loadData();
              }}
              className="p-2 rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-all cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters bar */}
        {showFilters && (
          <div className="border-t border-border px-4 py-3">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
              <select
                value={filters.status || "all"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as IncidentFilters["status"],
                  })
                }
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={filters.severity || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    severity: (e.target.value ||
                      undefined) as IncidentFilters["severity"],
                  })
                }
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dateFrom: e.target.value || undefined,
                  })
                }
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                onClick={() => {
                  setFilters({ status: "all" });
                  setShowFilters(false);
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Metrics panel */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <MetricCard
              icon={<BarChart3 className="w-4 h-4 text-emerald-500" />}
              label="Today"
              value={metrics.totalToday}
            />
            <MetricCard
              icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
              label="Pending"
              value={metrics.pendingCount}
              alert={metrics.pendingCount > 0}
            />
            <MetricCard
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              label="Resolved"
              value={metrics.resolvedCount}
            />
            <MetricCard
              icon={<Clock className="w-4 h-4 text-blue-500" />}
              label="Avg Response"
              value={`${metrics.avgResponseMinutes}m`}
            />
            <MetricCard
              icon={<TrendingUp className="w-4 h-4 text-orange-500" />}
              label="Top Ward"
              value={
                metrics.topWards[0]
                  ? `#${metrics.topWards[0].ward_number}`
                  : "—"
              }
            />
          </div>
        )}

        {/* Map */}
        <div
          className="rounded-2xl border border-border overflow-hidden bg-card"
          style={{ height: "60vh" }}
        >
          {!loading && (
            <IncidentMap
              incidents={incidents}
              showHeatmap={showHeatmap}
              onMarkerClick={setSelectedIncident}
            />
          )}
          {loading && (
            <div className="w-full h-full flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          )}
        </div>

        {/* Top hotspot wards */}
        {metrics && metrics.topWards.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Top Hotspot Wards
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {metrics.topWards.map((ward) => (
                <div
                  key={ward.ward_number}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                >
                  <span className="text-sm font-medium">
                    Ward {ward.ward_number}
                  </span>
                  <span className="text-xs text-red-500 font-semibold bg-red-500/10 px-2 py-0.5 rounded">
                    {ward.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Incident detail modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg max-h-[80vh] overflow-y-auto animate-fade-up">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-semibold text-sm">Incident Details</h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Report Photo
                  </p>
                  <img
                    src={selectedIncident.photo_url}
                    alt="Incident"
                    className="w-full h-40 object-cover rounded-xl border border-border"
                  />
                </div>
                {selectedIncident.clearance_photo_url && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Clearance Photo
                    </p>
                    <img
                      src={selectedIncident.clearance_photo_url}
                      alt="Clearance"
                      className="w-full h-40 object-cover rounded-xl border border-border"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow
                  label="Status"
                  value={selectedIncident.status}
                  isStatus
                />
                <InfoRow label="Severity" value={selectedIncident.severity} />
                <InfoRow
                  label="Ward"
                  value={
                    selectedIncident.ward_number
                      ? `#${selectedIncident.ward_number}`
                      : "—"
                  }
                />
                <InfoRow
                  label="Response Time"
                  value={
                    selectedIncident.response_time_minutes
                      ? `${selectedIncident.response_time_minutes}m`
                      : "—"
                  }
                />
                <InfoRow
                  label="Reported"
                  value={new Date(
                    selectedIncident.reported_at,
                  ).toLocaleString()}
                />
                {selectedIncident.resolved_at && (
                  <InfoRow
                    label="Resolved"
                    value={new Date(
                      selectedIncident.resolved_at,
                    ).toLocaleString()}
                  />
                )}
              </div>

              {selectedIncident.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm">{selectedIncident.description}</p>
                </div>
              )}

              <div className="text-xs text-muted-foreground font-mono">
                <MapPin className="w-3 h-3 inline mr-1" />
                {selectedIncident.latitude.toFixed(6)},{" "}
                {selectedIncident.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  alert?: boolean;
}) {
  return (
    <div
      className={`relative p-4 rounded-xl border bg-card transition-all ${
        alert ? "border-red-500/30 bg-red-500/5" : "border-border"
      }`}
    >
      {alert && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      )}
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function InfoRow({
  label,
  value,
  isStatus,
}: {
  label: string;
  value: string;
  isStatus?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {isStatus ? (
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium ${
            value === "pending" ? "text-red-500" : "text-emerald-500"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${value === "pending" ? "bg-red-500" : "bg-emerald-500"}`}
          />
          {value}
        </span>
      ) : (
        <p className="text-sm font-medium capitalize">{value}</p>
      )}
    </div>
  );
}
