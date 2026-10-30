import {
  MapPin,
  DollarSign,
  CheckCircle2,
  Share2,
  Bookmark,
  Flag,
  Send,
} from "lucide-react";
import { DetailsTemplate } from "@/components/templates/details-template";
import { EmployerBadge } from "@/components/opportunities/employer-badge";
import { MatchScoreIndicator } from "@/components/opportunities/match-score-indicator";
import { Button } from "@/components/ui/button";
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

export const metadata = {
  title: "Opportunity Details",
  description: "View comprehensive opportunity specifications, requirements, and apply directly.",
};

export default function OpportunityDetailsPage() {
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
              <BreadcrumbPage>Distributed Systems Software Intern</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-bold text-2xl shadow-xs">
              G
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <EmployerBadge classification="OFFICIAL_EMPLOYER" />
                <Badge variant="outline" className="text-xs">
                  Internship • Summer 2027
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Distributed Systems Software Intern
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Google Cloud Platform</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  <span>Sunnyvale, CA (Hybrid / Remote Option)</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <DollarSign className="size-3.5" />
                  <span>$55 - $65 / hour</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <MatchScoreIndicator score={92} />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Bookmark className="size-3.5" />
                <span>Save</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Share2 className="size-3.5" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      }
      sidebar={
        <div className="space-y-6">
          {/* Direct Application CTA Card */}
          <Card className="rounded-2xl border-2 border-primary/20 bg-card shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold">Apply for Position</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Application Deadline:</span>
                  <span className="font-semibold text-foreground">Nov 20, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Method:</span>
                  <span className="font-semibold text-foreground">Internal Direct</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Applicant Volume:</span>
                  <span className="font-semibold text-emerald-600">14 campus applicants</span>
                </div>
              </div>

              <Button className="w-full gap-2" size="lg">
                <Send className="size-4" />
                <span>Submit Application with Vault Resume</span>
              </Button>

              <p className="text-[11px] text-muted-foreground text-center leading-tight">
                Your resume is securely shared via a 15-minute time-limited URL with the verified recruiter.
              </p>
            </CardContent>
          </Card>

          {/* Hiring Representative Card */}
          <Card className="rounded-2xl border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Verified Recruiter Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                  MR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Marcus Reynolds</h4>
                  <p className="text-[11px] text-muted-foreground">University Talent Partner @ Google</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Official campus recruiter for North American engineering intern cohorts.
              </p>
            </CardContent>
          </Card>

          {/* Integrity / Report */}
          <div className="text-center">
            <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors">
              <Flag className="size-3" />
              <span>Report this posting to University Career Services</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Role Overview */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            Role Overview
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As a Distributed Systems Software Intern at Google Cloud, you will work directly with our core infrastructure teams to build scalable backend services handling millions of concurrent requests. You will design, develop, and test mission-critical components running on our next-generation Kubernetes orchestration platform.
          </p>
        </section>

        {/* Responsibilities */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            Key Responsibilities
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Collaborate with senior distributed systems engineers to implement high-throughput gRPC APIs.</li>
            <li>Analyze telemetry metrics, identifying latency bottlenecks and optimizing concurrency primitives.</li>
            <li>Write automated unit and integration tests with continuous integration pipelines.</li>
            <li>Participate in design document reviews and present your intern capstone project to leadership.</li>
          </ul>
        </section>

        {/* Requirements & Qualifications */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            Eligibility &amp; Desired Qualifications
          </h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Currently enrolled in a Bachelor&apos;s or Master&apos;s degree in Computer Science, Software Engineering, or related field.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Demonstrated proficiency in Go, C++, Java, or Rust with knowledge of data structures and algorithms.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Familiarity with containerization (Docker, Kubernetes) and networking concepts.</span>
            </div>
          </div>
        </section>

        {/* Required Skills Badges */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Target Skill Profile
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Go", "Kubernetes", "gRPC", "Distributed Systems", "Concurrency", "Linux"].map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1 text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </DetailsTemplate>
  );
}
