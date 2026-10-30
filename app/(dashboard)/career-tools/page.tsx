import Link from "next/link";
import {
  Sparkles,
  GraduationCap,
  ShieldCheck,
  FileText,
  Upload,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const metadata = {
  title: "Career Development Toolkit",
  description: "Academic eligibility, skill matching, resume vault, and campus career readiness progress.",
};

export default function CareerToolsPage() {
  return (
    <DashboardTemplate
      title="Student Career Toolkit"
      subtitle="Personalized academic eligibility tools, skill gap analysis, and verified resume management."
      actions={
        <Badge variant="info" className="gap-1.5 py-1 px-3">
          <GraduationCap className="size-3.5" />
          <span>Student Role Active • CS Department</span>
        </Badge>
      }
      sidebar={
        <div className="space-y-6">
          {/* Resume Vault Card */}
          <Card className="rounded-2xl border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Private Resume Vault</CardTitle>
                <Badge variant="outline" className="text-[10px]">Encrypted</Badge>
              </div>
              <CardDescription className="text-xs">
                Resumes are protected in private cloud storage and shared via 15-min signed tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-background text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="size-4 text-primary shrink-0" />
                    <span className="truncate font-medium">Software_Resume_v3.pdf</span>
                  </div>
                  <Badge variant="success" className="text-[9px] shrink-0">Primary</Badge>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-background text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="size-4 text-muted-foreground shrink-0" />
                    <span className="truncate font-medium">Design_Portfolio_2026.pdf</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">Secondary</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                <Upload className="size-3.5" />
                <span>Upload New Resume Version</span>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="rounded-2xl border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Calendar className="size-4 text-amber-500" />
                <span>Upcoming Deadlines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="border-b border-border/60 pb-2.5">
                <div className="font-bold text-foreground">Google Cloud SWE Intern</div>
                <div className="text-muted-foreground text-[11px] flex justify-between mt-0.5">
                  <span>Closes in 21 days</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Nov 20, 2026</span>
                </div>
              </div>

              <div>
                <div className="font-bold text-foreground">Robotics AI Fellow</div>
                <div className="text-muted-foreground text-[11px] flex justify-between mt-0.5">
                  <span>Closes in 16 days</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Nov 15, 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Academic Eligibility & CGPA Status Card */}
        <Card className="rounded-2xl border border-border bg-card shadow-xs">
          <CardHeader className="pb-4 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-500" />
                  <span>Academic Verification &amp; CGPA Standing</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Validated against official university registrar records on file.
                </CardDescription>
              </div>
              <Badge variant="success" className="w-fit">Verified Student Record</Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-background border border-border/80">
                <div className="text-xs text-muted-foreground">Cumulative CGPA</div>
                <div className="text-3xl font-extrabold text-foreground mt-1">3.84</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Top 10% of Cohort</div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border/80">
                <div className="text-xs text-muted-foreground">Academic Status</div>
                <div className="text-xl font-bold text-foreground mt-2">Good Standing</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Senior Year (Grad 2027)</div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border/80">
                <div className="text-xs text-muted-foreground">Campus Job Eligibility</div>
                <div className="text-xl font-bold text-emerald-600 mt-2">100% Eligible</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Exceeds all minimum cutoffs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Gap Analysis & Job Fit */}
        <Card className="rounded-2xl border border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span>Curriculum &amp; Skill Fit Analysis</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Automated comparison of your completed coursework against open campus postings.
                </CardDescription>
              </div>
              <span className="text-xs font-mono font-bold text-primary">88% Overall Match</span>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Distributed Systems &amp; Concurrency</span>
                <span className="text-emerald-600 font-bold">95% (Completed CS 340)</span>
              </div>
              <Progress value={95} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Cloud &amp; Kubernetes Architecture</span>
                <span className="text-blue-600 font-bold">85% (Hands-on labs)</span>
              </div>
              <Progress value={85} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Frontend Systems &amp; UI Architecture</span>
                <span className="text-amber-600 font-bold">70% (Elective recommended)</span>
              </div>
              <Progress value={70} />
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Want to improve your match score? Check recommended electives with your advisor.
              </span>
              <Link
                href="/opportunities"
                className={buttonVariants({ variant: "outline", size: "sm", className: "text-xs" })}
              >
                <span>Browse Matched Jobs</span>
                <ArrowRight className="size-3 ml-1.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  );
}
