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
  ArrowLeft,
  MessageSquare,
  Users,
  ExternalLink,
  Layers,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPublicProfile } from "@/lib/services/profile";
import { getConnectionState } from "@/lib/services/connection";
import { ProfileTemplate } from "@/components/templates/profile-template";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProfileActions } from "@/components/profile/profile-actions";

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

  // Query connection state, mutual connections, and recent posts in parallel
  const [connectionStateResult, recentPosts, viewerConnections, targetConnections] =
    await Promise.all([
      getConnectionState(session.user.id, id),
      prisma.post.findMany({
        where: {
          authorId: id,
          status: "ACTIVE",
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          attachedOpportunity: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.connection.findMany({
        where: {
          status: "ACCEPTED",
          OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
        },
        select: { senderId: true, receiverId: true },
      }),
      prisma.connection.findMany({
        where: {
          status: "ACCEPTED",
          OR: [{ senderId: id }, { receiverId: id }],
        },
        select: { senderId: true, receiverId: true },
      }),
    ]);

  // Calculate shared connections count
  const viewerPeerIds = new Set(
    viewerConnections.map((c) =>
      c.senderId === session.user.id ? c.receiverId : c.senderId
    )
  );
  const targetPeerIds = new Set(
    targetConnections.map((c) => (c.senderId === id ? c.receiverId : c.senderId))
  );

  let sharedCount = 0;
  for (const pId of viewerPeerIds) {
    if (targetPeerIds.has(pId) && pId !== id && pId !== session.user.id) {
      sharedCount++;
    }
  }

  const initials = profileData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isVerified = profileData.verificationStatus === "VERIFIED";
  const isSelf = session.user.id === id;
  const canRequestReferral =
    !isSelf &&
    Boolean(
      profileData.company ||
        profileData.membershipType === "ALUMNI" ||
        profileData.membershipType === "EMPLOYER"
    );

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
              <Avatar className="size-24 border-2 border-primary/20 shadow-sm shrink-0">
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

            <ProfileActions
              targetUserId={id}
              targetName={profileData.name}
              targetCompany={profileData.company}
              initialConnectionState={connectionStateResult.state}
              initialConnectionId={connectionStateResult.connectionId}
              canRequestReferral={canRequestReferral}
              email={profileData.email}
            />
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

            {/* Shared Connections */}
            {!isSelf && (
              <Card className="rounded-2xl border border-border bg-card shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Users className="size-3.5 text-primary" />
                    <span>Campus Network</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-xs space-y-2">
                  <p className="text-muted-foreground">
                    {sharedCount > 0
                      ? `You and ${profileData.name} have ${sharedCount} shared university connection${sharedCount > 1 ? "s" : ""}.`
                      : `You and ${profileData.name} do not have mutual connections yet.`}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Total Network Connections:{" "}
                    <span className="font-semibold text-foreground">{targetConnections.length}</span>
                  </p>
                </CardContent>
              </Card>
            )}

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

          {/* Projects if available */}
          {profileData.projects && profileData.projects.length > 0 && (
            <Card className="rounded-2xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Layers className="size-4 text-primary" />
                  <span>Key Projects</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {profileData.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-sm">{proj.title}</span>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <span>View Project</span>
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                    {proj.description && <p className="text-muted-foreground">{proj.description}</p>}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.techStack.map((tech: string, i: number) => (
                          <span key={i} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground/80">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Community Activity */}
          <Card className="rounded-2xl border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  <span>Recent Community Activity</span>
                </CardTitle>
                <Link
                  href={`/feed?authorId=${id}`}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>View in Feed</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {recentPosts.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  This member has not published any community posts yet.
                </p>
              ) : (
                recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1.5 text-xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono uppercase">
                        {post.postType.replace("_", " ")}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {post.title && <h5 className="font-semibold text-foreground text-xs">{post.title}</h5>}
                    <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                    {post.attachedOpportunity && (
                      <div className="pt-1">
                        <span className="text-[11px] text-emerald-600 font-medium">
                          Linked to: {post.attachedOpportunity.title}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </ProfileTemplate>
    </div>
  );
}
