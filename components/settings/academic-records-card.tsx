"use client";

import * as React from "react";
import { GraduationCap, Plus, Trash2, Award, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddSemesterModal } from "@/components/career/add-semester-modal";
import { toast } from "sonner";

export interface AcademicRecordData {
  id: string;
  semester: string;
  gpa: number;
  credits: number;
  academicYear?: string | null;
  notes?: string | null;
  isVerified?: boolean;
}

interface AcademicRecordsCardProps {
  initialRecords?: AcademicRecordData[];
  initialCgpa?: number | null;
  membershipType?: string;
}

export function AcademicRecordsCard({
  initialRecords = [],
  initialCgpa = null,
  membershipType = "STUDENT",
}: AcademicRecordsCardProps) {
  const [records, setRecords] = React.useState<AcademicRecordData[]>(initialRecords);
  const [cgpa, setCgpa] = React.useState<number | null>(initialCgpa);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);

  const isStudent = membershipType === "STUDENT";

  // Calculate stats
  const totalCredits = React.useMemo(() => {
    return records.reduce((sum, r) => sum + (r.credits || 0), 0);
  }, [records]);

  // Recalculate CGPA client-side or fetch fresh from API
  const refreshRecords = React.useCallback(async () => {
    try {
      const res = await fetch("/api/academic/records");
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setRecords(data.data.records || []);
        setCgpa(data.data.cumulativeCgpa);
      }
    } catch (err) {
      console.error("Failed to refresh academic records:", err);
    }
  }, []);

  React.useEffect(() => {
    refreshRecords();
  }, [refreshRecords]);

  const handleDeleteRecord = async (id: string, semesterName: string) => {
    if (!confirm(`Are you sure you want to remove the record for ${semesterName}?`)) {
      return;
    }

    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/academic/records/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Academic record for ${semesterName} deleted.`);
        setRecords((prev) => prev.filter((r) => r.id !== id));
        if (data.data?.cumulativeCgpa !== undefined) {
          setCgpa(data.data.cumulativeCgpa);
        } else {
          refreshRecords();
        }
      } else {
        toast.error(data.error?.message || "Failed to delete record.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete record.");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" />
            <span>Academic &amp; CGPA Information</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log your semester grades and credit hours to maintain your official university cumulative CGPA.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Add Semester CGPA</span>
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-border bg-card/60 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Cumulative CGPA
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground">
                  {cgpa !== null && cgpa !== undefined ? cgpa.toFixed(2) : "—"}
                </span>
                <span className="text-xs text-muted-foreground font-medium">/ 4.00</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Award className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Credits Earned
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground">
                  {totalCredits.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground font-medium">Credits</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BookOpen className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Semesters Logged
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground">{records.length}</span>
                <span className="text-xs text-muted-foreground font-medium">Terms</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Semester Records List */}
      <Card className="border-border shadow-xs">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Semester Grade Breakdown
          </CardTitle>
          <CardDescription className="text-xs">
            Credit-weighted cumulative CGPA is automatically updated whenever a semester entry is added or modified.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          {records.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border bg-muted/20">
              <GraduationCap className="size-8 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-xs font-bold text-foreground">No semester CGPA records added yet</p>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-sm mx-auto">
                Add your completed semester grades to compute your cumulative CGPA and check requirements for campus opportunities.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-3 text-xs gap-1.5 cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Add Your First Semester</span>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-foreground">{rec.semester}</span>
                      {rec.academicYear && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
                          {rec.academicYear}
                        </Badge>
                      )}
                      {rec.isVerified && (
                        <Badge variant="secondary" className="text-[9px] py-0 px-1 text-emerald-600 dark:text-emerald-400">
                          Verified
                        </Badge>
                      )}
                    </div>
                    {rec.notes && (
                      <p className="text-[11px] text-muted-foreground truncate">{rec.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-foreground font-mono">
                        GPA {rec.gpa.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {rec.credits.toFixed(1)} Credits
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDeleteRecord(rec.id, rec.semester)}
                      disabled={isDeletingId === rec.id}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      aria-label={`Delete record for ${rec.semester}`}
                    >
                      {isDeletingId === rec.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Semester Modal */}
      <AddSemesterModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => {
          refreshRecords();
        }}
      />
    </section>
  );
}

