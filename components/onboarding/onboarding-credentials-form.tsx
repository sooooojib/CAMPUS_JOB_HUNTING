"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  GraduationCap,
  Award,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OnboardingCredentialsFormProps {
  predeterminedRole: "STUDENT" | "ALUMNI";
  rejectionReason?: string | null;
  defaultValues?: {
    studentId?: string | null;
    department?: string | null;
    academicYear?: string | null;
    degree?: string | null;
    graduationYear?: number | null;
    company?: string | null;
    designation?: string | null;
    skills?: string[] | null;
    bio?: string | null;
    headline?: string | null;
  };
}

export function OnboardingCredentialsForm({
  predeterminedRole,
  rejectionReason,
  defaultValues,
}: OnboardingCredentialsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Student form state
  const [studentForm, setStudentForm] = React.useState({
    studentId: defaultValues?.studentId || "",
    department: defaultValues?.department || "Computer Science & Engineering",
    academicYear: defaultValues?.academicYear || "3rd Year / Junior",
    degree: defaultValues?.degree || "B.S. in Computer Science & Engineering",
    graduationYear: defaultValues?.graduationYear || 2027,
    workEmail: "",
    headline: defaultValues?.headline || "",
    bio: defaultValues?.bio || "",
    proofDetails: "Enrolled student at Department of CSE. Validated via campus registrar roll.",
  });

  // Alumni form state
  const [alumniForm, setAlumniForm] = React.useState({
    studentId: defaultValues?.studentId || "",
    department: defaultValues?.department || "Computer Science & Engineering",
    graduationYear: defaultValues?.graduationYear || 2022,
    degree: defaultValues?.degree || "B.S. in Computer Science & Engineering",
    company: defaultValues?.company || "bKash Limited",
    designation: defaultValues?.designation || "Software Engineer II",
    headline: defaultValues?.headline || "Software Engineer II at bKash | JnU CSE '22",
    bio: defaultValues?.bio || "",
    proofDetails: "Class of 2022. Final year thesis advised by Department Chair.",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let payload: any = {
        membershipType: predeterminedRole,
      };

      if (predeterminedRole === "STUDENT") {
        payload.studentData = {
          studentId: studentForm.studentId.trim(),
          department: studentForm.department.trim(),
          academicYear: studentForm.academicYear.trim(),
          degree: studentForm.degree.trim(),
          graduationYear: Number(studentForm.graduationYear),
          workEmail: studentForm.workEmail.trim() || undefined,
          headline: studentForm.headline.trim() || undefined,
          bio: studentForm.bio.trim() || undefined,
          skills: [],
          proofDetails: studentForm.proofDetails.trim() || undefined,
        };
      } else {
        payload.alumniData = {
          studentId: alumniForm.studentId.trim() || undefined,
          department: alumniForm.department.trim(),
          graduationYear: Number(alumniForm.graduationYear),
          degree: alumniForm.degree.trim(),
          company: alumniForm.company.trim() || undefined,
          designation: alumniForm.designation.trim() || undefined,
          headline: alumniForm.headline.trim() || undefined,
          bio: alumniForm.bio.trim() || undefined,
          skills: [],
          proofDetails: alumniForm.proofDetails.trim(),
        };
      }

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to submit credential dossier.");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Credential submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isStudent = predeterminedRole === "STUDENT";
  const RoleIcon = isStudent ? GraduationCap : Award;
  const roleLabel = isStudent ? "Undergraduate / Graduate Student" : "University Alumnus / Alumna";

  return (
    <Card className="rounded-3xl border border-border bg-card shadow-sm">
      <CardHeader className="pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary text-primary-foreground">
            <RoleIcon className="size-5" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <span>Submit {roleLabel} Credentials</span>
            </CardTitle>
            <CardDescription className="text-xs">
              All credentials are encrypted and authenticated against university registrar records.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {rejectionReason && (
          <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs text-destructive space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="size-4" />
              <span>Previous Submission Note from Campus Registrar</span>
            </div>
            <p>{rejectionReason}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* STUDENT FORM */}
          {isStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="studentId" className="text-xs font-semibold">
                      University Student ID *
                    </Label>
                    {Boolean(defaultValues?.studentId) && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-muted/70 px-2 py-0.5 rounded-md">
                        <Lock className="size-2.5 text-muted-foreground" />
                        <span>Locked from Registration</span>
                      </span>
                    )}
                  </div>
                  <Input
                    id="studentId"
                    value={studentForm.studentId}
                    onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                    placeholder="e.g. STU-2023-8819 or 2021-CSE-045"
                    className="text-xs font-mono disabled:opacity-80 disabled:bg-muted/50 cursor-not-allowed"
                    disabled={Boolean(defaultValues?.studentId)}
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Stored in private security vault. Never revealed to public members.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="department" className="text-xs font-semibold">
                      Department / Faculty *
                    </Label>
                    {Boolean(defaultValues?.department) && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-muted/70 px-2 py-0.5 rounded-md">
                        <Lock className="size-2.5 text-muted-foreground" />
                        <span>Locked from Registration</span>
                      </span>
                    )}
                  </div>
                  <Input
                    id="department"
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    placeholder="Computer Science & Engineering"
                    className="text-xs disabled:opacity-80 disabled:bg-muted/50 cursor-not-allowed"
                    disabled={Boolean(defaultValues?.department)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="degree" className="text-xs font-semibold">
                    Degree Program *
                  </Label>
                  <Input
                    id="degree"
                    value={studentForm.degree}
                    onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })}
                    placeholder="B.Sc. in CSE"
                    className="text-xs"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="academicYear" className="text-xs font-semibold">
                    Academic Standing / Year *
                  </Label>
                  <Input
                    id="academicYear"
                    value={studentForm.academicYear}
                    onChange={(e) => setStudentForm({ ...studentForm, academicYear: e.target.value })}
                    placeholder="3rd Year / Junior"
                    className="text-xs"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="graduationYear" className="text-xs font-semibold">
                    Expected Graduation *
                  </Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    value={studentForm.graduationYear}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        graduationYear: parseInt(e.target.value, 10) || 2027,
                      })
                    }
                    placeholder="2027"
                    className="text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proofDetails" className="text-xs font-semibold">
                  Enrollment Reference / Proof Details
                </Label>
                <Textarea
                  id="proofDetails"
                  value={studentForm.proofDetails}
                  onChange={(e) => setStudentForm({ ...studentForm, proofDetails: e.target.value })}
                  placeholder="Enter registration batch, semester enrollment reference, or student email..."
                  rows={2}
                  className="text-xs"
                />
              </div>
            </div>
          )}

          {/* ALUMNI FORM */}
          {!isStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="alumniDept" className="text-xs font-semibold">
                      Graduation Department *
                    </Label>
                    {Boolean(defaultValues?.department) && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-muted/70 px-2 py-0.5 rounded-md">
                        <Lock className="size-2.5 text-muted-foreground" />
                        <span>Locked from Registration</span>
                      </span>
                    )}
                  </div>
                  <Input
                    id="alumniDept"
                    value={alumniForm.department}
                    onChange={(e) => setAlumniForm({ ...alumniForm, department: e.target.value })}
                    placeholder="Computer Science & Engineering"
                    className="text-xs disabled:opacity-80 disabled:bg-muted/50 cursor-not-allowed"
                    disabled={Boolean(defaultValues?.department)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="alumniGradYear" className="text-xs font-semibold">
                    Graduation Year *
                  </Label>
                  <Input
                    id="alumniGradYear"
                    type="number"
                    value={alumniForm.graduationYear}
                    onChange={(e) =>
                      setAlumniForm({
                        ...alumniForm,
                        graduationYear: parseInt(e.target.value, 10) || 2022,
                      })
                    }
                    placeholder="2022"
                    className="text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="degree" className="text-xs font-semibold">
                    Degree Obtained *
                  </Label>
                  <Input
                    id="degree"
                    value={alumniForm.degree}
                    onChange={(e) => setAlumniForm({ ...alumniForm, degree: e.target.value })}
                    placeholder="B.S. in Computer Science & Engineering"
                    className="text-xs"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs font-semibold">
                    Current Employer / Organization
                  </Label>
                  <Input
                    id="company"
                    value={alumniForm.company}
                    onChange={(e) => setAlumniForm({ ...alumniForm, company: e.target.value })}
                    placeholder="Google / bKash / Optimizely"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="designation" className="text-xs font-semibold">
                  Current Job Title / Designation
                </Label>
                <Input
                  id="designation"
                  value={alumniForm.designation}
                  onChange={(e) => setAlumniForm({ ...alumniForm, designation: e.target.value })}
                  placeholder="Senior Software Engineer"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="alumniProof" className="text-xs font-semibold">
                  Alumni Verification Proof (Thesis title, registration number, or advisor) *
                </Label>
                <Textarea
                  id="alumniProof"
                  value={alumniForm.proofDetails}
                  onChange={(e) => setAlumniForm({ ...alumniForm, proofDetails: e.target.value })}
                  placeholder="State your registration batch, undergraduate thesis topic, or advisor's name..."
                  rows={3}
                  className="text-xs"
                  required
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/60">
            <Button
              type="submit"
              disabled={loading}
              size="default"
              className="gap-2 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              <span>Submit Credentials for Verification</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

