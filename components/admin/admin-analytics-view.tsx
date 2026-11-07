"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  GraduationCap,
  Briefcase,
  Users,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminAnalyticsData } from "@/types";

const COLORS = [
  "#2563EB", // Primary Royal Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#14B8A6", // Teal
  "#F97316", // Orange
];

export function AdminAnalyticsView() {
  const [data, setData] = React.useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [memberSearch, setMemberSearch] = React.useState("");

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

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Institutional Career Intelligence &amp; Platform Metrics
          </h3>
          <p className="text-xs text-muted-foreground">
            Strictly computed from verified PostgreSQL rows across all campus departments.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchAnalytics}
          className="h-8 text-xs gap-1.5"
        >
          <RefreshCw className="size-3.5" />
          <span>Refresh Analytics</span>
        </Button>
      </div>

      {/* Grid of Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Member Growth Over Time */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Member Registrations (Last 6 Months)
              </h4>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.memberGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="New Members"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#2563EB" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Opportunity Activity: Created vs Approved */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-emerald-600" />
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Opportunity Volume (Created vs Approved)
              </h4>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.opportunityActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="created" name="Total Submitted" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Department Participation */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-indigo-600" />
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Department Activity (Top Campus Departments)
              </h4>
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
                  margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="department" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="members" name="Members" fill="#6366F1" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="applications" name="Applications" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 4. Opportunity Types Breakdown & Verification Ratios */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="size-4 text-purple-600" />
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Opportunity Types &amp; Verification Health
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-2 h-64 gap-2">
            {/* Opportunity Types Pie */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-medium text-muted-foreground mb-1">
                Opportunity Types
              </span>
              <div className="h-52 w-full">
                {data.opportunityTypes.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] text-muted-foreground">
                    No postings
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.opportunityTypes}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={55}
                        innerRadius={30}
                        paddingAngle={3}
                      >
                        {data.opportunityTypes.map((entry, index) => (
                          <Cell key={`type-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "0.5rem",
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Verification Status Pie */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-medium text-muted-foreground mb-1">
                Member Verification
              </span>
              <div className="h-52 w-full">
                {data.verificationBreakdown.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] text-muted-foreground">
                    No members
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.verificationBreakdown}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={55}
                        innerRadius={30}
                        paddingAngle={3}
                      >
                        {data.verificationBreakdown.map((entry, index) => (
                          <Cell
                            key={`verif-${index}`}
                            fill={
                              entry.status === "VERIFIED"
                                ? "#10B981"
                                : entry.status === "PENDING"
                                ? "#F59E0B"
                                : entry.status === "REJECTED"
                                ? "#EF4444"
                                : "#6B7280"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "0.5rem",
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Member Activity Breakdown ("সবার Details") */}
      {data.memberActivityDetails && data.memberActivityDetails.length > 0 && (
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span>Member Activity &amp; Engagement Audit (&quot;সবার Details&quot;)</span>
              </h4>
              <p className="text-xs text-muted-foreground">
                Exhaustive activity breakdown per verified institutional member.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search member name or email..."
                className="pl-8 h-8 text-xs bg-background"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[260px]">Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead className="text-center">Applications</TableHead>
                  <TableHead className="text-center">Postings</TableHead>
                  <TableHead className="text-center">Posts / Comments</TableHead>
                  <TableHead>Joined Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/60">
                {data.memberActivityDetails
                  .filter((m) => {
                    const q = memberSearch.toLowerCase();
                    return (
                      !q ||
                      m.name.toLowerCase().includes(q) ||
                      m.email.toLowerCase().includes(q)
                    );
                  })
                  .slice(0, 50)
                  .map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/20 text-xs">
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground">{member.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{member.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.membershipType === "ADMIN"
                              ? "destructive"
                              : member.membershipType === "ALUMNI"
                              ? "outline"
                              : "secondary"
                          }
                          className="text-[10px] font-mono"
                        >
                          {member.membershipType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={member.verificationStatus === "VERIFIED" ? "secondary" : "outline"}
                          className={`text-[10px] font-mono ${
                            member.verificationStatus === "VERIFIED"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : ""
                          }`}
                        >
                          {member.verificationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-mono font-semibold">
                        {member.applicationsCount}
                      </TableCell>
                      <TableCell className="text-center font-mono font-semibold">
                        {member.opportunitiesCount}
                      </TableCell>
                      <TableCell className="text-center font-mono text-muted-foreground">
                        <span className="font-semibold text-foreground">{member.postsCount}</span>
                        <span className="mx-1">/</span>
                        <span>{member.commentsCount}</span>
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground text-[11px]">
                        {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                          new Date(member.createdAt)
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

