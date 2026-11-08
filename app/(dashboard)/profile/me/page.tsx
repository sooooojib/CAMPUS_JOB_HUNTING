import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Building,
  Briefcase,
  Globe,
  Share2,
  Code2,
  AlertTriangle,
  ArrowRight,
  Send,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getMemberProfile } from "@/lib/services/profile";
import { ProfileTemplate } from "@/components/templates/profile-template";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { ResubmitVerificationModal } from "@/components/profile/resubmit-verification-modal";
import { ProfileSignOutButton } from "@/components/profile/profile-sign-out-button";

export const metadata = {
  title: "My Profile | UniCareer Community",
  description: "View and manage your verified university member credentials.",
};

export const instant = false;

export default async function MyProfilePage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const memberData = await getMemberProfile(session.user.id);
  const profile = memberData.profile;
  const recentRequest = memberData.membershipRequests?.[0];

  const initials = memberData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isVerified = memberData.verificationStatus === "VERIFIED";
  const isPending = memberData.verificationStatus === "PENDING";
  const isRejected = memberData.verificationStatus === "REJECTED";

  return (
    <div className="space-y-6">
      {/* Onboarding Incomplete Banner (only shown if not verified and onboarding incomplete) */}
      {!isVerified && !profile?.isOnboarded && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground shrink-0">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Institutional Onboarding Incomplete
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete your academic or employer dossier to request official registrar validation.
              </p>
            </div>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0"
          >
            <span>Complete Onboarding</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* Verification Status Alert Banner */}
      {isPending && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
            <Clock className="size-4 shrink-0" />
            <span>
              <strong>Verification Dossier in Review:</strong> Your {memberData.membershipType.toLowerCase()} credentials have been submitted and are pending validation by the campus registrar.
            </span>
          </div>
          <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 text-[10px] shrink-0">
            Pending Review
          </Badge>
        </div>
      )}

      {isRejected && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-destructive font-bold">
              <AlertTriangle className="size-4 shrink-0" />
              <span>Verification Request Rejected</span>
            </div>
            <p className="text-muted-foreground">
              {recentRequest?.rejectionReason || "Credentials could not be verified against registrar records."}
            </p>
          </div>
          <ResubmitVerificationModal
            membershipType={memberData.membershipType}
            previousRejectionReason={recentRequest?.rejectionReason}
          />
        </div>
      )}

      {isVerified && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="size-4 shrink-0" />
            <span>
              <strong>Verified Institutional Member:</strong> Authenticated under official Jagannath University registrar credentials.
            </span>
          </div>
          {memberData.canPostOpportunities && (
            <Badge variant="success" className="text-[10px] gap-1">
              <Send className="size-3" />
              <span>Posting Cleared</span>
            </Badge>
          )}
        </div>
      )}

      <ProfileTemplate
        header={
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <Avatar className="size-24 border-2 border-primary/20 shadow-sm">
                <AvatarImage src={memberData.image || undefined} alt={memberData.name} />
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{memberData.name}</h1>
                  <Badge
                    variant={isVerified ? "success" : isRejected ? "destructive" : "secondary"}
                    className="gap-1 text-xs"
                  >
                    {isVerified ? (
                      <ShieldCheck className="size-3.5" />
                    ) : isRejected ? (
                      <AlertTriangle className="size-3.5" />
                    ) : (
                      <Clock className="size-3.5" />
                    )}
                    <span>
                      {isVerified ? "Verified" : isRejected ? "Verification Rejected" : "Verification Pending"}
                    </span>
                  </Badge>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {(memberData.membershipType || "MEMBER").replace("_", " ")}
                  </Badge>
                  {profile?.graduationYear && (
                    <Badge variant="outline" className="text-xs">
                      Class of {profile.graduationYear}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground font-medium">
                  {profile?.headline || (profile?.department ? `Affiliated with ${profile.department}` : "University Community Member")}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
                  {profile?.department && (
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="size-3.5 text-primary" />
                      <span>{profile.department}</span>
                    </span>
                  )}
                  {profile?.company && (
                    <span className="flex items-center gap-1.5">
                      <Building className="size-3.5 text-primary" />
                      <span>{profile.company}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>
                      Member since {new Date(memberData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0">
              <EditProfileModal
                initialProfile={{
                  name: memberData.name,
                  headline: profile?.headline,
                  bio: profile?.bio,
                  department: profile?.department,
                  academicYear: profile?.academicYear,
                  graduationYear: profile?.graduationYear,
                  degree: profile?.degree,
                  company: profile?.company,
                  designation: profile?.designation,
                  skills: profile?.skills || [],
                  interests: profile?.interests || [],
                  linkedinUrl: profile?.linkedinUrl,
                  githubUrl: profile?.githubUrl,
                  websiteUrl: profile?.websiteUrl,
                  phone: profile?.phone,
                  showEmail: profile?.showEmail,
                  membershipType: memberData.membershipType,
                }}
              />
              <ProfileSignOutButton />
            </div>
          </div>
        }
        sidebar={
          <div className="space-y-6">
            {/* Institutional Credentials Card */}
            <Card className="rounded-2xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Institutional Dossier
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                {profile?.studentId && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Institutional ID (Private):</span>
                    <p className="font-mono font-semibold text-foreground">{profile.studentId}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-muted-foreground">Verification Status:</span>
                  <p className={`font-semibold ${isVerified ? "text-emerald-600" : isRejected ? "text-destructive" : "text-amber-600"}`}>
                    {memberData.verificationStatus}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Registered Email:</span>
                  <p className="font-mono text-muted-foreground truncate">{memberData.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Posting Permissions:</span>
                  <p className="font-semibold text-foreground">
                    {memberData.canPostOpportunities
                      ? "Authorized (Posting Active)"
                      : isVerified
                      ? "Standard Community Access"
                      : "Restricted (Requires Verification)"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Core Skills */}
            <Card className="rounded-2xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Skills &amp; Competencies
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No skills listed yet.</p>
                )}
              </CardContent>
            </Card>

            {/* External Links */}
            {(profile?.linkedinUrl || profile?.githubUrl || profile?.websiteUrl) && (
              <Card className="rounded-2xl border border-border bg-card shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Social &amp; Portfolios
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2 text-xs">
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Share2 className="size-3.5" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Code2 className="size-3.5" />
                      <span>GitHub Portfolio</span>
                    </a>
                  )}
                  {profile.websiteUrl && (
                    <a
                      href={profile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Globe className="size-3.5" />
                      <span>Personal Website</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        }
      >
        <div className="space-y-6">
          {/* About Bio */}
          <Card className="rounded-2xl border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold">About</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm text-muted-foreground leading-relaxed">
              {profile?.bio ? (
                <p className="whitespace-pre-line">{profile.bio}</p>
              ) : (
                <p className="italic text-xs">
                  No biography provided yet. Click &quot;Edit Profile&quot; to describe your background and career goals.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Academic Background */}
          {(profile?.degree || profile?.department || profile?.academicYear) && (
            <Card className="rounded-2xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <GraduationCap className="size-4 text-primary" />
                  <span>Academic Record</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">
                    {profile.degree || profile.department || "Academic Enrollment"}
                  </h4>
                  {profile.graduationYear && (
                    <span className="font-mono text-muted-foreground">Class of {profile.graduationYear}</span>
                  )}
                </div>
                {profile.department && (
                  <p className="text-muted-foreground">Department of {profile.department}</p>
                )}
                {profile.academicYear && (
                  <p className="text-muted-foreground">Standing: {profile.academicYear}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Professional Experience */}
          {(profile?.company || profile?.designation) && (
            <Card className="rounded-2xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Briefcase className="size-4 text-primary" />
                  <span>Professional Position</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-1 text-xs">
                <div className="text-sm font-bold text-foreground">
                  {profile.designation || "Member"}
                </div>
                <div className="text-muted-foreground font-medium">{profile.company}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </ProfileTemplate>
    </div>
  );
}
