import { headers } from "next/headers";
import Link from "next/link";
import {
  GraduationCap,
  ShieldAlert,
  Briefcase,
  Users,
  MessageSquare,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { canAccessStudentTools } from "@/lib/permissions";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { CareerDashboardView } from "@/components/career/career-dashboard-view";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Career Development Toolkit | UniCareer Community",
  description: "Explainable skill matching, institutional CGPA eligibility verification, and personalized skill gap analysis.",
};

export default async function CareerToolsPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  const isStudent = canAccessStudentTools(session?.user);

  if (!isStudent) {
    return (
      <DashboardTemplate
        title="Student Career Toolkit"
        subtitle="Personalized academic eligibility tools, skill gap analysis, and verified opportunity matching."
      >
        <Card className="rounded-2xl border border-amber-500/30 bg-amber-500/5 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-amber-500" />
              <CardTitle className="text-lg font-bold text-foreground">
                Enrolled Student Feature Only
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Institutional academic records, CGPA standing, and curriculum matching are reserved exclusively for enrolled student accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4 text-sm text-muted-foreground">
            <p>
              Your current membership role is{" "}
              <span className="font-semibold text-foreground">
                {session?.user?.membershipType || "Member"}
              </span>
              . Per university privacy and community guidelines, academic CGPA calculators and course-based job matching are restricted to enrolled students.
            </p>
            <p>
              As a valued member of the university network, you can explore campus opportunities, share career leads, review applicants, and connect with peers across the platform:
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/opportunities"
                className={buttonVariants({ variant: "default", size: "sm", className: "gap-1.5" })}
              >
                <Briefcase className="size-4" />
                <span>Browse Opportunities</span>
              </Link>
              <Link
                href="/community"
                className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
              >
                <MessageSquare className="size-4" />
                <span>Join Community Discussions</span>
              </Link>
              <Link
                href="/members"
                className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
              >
                <Users className="size-4" />
                <span>Explore Member Directory</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      title="Student Career Toolkit"
      subtitle="Personalized academic eligibility tools, skill gap analysis, and verified opportunity matching."
      actions={
        <Badge variant="info" className="gap-1.5 py-1 px-3">
          <GraduationCap className="size-3.5" />
          <span>Student Account • Academic Tools Enabled</span>
        </Badge>
      }
    >
      <CareerDashboardView />
    </DashboardTemplate>
  );
}
