import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import {
  MapPin,
  DollarSign,
  Building2,
  Calendar,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Share2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Mail,
} from "lucide-react";
import { auth } from "@/lib/auth";
import {
  getOpportunityById,
  getRelatedOpportunities,
  isOpportunityBookmarked,
} from "@/lib/services/opportunity";
import { DetailsTemplate } from "@/components/templates/details-template";
import { DeadlineIndicator } from "@/components/opportunities/deadline-indicator";
import {
  OpportunityDetailActions,
  OpportunityApplyButton,
} from "@/components/opportunities/opportunity-detail-actions";
import { OpportunityComments } from "@/components/opportunities/opportunity-comments";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const opp = await getOpportunityById(id);
    return {
      title: `${opp.title} at ${opp.companyName} | UniCareer`,
      description: opp.description.slice(0, 160),
    };
  } catch {
    return {
      title: "Opportunity Details | UniCareer",
    };
  }
}

export default async function OpportunityDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    redirect(`/login?callbackUrl=/opportunities/${id}`);
  }

  let opportunity;
  try {
    opportunity = await getOpportunityById(id, session.user.id);
  } catch (err: any) {
    if (err.message.includes("NOT_FOUND")) {
      notFound();
    }
    return (
      <div className="container max-w-4xl py-12 px-4 text-center space-y-4">
        <div className="size-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <ShieldCheck className="size-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {err.message || "This opportunity is pending administrative review and is only visible to authorized moderators or its original author."}
        </p>
        <div className="pt-2">
          <Link
            href="/opportunities"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-4 mr-1.5" />
            <span>Return to Opportunities</span>
          </Link>
        </div>
      </div>
    );
  }

  const [bookmarked, related] = await Promise.all([
    isOpportunityBookmarked(session.user.id, id),
    getRelatedOpportunities(id, 3),
  ]);

  const canEdit =
    session.user.systemRole === "ADMIN" ||
    opportunity.posterId === session.user.id;

  const canManageApplicants =
    session.user.systemRole === "ADMIN" ||
    (opportunity.companyId &&
      (opportunity.company as any)?.members?.some(
        (m: any) =>
          m.userId === session.user.id &&
          (m.role === "OWNER" ||
            m.role === "ADMIN" ||
            m.canManageCompany ||
            m.canPostOpportunities)
      ));

  const isExpired = opportunity.status === "EXPIRED" || opportunity.status === "CLOSED";

  const workplaceLabel =
    opportunity.workplaceType === "REMOTE"
      ? "Remote"
      : opportunity.workplaceType === "HYBRID"
      ? "Hybrid"
      : "On-site";

  return (
    <DetailsTemplate
      breadcrumbs={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/opportunities">Opportunities</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-xs">
                {opportunity.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
          <div className="flex items-start gap-4 flex-1">
            {/* Company Logo or Initials */}
            {opportunity.companyLogo ? (
              <img
                src={opportunity.companyLogo}
                alt={opportunity.companyName}
                className="size-16 shrink-0 rounded-2xl border border-border object-contain bg-background p-2 shadow-xs"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary font-bold text-2xl shadow-xs">
                {opportunity.companyName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs uppercase font-medium">
                  {(opportunity.type || "").replace("_", " ")}
                </Badge>
                {opportunity.status !== "APPROVED" && (
                  <Badge
                    variant={
                      opportunity.status === "PENDING"
                        ? "warning"
                        : opportunity.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs uppercase font-mono"
                  >
                    {opportunity.status}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                {opportunity.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-muted-foreground" />
                  {opportunity.companyName}
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  <span>
                    {opportunity.location} ({workplaceLabel})
                  </span>
                </span>

                {opportunity.salaryOrStipend && (
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="size-3.5" />
                    <span>{opportunity.salaryOrStipend}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <OpportunityDetailActions
              opportunityId={opportunity.id}
              initialBookmarked={bookmarked}
              canEdit={canEdit}
              canManageApplicants={canManageApplicants}
            />
          </div>
        </div>
      }
      sidebar={
        <div className="space-y-6">
          {/* Action Box */}
          <Card className="rounded-2xl border-2 border-primary/20 bg-card shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Opportunity Gate
                </CardTitle>
                <DeadlineIndicator deadline={opportunity.deadline} />
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Application Cutoff:</span>
                  <span className="font-semibold font-mono text-foreground">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(opportunity.deadline))}
                  </span>
                </div>
                {opportunity.contactEmail && (
                  <div className="pt-2 space-y-2 border-t border-border/40">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Inquiries &amp; Referral:</span>
                      <span className="font-mono text-foreground font-medium truncate max-w-[170px]" title={opportunity.contactEmail}>
                        {opportunity.contactEmail}
                      </span>
                    </div>
                    <a
                      href={`mailto:${opportunity.contactEmail}?subject=${encodeURIComponent(
                        `[UniCareer Referral] Application for ${opportunity.title} at ${opportunity.companyName}`
                      )}&body=${encodeURIComponent(
                        `Dear Hiring Contact,\n\nI am reaching out via UniCareer Community regarding the ${opportunity.title} position at ${opportunity.companyName}.\n\nI would appreciate if you could review my qualifications for an internal referral or candidate consideration.\n\nBest regards,\n`
                      )}`}
                      className="inline-flex w-full items-center justify-center gap-2 h-9 px-3 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary text-xs font-semibold border border-primary/20 transition-colors"
                    >
                      <Mail className="size-3.5" />
                      <span>Mail Me / Contact for Referral</span>
                    </a>
                  </div>
                )}
              </div>

              <OpportunityApplyButton
                opportunityId={opportunity.id}
                opportunityTitle={opportunity.title}
                companyName={opportunity.companyName}
                applicationMethod={opportunity.applicationMethod}
                externalUrl={opportunity.externalUrl}
                deadline={opportunity.deadline}
                isExpired={isExpired}
                minCgpa={opportunity.minCgpa}
              />
            </CardContent>
          </Card>

          {/* Opportunity Provenance Card */}
          <Card className="rounded-2xl border border-border/70 bg-card shadow-2xs">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <span>Provenance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                  {opportunity.poster.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <Link
                    href={`/profile/${opportunity.poster.id}`}
                    className="font-bold text-foreground hover:text-primary transition-colors truncate block"
                  >
                    {opportunity.poster.name}
                  </Link>
                  <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                    <span className="text-primary font-medium">Alumni Contributor</span>
                    <span>•</span>
                    <span className="truncate">ID: {opportunity.poster.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Rejection Notice Banner (if viewing own rejected posting) */}
        {opportunity.status === "REJECTED" && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-destructive text-sm">
              <ShieldCheck className="size-4" />
              <span>Institutional Moderation Rejection Notice</span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed">
              <strong>Reviewer Reason:</strong> {opportunity.rejectionReason}
            </p>
            {canEdit && (
              <div className="pt-2">
                <Link
                  href={`/opportunities/post?editId=${opportunity.id}`}
                  className={buttonVariants({ variant: "destructive", size: "xs" })}
                >
                  Edit &amp; Resubmit for Review
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Academic Criteria & Target Majors Grid */}
        <div className="rounded-2xl border border-border/70 bg-card/50 p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" />
            <span>Academic Standing &amp; Discipline Eligibility</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1 bg-muted/40 p-3.5 rounded-xl border border-border/50">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                Target Major / Department
              </span>
              <div className="font-semibold text-foreground">
                {opportunity.openToAllDepartments ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Open to All Majors
                  </span>
                ) : (
                  opportunity.targetDepartments.join(", ")
                )}
              </div>
            </div>

            <div className="space-y-1 bg-muted/40 p-3.5 rounded-xl border border-border/50">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                Minimum Academic CGPA
              </span>
              <div className="font-semibold text-foreground font-mono">
                {opportunity.minCgpa !== null && opportunity.minCgpa !== undefined ? (
                  <span className="text-amber-600 dark:text-amber-400">
                    {opportunity.minCgpa.toFixed(2)} / 4.00
                  </span>
                ) : (
                  <span className="text-muted-foreground">No CGPA Cutoff</span>
                )}
              </div>
            </div>

            <div className="space-y-1 bg-muted/40 p-3.5 rounded-xl border border-border/50">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                Academic Standing
              </span>
              <div className="font-semibold text-foreground">
                {opportunity.minAcademicYear || "Any Academic Year"}
              </div>
            </div>
          </div>
        </div>

        {/* Required Technical & Professional Skills - Skill Table */}
        {opportunity.requiredSkills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span>Competencies &amp; Skills Specification Table</span>
            </h3>

            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-[11px] uppercase tracking-wider font-mono text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="px-4 py-2.5 font-bold">#</th>
                    <th className="px-4 py-2.5 font-bold">Skill / Competency</th>
                    <th className="px-4 py-2.5 font-bold">Priority / Level</th>
                    <th className="px-4 py-2.5 font-bold">Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {opportunity.requiredSkills.map((skill, idx) => (
                    <tr key={skill} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-2.5 font-semibold text-foreground">{skill}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-primary/10 text-primary border border-primary/20">
                          {idx === 0 ? "Core Focus" : "Required Proficiency"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="size-3" />
                          <span>Mandatory</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Role Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Briefcase className="size-4 text-primary" />
            <span>Role Specifications &amp; Responsibilities</span>
          </h3>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-2xs">
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-line text-sm">
              {opportunity.description}
            </div>
          </div>
        </div>

        {/* Corporate Organization Profile */}
        {opportunity.company && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <span>About {opportunity.company.name}</span>
            </h3>

            <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {opportunity.company.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opportunity.company.industry || "Enterprise Partner"} • {opportunity.company.location || "Bangladesh"}
                  </p>
                </div>

                {opportunity.company.website && (
                  <a
                    href={opportunity.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>Visit Company Website</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>

              {opportunity.company.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {opportunity.company.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Opportunity Discussion & Comments */}
        <OpportunityComments
          opportunityId={opportunity.id}
          currentUserId={session.user.id}
        />
      </div>
    </DetailsTemplate>
  );
}
