"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { getIncidents, getMetrics } from "@/actions/admin";
import {
  getWardLeaderboard,
  getRecurringHotspots,
  getTrendData,
} from "@/actions/leaderboard";
import type { Incident, AdminMetrics, IncidentFilters } from "@/lib/types";
import type { WardScore, RecurringHotspot } from "@/actions/leaderboard";
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
  X,
  Users,
  Target,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Download,
  QrCode,
  Medal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ErrorBoundary } from "@/components/error-boundary";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";

const IncidentMap = dynamic(() => import("@/components/incident-map"), {
  ssr: false,
});

const WARD_NAMES: Record<number, string> = {
  12: "Meenakshi Temple Zone",
  45: "Anna Nagar Zone",
  68: "Bypass Road Zone",
};

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );
  const [filters, setFilters] = useState<IncidentFilters>({ status: "all" });
  const [showFilters, setShowFilters] = useState(false);
  const [wardScores, setWardScores] = useState<WardScore[]>([]);
  const [hotspots, setHotspots] = useState<RecurringHotspot[]>([]);
  const [trendData, setTrendData] = useState<
    { date: string; reports: number; avgResponse: number }[]
  >([]);
  const [now] = useState(() => Date.now());
  const router = useRouter();

  const loadData = useCallback(async () => {
    const [
      incidentsResult,
      metricsResult,
      leaderboardResult,
      hotspotsResult,
      trendResult,
    ] = await Promise.all([
      getIncidents(filters),
      getMetrics(),
      getWardLeaderboard(),
      getRecurringHotspots(),
      getTrendData(),
    ]);
    if (incidentsResult.data) setIncidents(incidentsResult.data);
    if (metricsResult.data) setMetrics(metricsResult.data);
    if (leaderboardResult.data) setWardScores(leaderboardResult.data);
    if (hotspotsResult.data) setHotspots(hotspotsResult.data);
    if (trendResult.data) setTrendData(trendResult.data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    Promise.resolve().then(() => loadData());
  }, [loadData]);

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

  const exportCSV = () => {
    if (!incidents.length) return;
    const headers = [
      "ID",
      "Ward",
      "Status",
      "Severity",
      "Description",
      "Reported At",
      "Response Time (min)",
      "Latitude",
      "Longitude",
    ];
    const rows = incidents.map((i) => [
      i.id,
      i.ward_number ?? "",
      i.status,
      i.severity,
      `"${(i.description || "").replace(/"/g, '""')}"`,
      i.reported_at,
      i.response_time_minutes ?? "",
      i.latitude,
      i.longitude,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cleanchain-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported!");
  };

  const resolutionRate =
    metrics && metrics.pendingCount + metrics.resolvedCount > 0
      ? Math.round(
          (metrics.resolvedCount /
            (metrics.pendingCount + metrics.resolvedCount)) *
            100,
        )
      : 0;

  const pendingIncidents = incidents.filter((i) => i.status === "pending");

  const formatTimeAgo = (dateStr: string) => {
    const diff = now - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-192.png"
              alt="CleanChain"
              className="w-8 h-8 rounded-lg"
            />
            <div>
              <h1 className="font-bold text-sm">CleanChain Admin</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                showHeatmap
                  ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
                  : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
              }`}
            >
              <Flame className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Heatmap</span>
            </button>
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">QR Poster</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-all cursor-pointer"
            >
              <Filter className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => {
                setLoading(true);
                loadData();
              }}
              className="p-2 rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-all cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="border-t border-border px-4 py-3">
            <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-3">
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

      <div className="max-w-[1400px] mx-auto p-4 space-y-4">
        {/* ═══ TOP: City Overview Cards ═══ */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <OverviewCard
              icon={<BarChart3 className="w-5 h-5" />}
              iconBg="bg-blue-500/10 text-blue-500"
              label="Reports Today"
              value={metrics.totalToday}
            />
            <OverviewCard
              icon={<Clock className="w-5 h-5" />}
              iconBg="bg-amber-500/10 text-amber-500"
              label="Avg Response"
              value={`${metrics.avgResponseMinutes}m`}
            />
            <OverviewCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              iconBg="bg-emerald-500/10 text-emerald-500"
              label="Resolution Rate"
              value={`${resolutionRate}%`}
              highlight={resolutionRate >= 70}
            />
            <OverviewCard
              icon={<Users className="w-5 h-5" />}
              iconBg="bg-indigo-500/10 text-indigo-500"
              label="Active Wards"
              value={wardScores.length}
            />
            <OverviewCard
              icon={<Target className="w-5 h-5" />}
              iconBg="bg-red-500/10 text-red-500"
              label="Hotspots"
              value={hotspots.length}
              alert={hotspots.length > 0}
            />
          </div>
        )}

        {/* ═══ MIDDLE: Split Screen — Map + Live Feed ═══ */}
        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-4"
          style={{ minHeight: "55vh" }}
        >
          {/* Map (takes 3 cols) */}
          <div
            className="lg:col-span-3 rounded-2xl border border-border overflow-hidden bg-card"
            style={{ minHeight: "50vh" }}
          >
            <ErrorBoundary>
              {!loading ? (
                <IncidentMap
                  incidents={incidents}
                  showHeatmap={showHeatmap}
                  onMarkerClick={setSelectedIncident}
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-3 animate-pulse"
                  style={{ minHeight: "50vh" }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted" />
                  <div className="h-3 w-32 rounded bg-muted" />
                  <div className="h-2 w-24 rounded bg-muted" />
                </div>
              )}
            </ErrorBoundary>
          </div>

          {/* Live Incident Feed (takes 2 cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live Incident Feed
              </h3>
              <span className="text-xs text-muted-foreground">
                {pendingIncidents.length} pending
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border max-h-[50vh]">
              {incidents.slice(0, 20).map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="w-full p-3 hover:bg-muted/30 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={inc.photo_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            inc.status === "pending"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          {inc.status}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${
                            inc.severity === "high"
                              ? "bg-red-500/5 text-red-400"
                              : inc.severity === "medium"
                                ? "bg-orange-500/5 text-orange-400"
                                : "bg-yellow-500/5 text-yellow-500"
                          }`}
                        >
                          {inc.severity}
                        </span>
                        {inc.ward_number && (
                          <span className="text-[10px] text-muted-foreground">
                            Ward {inc.ward_number}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {inc.description || "No description"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {formatTimeAgo(inc.reported_at)}
                        </span>
                        {inc.response_time_minutes && (
                          <span className="text-[10px] text-emerald-500 font-medium">
                            ✓ {inc.response_time_minutes}m
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Before/After indicator */}
                    {inc.clearance_photo_url && (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 border-emerald-500/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={inc.clearance_photo_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </button>
              ))}
              {incidents.length === 0 && !loading && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No incidents found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM: Trend Charts + Ward Leaderboard ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Reports Trend Chart */}
          <ErrorBoundary>
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                Reports (Last 7 Days)
              </h3>
              <div className="h-52">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        stroke="var(--border)"
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        stroke="var(--border)"
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "var(--foreground)",
                        }}
                      />
                      <Bar
                        dataKey="reports"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No data yet
                  </div>
                )}
              </div>
            </div>
          </ErrorBoundary>

          {/* Response Time Trend */}
          <ErrorBoundary>
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Avg Response Time (Last 7 Days)
              </h3>
              <div className="h-52">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        stroke="var(--border)"
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        stroke="var(--border)"
                        unit="m"
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "var(--foreground)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgResponse"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#f59e0b" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No data yet
                  </div>
                )}
              </div>
            </div>
          </ErrorBoundary>
        </div>

        {/* Ward Leaderboard */}
        {wardScores.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Ward Clean Score Leaderboard
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {wardScores.slice(0, 9).map((w, idx) => (
                <div
                  key={w.ward_number}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all hover:bg-muted/30 ${
                    idx === 0
                      ? "border-amber-500/30 bg-amber-500/5"
                      : idx === 1
                        ? "border-slate-400/30 bg-slate-400/5"
                        : idx === 2
                          ? "border-orange-700/30 bg-orange-700/5"
                          : "border-border bg-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Rank */}
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        idx === 0
                          ? "bg-amber-500/20 text-amber-500"
                          : idx === 1
                            ? "bg-slate-400/20 text-slate-400"
                            : idx === 2
                              ? "bg-orange-700/20 text-orange-700"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {idx < 3 ? <Medal className="w-4 h-4" /> : idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-1">
                          Ward {w.ward_number}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold">
                            {w.clean_score}
                          </span>
                          {w.trend === "up" ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                          ) : w.trend === "down" ? (
                            <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                          ) : (
                            <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Score Bar */}
                      <div className="w-full h-1.5 rounded-full bg-muted/30 mt-1.5">
                        <div
                          className={`h-full rounded-full transition-all ${
                            w.clean_score >= 70
                              ? "bg-emerald-500"
                              : w.clean_score >= 40
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${w.clean_score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Non-Expandable Inline Stats */}
                  <div className="w-full mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Pending
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {w.pending_count}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Resolved
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {w.resolved_count}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Avg Response
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {w.avg_response_minutes}m
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recurring Hotspots */}
        {hotspots.length > 0 && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-red-500">
              <Flame className="w-4 h-4" />
              Recurring Hotspot Zones ({hotspots.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {hotspots.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-red-500/10"
                >
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {h.incident_count} incidents
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {h.ward_number
                        ? `Ward ${h.ward_number} - ${WARD_NAMES[h.ward_number] || "City Zone"}`
                        : "Unmapped Zone"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══ Incident Detail Modal ═══ */}
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
              {/* Before / After Comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Before
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedIncident.photo_url}
                    alt="Incident"
                    className="w-full h-40 object-cover rounded-xl border border-border"
                  />
                </div>
                {selectedIncident.clearance_photo_url ? (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                      After
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedIncident.clearance_photo_url}
                      alt="Clearance"
                      className="w-full h-40 object-cover rounded-xl border border-emerald-500/30"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
                    <p className="text-xs text-muted-foreground">
                      Awaiting cleanup
                    </p>
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

      {/* ═══ QR Code Poster Modal ═══ */}
      {showQrModal && (
        <div className="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-4 print:p-0 print:bg-white animate-fade-in">
          <div className="bg-white text-black p-8 sm:p-12 rounded-3xl w-full max-w-md relative flex flex-col items-center justify-center text-center print:shadow-none print:w-full print:h-screen print:max-w-none print:rounded-none">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors print:hidden cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <div className="mb-8 print:mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-2 print:text-5xl">
                CleanChain
              </h2>
              <p className="text-xl font-medium text-emerald-600 print:text-2xl">
                Scan to Report Waste
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] mb-8 border border-slate-100 print:border-8 print:border-slate-100 print:p-12">
              <QRCode
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/en/citizen`}
                size={200}
                className="print:w-64 print:h-64"
              />
            </div>

            <div className="space-y-4 w-full print:space-y-6">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 print:border-none print:bg-transparent justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0 text-lg">
                  1
                </div>
                <p className="text-base font-semibold text-slate-700 print:text-xl">
                  Scan the Code
                </p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 print:border-none print:bg-transparent justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0 text-lg">
                  2
                </div>
                <p className="text-base font-semibold text-slate-700 print:text-xl">
                  Snap a Photo
                </p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 print:border-none print:bg-transparent justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0 text-lg">
                  3
                </div>
                <p className="text-base font-semibold text-slate-700 print:text-xl">
                  We Clean It Up!
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors print:hidden cursor-pointer w-full"
            >
              Print Poster
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ── Sub-components ── */

function OverviewCard({
  icon,
  iconBg,
  label,
  value,
  highlight,
  alert,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  highlight?: boolean;
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
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${iconBg}`}
      >
        {icon}
      </div>
      <p
        className={`text-2xl font-bold ${highlight ? "text-emerald-500" : ""}`}
      >
        <motion.span
          key={value}
          initial={{ scale: 1.5, color: "#10b981" }}
          animate={{ scale: 1, color: highlight ? "#10b981" : "inherit" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
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
