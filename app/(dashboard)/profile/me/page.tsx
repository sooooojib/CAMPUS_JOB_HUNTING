import Link from "next/link";
import {
  GraduationCap,
  Calendar,
  ShieldCheck,
  Edit,
} from "lucide-react";
import { ProfileTemplate } from "@/components/templates/profile-template";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "My Profile",
  description: "View and manage your verified university member profile.",
};

export default function MyProfilePage() {
  return (
    <ProfileTemplate
      header={
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <Avatar className="size-24 border-2 border-primary/20 shadow-sm">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"
                alt="Sarah Miller"
              />
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                SM
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-foreground">Sarah Miller</h1>
                <Badge variant="success" className="gap-1 text-xs">
                  <ShieldCheck className="size-3.5" />
                  <span>Verified Student</span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Class of 2027
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground font-medium">
                Undergraduate in Computer Science &amp; Engineering • Cloud Systems Focus
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-primary" />
                  <span>School of Engineering</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>Member since Sept 2024</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end shrink-0">
            <Link
              href="/settings"
              className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
            >
              <Edit className="size-3.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      }
      sidebar={
        <div className="space-y-6">
          {/* Institutional Credentials Box */}
          <Card className="rounded-2xl border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Institutional Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground">Student ID:</span>
                <p className="font-mono font-semibold text-foreground">STU-2023-8819</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Academic Status:</span>
                <p className="font-semibold text-emerald-600">Active Full-Time Enrollment</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Verified Email:</span>
                <p className="font-mono text-muted-foreground truncate">sarah.miller@university.edu</p>
              </div>
            </CardContent>
          </Card>

          {/* Core Technical Skills */}
          <Card className="rounded-2xl border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Verified Skill Endorsements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-1.5">
                {["TypeScript", "React", "Go", "Kubernetes", "PostgreSQL", "Next.js", "Docker"].map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="space-y-6">
        {/* About Bio */}
        <Card className="rounded-2xl border border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-bold">About Me</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Third-year Computer Science student passionate about distributed architectures, high-performance backends, and cloud orchestration. Currently conducting undergraduate research on container autoscaling and active in the university ACM student chapter.
            </p>
            <p>
              Looking for Summer 2027 software engineering internship opportunities in cloud infrastructure, distributed systems, and developer tooling.
            </p>
          </CardContent>
        </Card>

        {/* Education & Academic Progress */}
        <Card className="rounded-2xl border border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-bold">Education &amp; Coursework</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">B.S. in Computer Science</h4>
                <span className="text-xs text-muted-foreground font-mono">2023 — 2027 (Expected)</span>
              </div>
              <p className="text-xs text-muted-foreground">University Faculty of Engineering &amp; Computing</p>
              <div className="text-xs text-muted-foreground pt-2">
                <span className="font-semibold text-foreground">Key Coursework:</span> Data Structures &amp; Algorithms, Operating Systems, Database Systems, Computer Networks, Distributed Computing.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfileTemplate>
  );
}
