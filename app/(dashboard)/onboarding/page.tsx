import * as React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  BookOpen,
  Calendar,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AcademicRecordsCard } from "@/components/settings/academic-records-card";
import { OnboardingCredentialsForm } from "@/components/onboarding/onboarding-credentials-form";

export const metadata = {
  title: "Academic Verification",
  description: "Manage your university credentials, verified dossier, and academic CGPA records.",
};

export default async function OnboardingPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      academicRecords: {
        orderBy: { createdAt: "desc" },
      },
      membershipRequests: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const isVerified = user.verificationStatus === "VERIFIED";
  const isPending =
    user.verificationStatus === "PENDING" &&
    (user.profile?.isOnboarded || user.membershipRequests.length > 0);
  const isRejected = user.verificationStatus === "REJECTED";

  const predeterminedRole: "STUDENT" | "ALUMNI" =
    user.membershipType === "ALUMNI" ? "ALUMNI" : "STUDENT";
  const isStudent = predeterminedRole === "STUDENT";
  const roleLabel = isStudent ? "Undergraduate / Graduate Student" : "University Alumnus / Alumna";
  const RoleIcon = isStudent ? GraduationCap : Award;

  const latestRequest = user.membershipRequests[0];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* VERIFIED STATE */}
      {isVerified && (
        <>
          <div className="text-center space-y-2">
            <Badge
              variant="outline"
              className="text-xs uppercase tracking-wider font-semibold gap-1.5 py-1 text-emerald-600 border-emerald-500/30 bg-emerald-50/50"
            >
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Official Institutional Dossier • Verified Member</span>
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Academic Verification &amp; University Credentials
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Your Jagannath University institutional identity is authenticated and verified by campus administration.
            </p>
          </div>

          {/* Verified Identity Dossier Card */}
          <Card className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50/40 via-card to-card shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/60 bg-emerald-500/5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-xs">
                    <RoleIcon className="size-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <span>{user.name}</span>
                      <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white gap-1 text-[11px] rounded-full px-2.5">
                        <CheckCircle2 className="size-3" />
                        <span>Verified {user.membershipType}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      {roleLabel} • Jagannath University
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-primary" />
                    <span>Department / Faculty</span>
                  </div>
                  <div className="font-bold text-foreground text-sm">
                    {user.profile?.department || "Computer Science & Engineering"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="size-3.5 text-primary" />
                    <span>Degree Program</span>
                  </div>
                  <div className="font-bold text-foreground text-sm">
                    {user.profile?.degree || "B.Sc. in Computer Science & Engineering"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="size-3.5 text-primary" />
                    <span>Institutional Student ID</span>
                  </div>
                  <div className="font-bold text-foreground text-sm font-mono">
                    {user.profile?.studentId || "STU-2023-8819"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-primary" />
                    <span>Academic Standing</span>
                  </div>
                  <div className="font-bold text-foreground text-sm">
                    {user.profile?.academicYear || "3rd Year / Junior"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="size-3.5 text-primary" />
                    <span>Graduation Year</span>
                  </div>
                  <div className="font-bold text-foreground text-sm">
                    Class of {user.profile?.graduationYear || 2027}
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3.5 rounded-2xl bg-muted/40 border border-border/60 flex items-center gap-3 text-xs text-muted-foreground">
                <Lock className="size-4 shrink-0 text-primary" />
                <span>
                  Official Institutional Record. Private student identifiers are secured in the university vault and never published to outside entities.
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* PENDING REVIEW STATE */}
      {!isVerified && isPending && (
        <>
          <div className="text-center space-y-2">
            <Badge
              variant="outline"
              className="text-xs uppercase tracking-wider font-semibold gap-1.5 py-1 text-amber-600 border-amber-500/30 bg-amber-50/50"
            >
              <Clock className="size-3.5 text-amber-600" />
              <span>Institutional Verification Under Review</span>
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Credentials Submitted for Review
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Your {roleLabel} verification dossier is queued with campus administration.
            </p>
          </div>

          <Card className="rounded-3xl border border-amber-500/30 bg-amber-50/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500 text-white shrink-0">
                <Clock className="size-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  Verification Pending Administrative Approval
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your credentials have been securely recorded. The campus registrar and career center governance team review all dossiers against official academic rolls. You will receive an automatic notification upon confirmation.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Department:</span>{" "}
                <span className="font-semibold text-foreground">
                  {user.profile?.department || latestRequest?.department || "Submitted"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Degree Program:</span>{" "}
                <span className="font-semibold text-foreground">
                  {user.profile?.degree || "Submitted"}
                </span>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* UNVERIFIED / REJECTED FORM STATE (NO STEP 1, DIRECT PREDETERMINED ROLE FORM) */}
      {!isVerified && !isPending && (
        <>
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold gap-1.5 py-1">
              <Sparkles className="size-3 text-primary" />
              <span>Institutional Onboarding • {roleLabel}</span>
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Establish Your University Credentials
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Submit your academic credentials to activate your verified membership dossier.
            </p>
          </div>

          <OnboardingCredentialsForm
            predeterminedRole={predeterminedRole}
            rejectionReason={isRejected ? latestRequest?.rejectionReason : null}
            defaultValues={{
              studentId: user.profile?.studentId,
              department: user.profile?.department,
              academicYear: user.profile?.academicYear,
              degree: user.profile?.degree,
              graduationYear: user.profile?.graduationYear,
              company: user.profile?.company,
              designation: user.profile?.designation,
              skills: user.profile?.skills,
              bio: user.profile?.bio,
              headline: user.profile?.headline,
            }}
          />
        </>
      )}

      {/* ACADEMIC & CGPA RECORDS SECTION (ALWAYS SHOWN) */}
      <Card className="rounded-3xl border border-border bg-card shadow-sm p-6 sm:p-8">
        <AcademicRecordsCard
          initialRecords={user.academicRecords.map((r) => ({
            id: r.id,
            semester: r.semester,
            gpa: r.gpa,
            credits: r.credits,
            academicYear: r.academicYear,
            notes: r.notes,
            isVerified: r.isVerified,
          }))}
          initialCgpa={user.profile?.currentCgpa}
          membershipType={user.membershipType}
        />
      </Card>
    </div>
  );
}
