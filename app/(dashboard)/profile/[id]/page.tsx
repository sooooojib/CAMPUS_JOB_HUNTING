import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Calendar,
  ShieldCheck,
  Building,
  Briefcase,
  Globe,
  Code2,
  Share2,
  Mail,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getPublicProfile } from "@/lib/services/profile";
import { ProfileTemplate } from "@/components/templates/profile-template";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const instant = false;

export default async function PublicProfilePage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  if (id === "me") {
    redirect("/profile/me");
  }

  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  let profileData;
  try {
    profileData = await getPublicProfile(id, session.user.id);
  } catch (error: any) {
    if (error.message?.includes("PROFILE_NOT_FOUND")) {
      notFound();
    }
    throw error;
  }

  const initials = profileData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isVerified = profileData.verificationStatus === "VERIFIED";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Member Directory</span>
        </Link>
      </div>

      <ProfileTemplate
        header={
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <Avatar className="size-24 border-2 border-primary/20 shadow-sm">
                <AvatarImage src={profileData.image || undefined} alt={profileData.name} />
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{profileData.name}</h1>
                  {isVerified ? (
                    <Badge variant="success" className="gap-1 text-xs">
                      <ShieldCheck className="size-3.5" />
                      <span>Verified Member</span>
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Community Member
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs font-semibold">
                    {profileData.membershipType.replace("_", " ")}
                  </Badge>
                  {profileData.graduationYear && (
                    <Badge variant="outline" className="text-xs">
                      Class of {profileData.graduationYear}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground font-medium">
                  {profileData.headline ||
                    (profileData.department ? `Affiliated with ${profileData.department}` : "University Member")}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
                  {profileData.department && (
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="size-3.5 text-primary" />
                      <span>{profileData.department}</span>
                    </span>
                  )}
                  {profileData.company && (
                    <span className="flex items-center gap-1.5">
                      <Building className="size-3.5 text-primary" />
                      <span>{profileData.company}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>
                      Joined {new Date(profileData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0">
              {profileData.email && (
                <a
                  href={`mailto:${profileData.email}`}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <Mail className="size-3.5" />
                  <span>Send Email</span>
                </a>
              )}
            </div>
          </div>
        }
        sidebar={
          <div className="space-y-6">
            {/* Identity Badge Card */}
            <Card className="rounded-2xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Institutional Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Membership Type:</span>
                  <p className="font-semibold text-foreground">{profileData.membershipType.replace("_", " ")}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Network Standing:</span>
                  <p className={`font-semibold ${isVerified ? "text-emerald-600" : "text-amber-600"}`}>
                    {isVerified ? "Registrar-Verified Credentials" : "Standard Community Account"}
                  </p>
                </div>
                {profileData.email && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Public Contact Email:</span>
                    <p className="font-mono text-muted-foreground truncate">{profileData.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="rounded-2xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Endorsed Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {profileData.skills && profileData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profileData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No public skills listed.</p>
                )}
              </CardContent>
            </Card>

            {/* Links */}
            {(profileData.linkedinUrl || profileData.githubUrl || profileData.websiteUrl) && (
              <Card className="rounded-2xl border border-border bg-card shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Connected Networks
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2 text-xs">
                  {profileData.linkedinUrl && (
                    <a
                      href={profileData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Share2 className="size-3.5" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {profileData.githubUrl && (
                    <a
                      href={profileData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Code2 className="size-3.5" />
                      <span>GitHub Portfolio</span>
                    </a>
                  )}
                  {profileData.websiteUrl && (
                    <a
                      href={profileData.websiteUrl}
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
              {profileData.bio ? (
                <p className="whitespace-pre-line">{profileData.bio}</p>
              ) : (
                <p className="italic text-xs text-muted-foreground">
                  This member has not provided a public biography yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Academic Background */}
          {(profileData.degree || profileData.department || profileData.academicYear) && (
            <Card className="rounded-2xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <GraduationCap className="size-4 text-primary" />
                  <span>Academic Standing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">
                    {profileData.degree || profileData.department || "University Academic Record"}
                  </h4>
                  {profileData.graduationYear && (
                    <span className="font-mono text-muted-foreground">Class of {profileData.graduationYear}</span>
                  )}
                </div>
                {profileData.department && (
                  <p className="text-muted-foreground">Department of {profileData.department}</p>
                )}
                {profileData.academicYear && (
                  <p className="text-muted-foreground">Standing: {profileData.academicYear}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Professional Background */}
          {(profileData.company || profileData.designation) && (
            <Card className="rounded-2xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Briefcase className="size-4 text-primary" />
                  <span>Professional Role</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-1 text-xs">
                <div className="text-sm font-bold text-foreground">
                  {profileData.designation || "Affiliate"}
                </div>
                <div className="text-muted-foreground font-medium">{profileData.company}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </ProfileTemplate>
    </div>
  );
}
