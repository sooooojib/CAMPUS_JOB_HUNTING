"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Target,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building2,
  Briefcase,
  Calendar,
  ExternalLink,
  Plus,
  Trash2,
  BookOpen,
  ArrowRight,
  Filter,
  Check,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddSemesterModal } from "./add-semester-modal";
import {
  OpportunityRecommendation,
  SkillGapAnalysisResult,
  AcademicRecordItem,
} from "@/types";

export function CareerDashboardView() {
  const [activeTab, setActiveTab] = React.useState<"MATCHES" | "SKILL_GAP" | "ACADEMIC">("MATCHES");

  // Recommendations state
  const [recommendations, setRecommendations] = React.useState<OpportunityRecommendation[]>([]);
  const [deptFilterOnly, setDeptFilterOnly] = React.useState(false);
  const [loadingRecs, setLoadingRecs] = React.useState(true);

  // Skill gap state
  const [skillGap, setSkillGap] = React.useState<SkillGapAnalysisResult | null>(null);
  const [loadingGap, setLoadingGap] = React.useState(true);

  // Academic profile state
  const [academicData, setAcademicData] = React.useState<{
    records: AcademicRecordItem[];
    cumulativeCgpa: number | null;
    department?: string | null;
    academicYear?: string | null;
  } | null>(null);
  const [loadingAcademic, setLoadingAcademic] = React.useState(true);
  const [isAddSemesterOpen, setIsAddSemesterOpen] = React.useState(false);

  // Fetch Recommendations
  const fetchRecommendations = React.useCallback(async () => {
    setLoadingRecs(true);
    try {
      const res = await fetch(`/api/career/recommendations?departmentFilterOnly=${deptFilterOnly}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setRecommendations(data.recommendations || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingRecs(false);
    }
  }, [deptFilterOnly]);

  // Fetch Skill Gap
  const fetchSkillGap = React.useCallback(async () => {
    setLoadingGap(true);
    try {
      const res = await fetch("/api/career/skill-gap");
      const data = await res.json();
      if (res.ok && data.success) {
        setSkillGap(data.data || null);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingGap(false);
    }
  }, []);

  // Fetch Academic Profile
  const fetchAcademicProfile = React.useCallback(async () => {
    setLoadingAcademic(true);
    try {
      const res = await fetch("/api/academic/records");
      const data = await res.json();
      if (res.ok && data.success) {
        setAcademicData(data.data || null);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingAcademic(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRecommendations();
    fetchSkillGap();
    fetchAcademicProfile();
  }, [fetchRecommendations, fetchSkillGap, fetchAcademicProfile]);

  // Handle Academic Record Deletion
  async function handleDeleteRecord(recordId: string) {
    if (!confirm("Delete this semester academic record? Your cumulative CGPA will be automatically recalculated.")) return;
    try {
      const res = await fetch(`/api/academic/records/${recordId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to delete record.");
      }
      toast.success("Semester record removed.");
      fetchAcademicProfile();
      fetchRecommendations();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function renderScoreBadge(score: number, color: "green" | "yellow" | "red") {
    let classes = "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
    if (color === "green") {
      classes = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    } else if (color === "yellow") {
      classes = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
    }

    return (
      <Badge variant="outline" className={`gap-1 font-mono font-bold text-xs px-2.5 py-0.5 border ${classes}`}>
        <Sparkles className="size-3" />
        <span>{score}% Match</span>
      </Badge>
    );
  }

  function renderEligibilityBadge(status: "ELIGIBLE" | "NOT_ELIGIBLE" | "NEEDS_REVIEW") {
    switch (status) {
      case "ELIGIBLE":
        return (
          <Badge variant="outline" className="gap-1 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs">
            <CheckCircle2 className="size-3" />
            <span>Eligible</span>
          </Badge>
        );
      case "NOT_ELIGIBLE":
        return (
          <Badge variant="outline" className="gap-1 border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10 text-xs">
            <XCircle className="size-3" />
            <span>Criteria Mismatch</span>
          </Badge>
        );
      case "NEEDS_REVIEW":
        return (
          <Badge variant="outline" className="gap-1 border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-xs">
            <HelpCircle className="size-3" />
            <span>Profile Incomplete</span>
          </Badge>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Non-Guarantee Regulatory Disclaimer */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">Explainable Smart Matching Policy</p>
          <p className="leading-relaxed text-amber-800 dark:text-amber-300">
            Skill match scores reflect mathematical overlap between your verified profile skills and job requirements: (Matched Required Skills / Total Required Skills) × 100. A high match score does not guarantee academic eligibility, interview shortlisting, or job offers.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "MATCHES" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("MATCHES")}
            className="text-xs font-semibold gap-1.5"
          >
            <Target className="size-3.5" />
            <span>Personalized Recommendations</span>
          </Button>

          <Button
            variant={activeTab === "SKILL_GAP" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("SKILL_GAP")}
            className="text-xs font-semibold gap-1.5"
          >
            <TrendingUp className="size-3.5" />
            <span>Skill Gap Analyzer</span>
          </Button>

          <Button
            variant={activeTab === "ACADEMIC" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("ACADEMIC")}
            className="text-xs font-semibold gap-1.5"
          >
            <GraduationCap className="size-3.5" />
            <span>Academic Performance &amp; CGPA</span>
          </Button>
        </div>

        {activeTab === "MATCHES" && (
          <div className="flex items-center gap-2 text-xs">
            <Button
              variant={deptFilterOnly ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setDeptFilterOnly(!deptFilterOnly)}
              className="text-xs gap-1"
            >
              <Filter className="size-3" />
              <span>{deptFilterOnly ? "My Department Only" : "All Departments"}</span>
            </Button>
          </div>
        )}
      </div>

      {/* TAB 1: RECOMMENDATIONS */}
      {activeTab === "MATCHES" && (
        <div className="space-y-4">
          {loadingRecs ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-5 rounded-xl border border-border bg-card animate-pulse space-y-3">
                  <div className="h-5 bg-muted rounded-md w-1/3" />
                  <div className="h-4 bg-muted rounded-md w-1/4" />
                  <div className="h-10 bg-muted rounded-md w-full" />
                </Card>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-16 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
              <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <Target className="size-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">No active recommendations found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Add skills to your profile or adjust your department filter to unlock personalized career matches.
              </p>
              <Link
                href="/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
              >
                <span>Update Profile Skills</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => {
                const opp = rec.opportunity;
                const match = rec.match;

                return (
                  <Card
                    key={opp.id}
                    className="rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/40 space-y-4"
                  >
                    <CardContent className="p-0 space-y-4">
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/opportunities/${opp.id}`}
                              className="text-base font-bold text-foreground hover:text-primary transition-colors"
                            >
                              {opp.title}
                            </Link>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm font-semibold text-primary">{opp.companyName}</span>
                            <Badge variant="outline" className="text-[10px] uppercase font-mono">
                              {opp.type.replace("_", " ")}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 flex-wrap">
                            <span>{opp.location} ({opp.workplaceType.replace("_", " ")})</span>
                            {opp.salaryOrStipend && <span>• {opp.salaryOrStipend}</span>}
                            <span>• Closes {new Date(opp.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {renderScoreBadge(match.matchPercentage, match.scoreColor)}
                          {renderEligibilityBadge(match.eligibility.status)}
                        </div>
                      </div>

                      {/* Explainability Block */}
                      <div className="rounded-lg bg-muted/40 p-3.5 border border-border/60 space-y-3 text-xs">
                        {/* Recommendation Reasons */}
                        {match.recommendationReasons.length > 0 && (
                          <div className="space-y-1">
                            <span className="font-semibold text-foreground">Why this opportunity is recommended:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                              {match.recommendationReasons.map((reason, idx) => (
                                <li key={idx}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Skill Overlap Breakdown */}
                        <div className="space-y-1.5 pt-1 border-t border-border/40">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-foreground">Skill Breakdown:</span>
                            <span className="text-muted-foreground">
                              {match.matchedSkills.length} of {match.totalRequiredSkills} required skills matched
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {match.matchedSkills.map((s, idx) => (
                              <span
                                key={`m-${idx}`}
                                className="inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-[11px] font-medium border border-emerald-500/20"
                              >
                                <Check className="size-3" />
                                <span>{s}</span>
                              </span>
                            ))}

                            {match.missingSkills.map((s, idx) => (
                              <span
                                key={`miss-${idx}`}
                                className="inline-flex items-center gap-1 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 px-2 py-0.5 text-[11px] font-medium border border-rose-500/20"
                              >
                                <XCircle className="size-3" />
                                <span>Missing: {s}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Eligibility Warning Notes */}
                        {match.eligibility.warnings.length > 0 && (
                          <div className="rounded bg-amber-500/10 p-2.5 text-amber-800 dark:text-amber-300 text-[11px] space-y-1 border border-amber-500/20">
                            <span className="font-semibold flex items-center gap-1">
                              <AlertCircle className="size-3.5 text-amber-600" />
                              <span>Eligibility Advisories:</span>
                            </span>
                            <ul className="list-disc list-inside space-y-0.5 pl-1">
                              {match.eligibility.warnings.map((w, idx) => (
                                <li key={idx}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="text-[11px] text-muted-foreground">
                          {opp.minCgpa ? `Minimum CGPA required: ${opp.minCgpa.toFixed(2)}` : "No minimum CGPA required"}
                        </div>

                        <Link
                          href={`/opportunities/${opp.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold transition-colors"
                        >
                          <span>Review &amp; Apply</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SKILL GAP ANALYZER */}
      {activeTab === "SKILL_GAP" && (
        <div className="space-y-6">
          {loadingGap || !skillGap ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Analyzing campus job market demand...
            </div>
          ) : (
            <>
              {/* Prioritized Action Recommendations */}
              <Card className="rounded-2xl border border-border bg-card shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <TrendingUp className="size-4 text-primary" />
                      <span>Suggested Skill Priorities</span>
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Market Demand Ranked
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Skills most frequently requested by active university recruiters that are missing from your profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {skillGap.recommendedPriorities.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      Outstanding! Your verified skills cover all currently demanded market competencies.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {skillGap.recommendedPriorities.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground text-sm">{item.name}</span>
                            <Badge variant="secondary" className="text-[10px]">
                              {item.category.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-[11px] leading-relaxed">
                            {item.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Verified Learning Resources */}
              <Card className="rounded-2xl border border-border bg-card shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" />
                    <span>Verified Curated Learning Tracks</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Official documentation and academic partner curricula to master missing competencies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {skillGap.curatedResources.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      No active learning gaps detected for your current target track.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {skillGap.curatedResources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/30 transition-colors text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                              <span>{res.title}</span>
                              <Badge variant="outline" className="text-[9px] uppercase font-mono">
                                {res.skillName}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-muted-foreground">{res.provider}</span>
                          </div>
                          <ExternalLink className="size-4 text-primary shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Complete Skills Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="rounded-2xl border border-border bg-card p-4 space-y-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>Your Verified Skills ({skillGap.studentSkills.length})</span>
                  </CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGap.studentSkills.map((s, idx) => (
                      <span key={idx} className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>
                <Card className="rounded-2xl border border-border bg-card p-4 space-y-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Target className="size-4 text-primary" />
                    <span>Top Market Demands ({skillGap.topDemandedSkills.length})</span>
                  </CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGap.topDemandedSkills.map((s, idx) => (
                      <span key={idx} className="bg-muted px-2 py-0.5 rounded text-xs font-medium text-foreground">
                        {s.name} ({s.demandCount} jobs)
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 3: ACADEMIC PERFORMANCE & CGPA */}
      {activeTab === "ACADEMIC" && (
        <div className="space-y-6">
          {loadingAcademic || !academicData ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading academic records...
            </div>
          ) : (
            <>
              {/* CGPA Summary Gauge Card */}
              <Card className="rounded-2xl border border-border bg-card shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <GraduationCap className="size-5 text-primary" />
                      <span>Cumulative CGPA Performance</span>
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setIsAddSemesterOpen(true)}
                      className="text-xs font-semibold gap-1.5"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Semester Record</span>
                    </Button>
                  </div>
                  <CardDescription className="text-xs">
                    Official weighted calculation: Sum(Semester GPA × Credits) / Sum(Credits).
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-muted/20 border border-border">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Official Cumulative CGPA
                      </span>
                      <div className="text-4xl font-extrabold text-foreground font-mono">
                        {academicData.cumulativeCgpa ? academicData.cumulativeCgpa.toFixed(2) : "N/A"}
                        <span className="text-base text-muted-foreground font-normal"> / 4.00</span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">
                        Based on {academicData.records.length} logged semester terms.
                      </p>
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-1 max-w-sm">
                      <span className="font-semibold text-primary">Academic Privacy Guarantee:</span>
                      <p className="text-muted-foreground leading-relaxed text-[11px]">
                        Your semester breakdown and GPA history are strictly confidential and visible ONLY to you and the university registrar. They are never published in the public community directory.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Semester Breakdown Table */}
              <Card className="rounded-2xl border border-border bg-card shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-sm font-bold">Semester History Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {academicData.records.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <p className="text-xs text-muted-foreground">
                        No semester academic records logged yet.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddSemesterOpen(true)}
                        className="text-xs"
                      >
                        Add Your First Semester GPA
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-border/60 text-muted-foreground">
                            <th className="py-2.5 px-3 font-semibold">Semester / Term</th>
                            <th className="py-2.5 px-3 font-semibold">GPA</th>
                            <th className="py-2.5 px-3 font-semibold">Credits</th>
                            <th className="py-2.5 px-3 font-semibold">Standing</th>
                            <th className="py-2.5 px-3 font-semibold">Notes</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {academicData.records.map((rec) => (
                            <tr key={rec.id} className="border-b border-border/40 hover:bg-muted/10">
                              <td className="py-2.5 px-3 font-bold text-foreground">{rec.semester}</td>
                              <td className="py-2.5 px-3 font-mono font-semibold text-primary">{rec.gpa.toFixed(2)}</td>
                              <td className="py-2.5 px-3 font-mono text-muted-foreground">{rec.credits}</td>
                              <td className="py-2.5 px-3 text-muted-foreground">{rec.academicYear || "—"}</td>
                              <td className="py-2.5 px-3 text-muted-foreground">{rec.notes || "—"}</td>
                              <td className="py-2.5 px-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => handleDeleteRecord(rec.id)}
                                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add Semester Modal */}
              <AddSemesterModal
                open={isAddSemesterOpen}
                onOpenChange={setIsAddSemesterOpen}
                onSuccess={() => {
                  fetchAcademicProfile();
                  fetchRecommendations();
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

