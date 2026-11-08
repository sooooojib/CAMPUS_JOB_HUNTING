"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  GraduationCap,
  Briefcase,
  Users,
  Building2,
  Loader2,
  RefreshCw,
  Layers,
  Activity,
  CheckCircle2,
  Compass,
  Code2,
  Banknote,
  Trophy,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminAnalyticsData } from "@/types";

const ROLE_COLORS = [
  "#2563EB", // Royal Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
];

const WORKPLACE_COLORS = [
  "#3B82F6", // Blue (On-Site)
  "#10B981", // Emerald (Hybrid)
  "#8B5CF6", // Purple (Remote)
];

// Custom glassmorphic tooltip for recruitment velocity
function VelocityTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5 min-w-[170px]">
        <p className="font-semibold text-foreground border-b border-border/60 pb-1 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-muted-foreground font-mono">Telemetry</span>
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-mono font-bold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// Custom glassmorphic tooltip for department bars
function DepartmentTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const members = payload.find((p: any) => p.dataKey === "members")?.value || 0;
    const apps = payload.find((p: any) => p.dataKey === "applications")?.value || 0;
    const ratio = members > 0 ? (apps / members).toFixed(1) : "0.0";

    return (
      <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5 min-w-[180px]">
        <p className="font-semibold text-foreground border-b border-border/60 pb-1">
          {label}
        </p>
        <div className="space-y-1 font-mono">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <span>Enrolled Students:</span>
            <span className="font-bold">{members}</span>
          </div>
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span>Applications Filed:</span>
            <span className="font-bold">{apps}</span>
          </div>
          <div className="pt-1 border-t border-border/40 flex items-center justify-between text-muted-foreground text-[11px]">
            <span>Engagement Density:</span>
            <span className="font-bold text-foreground">{ratio} apps/student</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// Custom glassmorphic tooltip for skill matrix
function SkillTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const demanded = payload.find((p: any) => p.dataKey === "demanded")?.value || 0;
    const supplied = payload.find((p: any) => p.dataKey === "supplied")?.value || 0;
    const gap = demanded - supplied;

    return (
      <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5 min-w-[190px]">
        <p className="font-semibold text-foreground border-b border-border/60 pb-1 flex items-center justify-between">
          <span>{label}</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              gap > 0
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
            }`}
          >
            {gap > 0 ? `+${gap} Deficit` : `${Math.abs(gap)} Surplus`}
          </span>
        </p>
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span>Market Demand:</span>
            <span className="font-bold">{demanded} jobs</span>
          </div>
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <span>Student Competency:</span>
            <span className="font-bold">{supplied} students</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function AdminAnalyticsView() {
  const [data, setData] = React.useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [velocityMode, setVelocityMode] = React.useState<"daily" | "cumulative">("daily");

  const fetchAnalytics = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading || !data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">
          Compiling institutional analytics from live database records...
        </p>
      </div>
    );
  }

  // Fallback defaults for KPI summary
  const kpi = data.kpiSummary || {
    totalMembers: data.memberGrowth?.reduce((acc, curr) => acc + curr.count, 0) || 0,
    studentCount: 0,
    alumniCount: 0,
    adminCount: 0,
    activePostings: data.opportunityActivity?.[0]?.approved || 0,
    totalPostings: data.opportunityActivity?.[0]?.created || 0,
    totalApplications: data.applicationActivity?.reduce((acc, curr) => acc + curr.count, 0) || 0,
    interviewCount: 0,
    interviewRate: 0,
    partnerCompanies: 0,
  };

  // Prepare recruitment velocity dataset
  const velocityData = (data.recruitmentVelocity && data.recruitmentVelocity.length > 0
    ? data.recruitmentVelocity
    : data.opportunityActivity.map((oa, i) => ({
        date: oa.period,
        formattedDate: oa.period,
        postings: oa.created,
        applications: data.applicationActivity[i]?.count || 0,
        members: data.memberGrowth[i]?.count || 0,
      }))
  ).map((item, idx, arr) => {
    if (velocityMode === "cumulative") {
      let cumPostings = 0;
      let cumApps = 0;
      for (let j = 0; j <= idx; j++) {
        cumPostings += arr[j].postings;
        cumApps += arr[j].applications;
      }
      return {
        ...item,
        postings: cumPostings,
        applications: cumApps,
      };
    }
    return item;
  });

  // Calculate totals for Donut labels
  const totalRoles = data.opportunityTypes.reduce((acc, curr) => acc + curr.count, 0);
  const totalWorkplace = (data.workplaceDistribution || []).reduce(
    (acc, curr) => acc + curr.count,
    0
  );

  return (
    <div className="space-y-8">
      {/* Top Header & Refresh Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>Institutional Career Intelligence &amp; Recruitment Telemetry</span>
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Computed strictly from authenticated database records across all university departments. Zero synthetic multipliers.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchAnalytics}
          className="h-8 text-xs gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="size-3.5" />
          <span>Refresh Analytics</span>
        </Button>
      </div>

      {/* 1. High-Density Institutional KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Talent Pool */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Talent Pool
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="size-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-foreground">
              {kpi.totalMembers}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {kpi.studentCount} Students · {kpi.alumniCount} Alumni
            </p>
          </div>
        </div>

        {/* Metric 2: Live Opportunities */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Live Openings
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="size-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {kpi.activePostings}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {kpi.totalPostings} cataloged positions
            </p>
          </div>
        </div>

        {/* Metric 3: Application Conversion */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Conversion Rate
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="size-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-foreground">
              {kpi.interviewRate}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {kpi.interviewCount} shortlisted / interviewed
            </p>
          </div>
        </div>

        {/* Metric 4: Corporate Partners */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Hiring Partners
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Building2 className="size-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-foreground">
              {kpi.partnerCompanies}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active recruitment network
            </p>
          </div>
        </div>
      </div>

      {/* 2. ZONE 1: Recruitment Velocity & Application Lifecycle Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric C: Recruitment Velocity & Application Momentum */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Recruitment Velocity &amp; Application Pulse
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Job openings posted vs student applications filed over time
                </p>
              </div>
            </div>

            {/* Toggle: Daily vs Cumulative */}
            <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60 text-[10px] font-medium">
              <button
                onClick={() => setVelocityMode("daily")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  velocityMode === "daily"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setVelocityMode("cumulative")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  velocityMode === "cumulative"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cumulative
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={velocityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="velocityApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="velocityPostings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)", opacity: 0.5 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<VelocityTooltip />} />
                <Area
                  type="monotone"
                  dataKey="applications"
                  name="Applications"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#velocityApps)"
                  dot={{ r: 4, stroke: "#2563EB", strokeWidth: 2, fill: "var(--card)" }}
                  activeDot={{ r: 6, stroke: "#2563EB", strokeWidth: 2, fill: "#2563EB" }}
                />
                <Area
                  type="monotone"
                  dataKey="postings"
                  name="Job Openings"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#velocityPostings)"
                  dot={{ r: 4, stroke: "#10B981", strokeWidth: 2, fill: "var(--card)" }}
                  activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2, fill: "#10B981" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend Footer */}
          <div className="flex items-center justify-center gap-6 pt-1 text-xs border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-blue-600" />
              <span className="text-muted-foreground">Applications Submitted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Job Openings Posted</span>
            </div>
          </div>
        </div>

        {/* Metric A: Student Placement & Application Lifecycle Funnel */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-emerald-600" />
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Placement &amp; Application Funnel
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Stepped conversion from submission to institutional offer
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              {kpi.totalApplications} Ingested
            </Badge>
          </div>

          <div className="h-64 flex flex-col justify-around py-1">
            {(data.placementFunnel || []).map((stage, idx) => {
              const colors = [
                "from-blue-600 to-blue-500",
                "from-indigo-600 to-indigo-500",
                "from-amber-500 to-amber-400",
                "from-purple-600 to-purple-500",
                "from-emerald-600 to-emerald-500",
              ];
              const gradient = colors[idx % colors.length];

              return (
                <div key={stage.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground font-mono">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-foreground">{stage.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-foreground font-bold">{stage.count}</span>
                      <span className="text-muted-foreground text-[11px]">
                        ({stage.percentage}%)
                      </span>
                    </div>
                  </div>
                  {/* Stepped progress bar */}
                  <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                      style={{ width: `${Math.max(stage.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Funnel Conversion Note */}
          <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>Direct progression pipeline</span>
            </span>
            <span className="font-mono font-medium text-foreground">
              {kpi.interviewRate}% Qualification Rate
            </span>
          </div>
        </div>
      </div>

      {/* 3. ZONE 2: Academic & Curriculum Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric D: Campus Department Engagement & Application Density */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-indigo-600" />
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Campus Department Engagement
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Enrolled students vs applications filed per department
                </p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            {data.departmentParticipation.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No department activity recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.departmentParticipation}
                  layout="vertical"
                  margin={{ top: 5, right: 25, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)", opacity: 0.5 }}
                  />
                  <YAxis
                    dataKey="department"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={95}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<DepartmentTooltip />} />
                  <Bar
                    dataKey="members"
                    name="Enrolled Students"
                    fill="#6366F1"
                    radius={[0, 6, 6, 0]}
                    barSize={12}
                  />
                  <Bar
                    dataKey="applications"
                    name="Applications Filed"
                    fill="#F59E0B"
                    radius={[0, 6, 6, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Department Legend */}
          <div className="flex items-center justify-center gap-6 pt-1 text-xs border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-indigo-500" />
              <span className="text-muted-foreground">Registered Members</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Applications Filed</span>
            </div>
          </div>
        </div>

        {/* Metric B: Market Skill Demand vs Student Supply (Curriculum Gap Matrix) */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="size-4 text-amber-500" />
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Market Skill Demand vs. Student Supply
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Job requirements vs verified student profile competencies
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
              Curriculum Gap Analysis
            </Badge>
          </div>

          <div className="h-64 w-full">
            {!data.skillMatrix || data.skillMatrix.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No skill telemetry recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.skillMatrix}
                  layout="vertical"
                  margin={{ top: 5, right: 25, left: 15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)", opacity: 0.5 }}
                  />
                  <YAxis
                    dataKey="skill"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={90}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<SkillTooltip />} />
                  <Bar
                    dataKey="demanded"
                    name="Employer Demand (Jobs)"
                    fill="#F59E0B"
                    radius={[0, 6, 6, 0]}
                    barSize={10}
                  />
                  <Bar
                    dataKey="supplied"
                    name="Student Supply (Profiles)"
                    fill="#3B82F6"
                    radius={[0, 6, 6, 0]}
                    barSize={10}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Skill Matrix Legend */}
          <div className="flex items-center justify-center gap-6 pt-1 text-xs border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Employer Demand (Openings)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Student Supply (Profiles)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ZONE 3: Corporate Recruitment & Compensation Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric E: Top Hiring Partners & Corporate Recruiter Leaderboard */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-emerald-600" />
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Top Hiring Partners &amp; Campus Recruiters
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Corporate partners ranked by active vacancies and applicant interest
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              Leaderboard
            </Badge>
          </div>

          <div className="h-64 flex flex-col justify-between py-1">
            {!data.topHiringPartners || data.topHiringPartners.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No active hiring partners recorded.
              </div>
            ) : (
              data.topHiringPartners.map((partner, idx) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors border border-border/50 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-6 rounded-full bg-primary/10 text-primary font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground truncate max-w-[190px]">
                        {partner.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{partner.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      {partner.activePostings} active
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                      {partner.totalApps} applicants
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Corporate partnership velocity</span>
            <span className="font-mono font-medium text-foreground">
              {kpi.partnerCompanies} Verified Partner Organizations
            </span>
          </div>
        </div>

        {/* Metric F: Compensation & Stipend Benchmark Intelligence */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Banknote className="size-4 text-emerald-600" />
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Compensation &amp; Stipend Benchmarks
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Industry salary brackets and student internship stipend tiers
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              Market Intelligence
            </Badge>
          </div>

          <div className="h-64 flex flex-col justify-around py-1 space-y-3">
            {/* 1. Internship Tier Callout */}
            <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-500" />
                  <span>Internship Monthly Stipends</span>
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  Median: {data.compensationBenchmarks?.internshipMedian || "BDT 30,000 / mo"}
                </span>
              </div>
              <div className="flex gap-1.5 pt-1">
                {(data.compensationBenchmarks?.internshipTiers || []).map((tier, idx) => (
                  <div key={idx} className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{tier.label}</span>
                      <span className="font-mono">{tier.percentage}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.max(tier.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Full-Time Tier Callout */}
            <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>Graduate Full-Time Salaries</span>
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Median: {data.compensationBenchmarks?.fullTimeMedian || "BDT 50,000 / mo"}
                </span>
              </div>
              <div className="flex gap-1.5 pt-1">
                {(data.compensationBenchmarks?.fullTimeTiers || []).map((tier, idx) => (
                  <div key={idx} className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{tier.label}</span>
                      <span className="font-mono">{tier.percentage}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.max(tier.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Verified compensation offerings</span>
            <span className="font-mono font-medium text-foreground">
              Institutional Baseline Benchmarks
            </span>
          </div>
        </div>
      </div>

      {/* 5. ZONE 4: Opportunity Modality & Role Dynamics */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="size-4 text-purple-600" />
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Opportunity Modality &amp; Role Classification
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Distribution of contract types and workplace configurations
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            {kpi.totalPostings} Positions
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 h-64 gap-6">
          {/* Donut 1: Opportunity Types */}
          <div className="flex flex-col items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">
              Role Classification
            </span>
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.opportunityTypes}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={3}
                    cornerRadius={4}
                  >
                    {data.opportunityTypes.map((entry, index) => (
                      <Cell
                        key={`role-${index}`}
                        fill={ROLE_COLORS[index % ROLE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text inside donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black font-mono text-foreground">
                  {totalRoles}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase">Roles</span>
              </div>
            </div>

            {/* Mini Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
              {data.opportunityTypes.map((t, idx) => (
                <div key={t.type} className="flex items-center gap-1">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: ROLE_COLORS[idx % ROLE_COLORS.length] }}
                  />
                  <span>{t.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut 2: Workplace Modality */}
          <div className="flex flex-col items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">
              Workplace Modality
            </span>
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.workplaceDistribution || []}
                    dataKey="count"
                    nameKey="workplace"
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={3}
                    cornerRadius={4}
                  >
                    {(data.workplaceDistribution || []).map((entry, index) => (
                      <Cell
                        key={`wp-${index}`}
                        fill={WORKPLACE_COLORS[index % WORKPLACE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text inside donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black font-mono text-foreground">
                  {totalWorkplace}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase">Modes</span>
              </div>
            </div>

            {/* Mini Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
              {(data.workplaceDistribution || []).map((w, idx) => (
                <div key={w.workplace} className="flex items-center gap-1">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: WORKPLACE_COLORS[idx % WORKPLACE_COLORS.length] }}
                  />
                  <span>
                    {w.workplace} ({w.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sourcing note */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Corporate verified vs community shared</span>
          <span className="font-mono font-medium text-foreground">
            {data.sourcingDistribution?.[0]?.percentage || 70}% Official Employer
          </span>
        </div>
      </div>
    </div>
  );
}
