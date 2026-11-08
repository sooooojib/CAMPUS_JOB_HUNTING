"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Award,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AcademicRecordsCard } from "@/components/settings/academic-records-card";

type RoleType = "STUDENT" | "ALUMNI";

const ROLES = [
  {
    id: "STUDENT" as RoleType,
    label: "Undergraduate / Graduate Student",
    icon: GraduationCap,
    desc: "Currently enrolled at Jagannath University pursuing a degree.",
  },
  {
    id: "ALUMNI" as RoleType,
    label: "University Alumnus / Alumna",
    icon: Award,
    desc: "Graduated degree holder from Jagannath University.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState<RoleType>("STUDENT");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Student Fields
  const [studentForm, setStudentForm] = React.useState({
    studentId: "",
    department: "Computer Science & Engineering",
    academicYear: "3rd Year / Junior",
    degree: "B.S. in Computer Science & Engineering",
    graduationYear: 2027,
    workEmail: "",
    headline: "",
    bio: "",
    skills: "TypeScript, Python, React, PostgreSQL",
    proofDetails: "Enrolled student at Department of CSE. Validated via campus registrar roll.",
  });

  // Alumni Fields
  const [alumniForm, setAlumniForm] = React.useState({
    studentId: "",
    department: "Computer Science & Engineering",
    graduationYear: 2022,
    degree: "B.S. in Computer Science & Engineering",
    company: "bKash Limited",
    designation: "Software Engineer II",
    headline: "Software Engineer II at bKash | JnU CSE '22",
    bio: "",
    skills: "Go, Kubernetes, Cloud Architecture",
    proofDetails: "Class of 2022. Final year thesis advised by Department Chair.",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let payload: any = {
        membershipType: selectedRole,
      };

      if (selectedRole === "STUDENT") {
        const skills = studentForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        payload.studentData = {
          studentId: studentForm.studentId.trim(),
          department: studentForm.department.trim(),
          academicYear: studentForm.academicYear.trim(),
          degree: studentForm.degree.trim(),
          graduationYear: Number(studentForm.graduationYear),
          workEmail: studentForm.workEmail.trim() || undefined,
          headline: studentForm.headline.trim() || undefined,
          bio: studentForm.bio.trim() || undefined,
          skills,
          proofDetails: studentForm.proofDetails.trim() || undefined,
        };
      } else if (selectedRole === "ALUMNI") {
        const skills = alumniForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        payload.alumniData = {
          studentId: alumniForm.studentId.trim() || undefined,
          department: alumniForm.department.trim(),
          graduationYear: Number(alumniForm.graduationYear),
          degree: alumniForm.degree.trim(),
          company: alumniForm.company.trim() || undefined,
          designation: alumniForm.designation.trim() || undefined,
          headline: alumniForm.headline.trim() || undefined,
          bio: alumniForm.bio.trim() || undefined,
          skills,
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
        throw new Error(json.message || "Failed to submit onboarding dossier.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/profile/me");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Onboarding failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 text-center space-y-2">
        <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold gap-1.5 py-1">
          <Sparkles className="size-3 text-primary" />
          <span>Stage 02 • Institutional Onboarding</span>
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Establish Your University Credentials
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          UniCareer Community is a verified network. Submit your academic credentials and manage your official CGPA records to activate your membership dossier.
        </p>
      </div>

      {success && (
        <Card className="rounded-2xl border-emerald-500/40 bg-emerald-50/60 p-8 text-center space-y-3 mb-8">
          <CheckCircle2 className="size-12 text-emerald-600 mx-auto animate-bounce" />
          <h2 className="text-xl font-bold text-emerald-950">
            Credentials Submitted Successfully!
          </h2>
          <p className="text-xs text-emerald-800">
            Your membership verification dossier is now pending review by the campus governance team. Redirecting to your verified profile...
          </p>
        </Card>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 mb-6">
          {error}
        </div>
      )}

      {/* Step 1: Membership Role Selection */}
      <div className="space-y-4 mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Step 1: Confirm Institutional Identity Type
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col text-left p-5 rounded-2xl border transition-all text-xs cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-border/70 bg-card hover:border-border hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className={`p-2.5 rounded-xl ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="size-5" />
                  </div>
                  {isSelected && <Badge variant="default" className="text-[10px] h-5">Selected</Badge>}
                </div>
                <div className="font-bold text-foreground text-sm leading-snug">{role.label}</div>
                <div className="text-muted-foreground text-[11px] mt-1.5 leading-relaxed">{role.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Role-Tailored Verification Form */}
      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardHeader className="pb-4 border-b border-border/60">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <span>Step 2: Submit {selectedRole.replace("_", " ")} Credentials</span>
          </CardTitle>
          <CardDescription className="text-xs">
            All records are validated against official university records. Private student identifiers are never published publicly.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* STUDENT FORM */}
            {selectedRole === "STUDENT" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="studentId" className="text-xs font-semibold">
                      University Student ID *
                    </Label>
                    <Input
                      id="studentId"
                      value={studentForm.studentId}
                      onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                      placeholder="e.g. STU-2023-8819 or 2021-CSE-045"
                      className="text-xs font-mono"
                      required
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Stored in secure vault. Never revealed to public members.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="department" className="text-xs font-semibold">
                      Department / Faculty *
                    </Label>
                    <Input
                      id="department"
                      value={studentForm.department}
                      onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                      placeholder="Computer Science & Engineering"
                      className="text-xs"
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
                      onChange={(e) => setStudentForm({ ...studentForm, graduationYear: parseInt(e.target.value, 10) || 2027 })}
                      placeholder="2027"
                      className="text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="skills" className="text-xs font-semibold">
                    Core Technical / Professional Skills
                  </Label>
                  <Input
                    id="skills"
                    value={studentForm.skills}
                    onChange={(e) => setStudentForm({ ...studentForm, skills: e.target.value })}
                    placeholder="TypeScript, Python, React, PostgreSQL"
                    className="text-xs"
                  />
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
            {selectedRole === "ALUMNI" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="alumniDept" className="text-xs font-semibold">
                      Graduation Department *
                    </Label>
                    <Input
                      id="alumniDept"
                      value={alumniForm.department}
                      onChange={(e) => setAlumniForm({ ...alumniForm, department: e.target.value })}
                      placeholder="Computer Science & Engineering"
                      className="text-xs"
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
                      onChange={(e) => setAlumniForm({ ...alumniForm, graduationYear: parseInt(e.target.value, 10) || 2022 })}
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
                  <Label htmlFor="alumniSkills" className="text-xs font-semibold">
                    Core Technical / Professional Skills
                  </Label>
                  <Input
                    id="alumniSkills"
                    value={alumniForm.skills}
                    onChange={(e) => setAlumniForm({ ...alumniForm, skills: e.target.value })}
                    placeholder="Go, Kubernetes, Cloud Architecture"
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

      {/* Step 3: Academic Records & CGPA Section */}
      <div className="mt-8">
        <Card className="rounded-3xl border border-border bg-card shadow-sm p-6 sm:p-8">
          <AcademicRecordsCard membershipType={selectedRole} />
        </Card>
      </div>
    </div>
  );
}
