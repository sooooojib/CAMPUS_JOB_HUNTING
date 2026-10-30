"use client";

import * as React from "react";
import {
  Sparkles,
  Search,
  Mail,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Feedback Components
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorBanner } from "@/components/feedback/error-banner";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";

// Opportunity Components
import { JobCard } from "@/components/opportunities/job-card";
import { CompanyCard } from "@/components/opportunities/company-card";
import { EmployerBadge } from "@/components/opportunities/employer-badge";
import { VerifiedBadge } from "@/components/opportunities/verified-badge";
import { MatchScoreIndicator } from "@/components/opportunities/match-score-indicator";
import { ApplicationStatusBadge } from "@/components/opportunities/application-status-badge";
import { ApplicantSummaryCard } from "@/components/opportunities/applicant-summary-card";

// Community Components
import { MemberProfileCard } from "@/components/community/member-profile-card";
import { FeedPostCard } from "@/components/community/feed-post-card";
import { ReferralCard } from "@/components/community/referral-card";
import { CreatePostBox } from "@/components/community/create-post-box";
import { CommentThread, CommentItem } from "@/components/community/comment-thread";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const DEMO_DATES = {
  pastDays3: "2026-10-27T10:00:00.000Z",
  pastHours5: "2026-10-30T17:00:00.000Z",
  futureDays2: "2026-11-01T12:00:00.000Z",
  futureDays14: "2026-11-13T12:00:00.000Z",
};

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: "c-1",
    authorName: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "Great initiative! As an alum at Stripe, I'm happy to review resumes for our summer backend intern roles.",
    createdAt: "2026-10-30T18:00:00.000Z",
    likesCount: 5,
    replies: [
      {
        id: "c-2",
        authorName: "Tanvir Ahmed",
        content: "Thank you Sarah! I just submitted a referral request via the platform.",
        createdAt: "2026-10-30T19:30:00.000Z",
      },
    ],
  },
];

export default function DesignSystemPage() {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [demoComments, setDemoComments] = React.useState<CommentItem[]>(INITIAL_COMMENTS);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Design System Specification</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              UI/UX Design System
            </h1>
            <Badge variant="info">Stage 2 Verified</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete visual tokens, component library, accessibility states, and domain micro-UIs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">Theme Preview:</span>
          <ThemeToggle />
        </div>
      </div>

      {/* TABS NAVIGATION ACROSS DESIGN SYSTEM MODULES */}
      <Tabs defaultValue="tokens" className="space-y-8">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 rounded-xl">
          <TabsTrigger value="tokens">Design Tokens & Colors</TabsTrigger>
          <TabsTrigger value="buttons">Buttons & Forms</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & Modals</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunity Components</TabsTrigger>
          <TabsTrigger value="community">Community & Networking</TabsTrigger>
          <TabsTrigger value="tables">Data Tables & Pagination</TabsTrigger>
        </TabsList>

        {/* TAB 1: DESIGN TOKENS & TYPOGRAPHY */}
        <TabsContent value="tokens" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette Tokens</CardTitle>
              <CardDescription>
                Bespoke University Navy & Slate semantic color system adhering to WCAG 2.1 AA contrast in both light and dark modes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                <div className="space-y-1.5">
                  <div className="h-20 rounded-lg bg-primary flex items-end p-2.5 shadow-xs">
                    <span className="text-[11px] font-bold text-primary-foreground">Primary</span>
                  </div>
                  <p className="text-xs font-medium">Deep Navy / Royal</p>
                  <p className="text-[10px] text-muted-foreground font-mono">--primary</p>
                </div>

                <div className="space-y-1.5">
                  <div className="h-20 rounded-lg bg-secondary flex items-end p-2.5 border border-border shadow-2xs">
                    <span className="text-[11px] font-bold text-secondary-foreground">Secondary</span>
                  </div>
                  <p className="text-xs font-medium">Slate Subtle</p>
                  <p className="text-[10px] text-muted-foreground font-mono">--secondary</p>
                </div>

                <div className="space-y-1.5">
                  <div className="h-20 rounded-lg bg-background flex items-end p-2.5 border border-border shadow-2xs">
                    <span className="text-[11px] font-bold text-foreground">Background</span>
                  </div>
                  <p className="text-xs font-medium">Crisp / Dark Void</p>
                  <p className="text-[10px] text-muted-foreground font-mono">--background</p>
                </div>

                <div className="space-y-1.5">
                  <div className="h-20 rounded-lg bg-card flex items-end p-2.5 border border-border shadow-xs">
                    <span className="text-[11px] font-bold text-card-foreground">Card Surface</span>
                  </div>
                  <p className="text-xs font-medium">Elevated Surface</p>
                  <p className="text-[10px] text-muted-foreground font-mono">--card</p>
                </div>

                <div className="space-y-1.5">
                  <div className="h-20 rounded-lg bg-emerald-500 flex items-end p-2.5 text-white shadow-xs">
                    <span className="text-[11px] font-bold">Success</span>
                  </div>
                  <p className="text-xs font-medium">Emerald Verified</p>
                  <p className="text-[10px] text-muted-foreground font-mono">--success</p>
                </div>

                <div className="space-y-1.5">
                  <div className="h-20 rounded-lg bg-destructive flex items-end p-2.5 text-destructive-foreground shadow-xs">
                    <span className="text-[11px] font-bold">Destructive</span>
                  </div>
                  <p className="text-xs font-medium">Crimson Error</p>
                  <p className="text-[10px] text-muted-foreground font-mono">--destructive</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography Hierarchy */}
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale & Standards</CardTitle>
              <CardDescription>
                Inter typography hierarchy tuned for clarity, readability, and consistent line-heights.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b border-border/60 pb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    Display Heading 1 (4xl/5xl)
                  </span>
                  <p className="text-xs text-muted-foreground">Used for major hero headers and landing statements</p>
                </div>
                <code className="text-xs font-mono text-muted-foreground">text-4xl font-extrabold</code>
              </div>

              <div className="border-b border-border/60 pb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    Page Header 2 (2xl)
                  </span>
                  <p className="text-xs text-muted-foreground">Section and major view header</p>
                </div>
                <code className="text-xs font-mono text-muted-foreground">text-2xl font-bold</code>
              </div>

              <div className="border-b border-border/60 pb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-base font-semibold text-foreground">
                    Card / Subtitle 3 (base)
                  </span>
                  <p className="text-xs text-muted-foreground">Component and item title</p>
                </div>
                <code className="text-xs font-mono text-muted-foreground">text-base font-semibold</code>
              </div>

              <div className="border-b border-border/60 pb-3 flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-foreground leading-relaxed">
                    Standard Body Text (sm) — Facilitates high reading comprehension for job descriptions, community feed discussion bodies, and referral letters.
                  </p>
                </div>
                <code className="text-xs font-mono text-muted-foreground">text-sm text-foreground</code>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Supporting Metadata & Badges (xs) — e.g. Class of 2026 • Computer Science & Engineering
                  </span>
                </div>
                <code className="text-xs font-mono text-muted-foreground">text-xs text-muted-foreground</code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: BUTTONS & FORMS */}
        <TabsContent value="buttons" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Button System</CardTitle>
              <CardDescription>
                All button variants with subtle hover elevation and keyboard focus rings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Variants</h4>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button variant="default">Primary Default</Button>
                  <Button variant="secondary">Secondary Action</Button>
                  <Button variant="outline">Outline Action</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive Action</Button>
                  <Button variant="link">Inline Link</Button>
                  <Button disabled>Disabled State</Button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sizes & Icons</h4>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button size="xs">Extra Small (xs)</Button>
                  <Button size="sm">Small (sm)</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large (lg)</Button>
                  <Button size="icon-sm" aria-label="Search">
                    <Search className="size-3.5" />
                  </Button>
                  <Button className="gap-2">
                    <Sparkles className="size-4" />
                    <span>With Leading Icon</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Form Controls & Inputs</CardTitle>
              <CardDescription>
                Accessible form fields with explicit labels, focus outlines, and error indicators.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Standard Text Input</label>
                  <Input placeholder="Enter your full name..." />
                  <p className="text-[11px] text-muted-foreground">Helper guidance text</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">With Icon Integration</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                    <Input className="pl-9" placeholder="student@university.edu" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Institutional email address</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-destructive">Invalid / Error State</label>
                  <Input
                    defaultValue="invalid-cgpa-score"
                    aria-invalid="true"
                    className="border-destructive focus-visible:ring-destructive/30"
                  />
                  <p className="text-[11px] font-medium text-destructive">CGPA must be a valid number between 0.00 and 4.00</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Select Dropdown</label>
                  <Select defaultValue="internship">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select opportunity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internship">Internship Opportunity</SelectItem>
                      <SelectItem value="full_time">Full-Time Position</SelectItem>
                      <SelectItem value="part_time">Part-Time Role</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">Textarea Description</label>
                <Textarea placeholder="Share details or requirements for this opportunity..." />
              </div>

              <div className="flex flex-wrap gap-8 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="mentorship-check" defaultChecked />
                  <label
                    htmlFor="mentorship-check"
                    className="text-xs font-medium leading-none cursor-pointer text-foreground"
                  >
                    Open to mentoring current students
                  </label>
                </div>

                <RadioGroup defaultValue="on-site" className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="on-site" id="r-onsite" />
                    <label htmlFor="r-onsite" className="text-xs font-medium cursor-pointer">On-site</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remote" id="r-remote" />
                    <label htmlFor="r-remote" className="text-xs font-medium cursor-pointer">Remote</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hybrid" id="r-hybrid" />
                    <label htmlFor="r-hybrid" className="text-xs font-medium cursor-pointer">Hybrid</label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: FEEDBACK, TOASTS & MODALS */}
        <TabsContent value="feedback" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Toast Notifications & Confirmations</CardTitle>
              <CardDescription>
                High-visibility user feedback triggers and destructive confirmation modals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => toast.success("Application submitted successfully to Google!")}
                >
                  Trigger Success Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.error("File upload failed: Resume exceeds 5MB limit.")}
                >
                  Trigger Error Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info("New alumni connection request received.")}
                >
                  Trigger Info Toast
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setConfirmOpen(true)}
                  className="gap-2"
                >
                  <Trash2 className="size-4" />
                  <span>Open Confirmation Modal</span>
                </Button>
              </div>

              <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Withdraw Application?"
                description="Are you sure you want to withdraw your submission for Software Engineer Intern? The hiring team will no longer review your profile."
                confirmLabel="Withdraw Application"
                onConfirm={() => {
                  setConfirmOpen(false);
                  toast.success("Application withdrawn.");
                }}
              />
            </CardContent>
          </Card>

          {/* Error Banner & Empty State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Inline Error Banner</h3>
              <ErrorBanner
                title="Failed to load applicants"
                message="Unable to communicate with the application service. Please verify your internet connection."
                onRetry={() => toast.info("Retrying fetch...")}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Empty State Component</h3>
              <EmptyState
                title="No active referral requests"
                description="When students from your department request referrals for your company, they will appear here."
                action={
                  <Button variant="outline" size="sm">
                    Browse Other Opportunities
                  </Button>
                }
              />
            </div>
          </div>

          {/* Skeletons Loading States */}
          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loading States</CardTitle>
              <CardDescription>
                Pulsing geometry that mirrors final layout components to prevent cumulative layout shifts (CLS).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: OPPORTUNITY COMPONENTS */}
        <TabsContent value="opportunities" className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground">Opportunity Classification & Status Badges</h3>
            <div className="flex flex-wrap gap-2.5 items-center">
              <EmployerBadge classification="OFFICIAL_EMPLOYER" />
              <EmployerBadge classification="COMMUNITY_SHARED" />
              <VerifiedBadge status="VERIFIED" />
              <VerifiedBadge status="PENDING" />
              <MatchScoreIndicator score={88} />
              <MatchScoreIndicator score={55} />
              <ApplicationStatusBadge status="SUBMITTED" />
              <ApplicationStatusBadge status="UNDER_REVIEW" />
              <ApplicationStatusBadge status="SHORTLISTED" />
              <ApplicationStatusBadge status="OFFERED" />
            </div>
          </div>

          {/* Job Card Previews */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">Job Cards (Official vs Community-Shared)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Official Employer */}
              <JobCard
                id="job-1"
                title="Software Engineer Intern — Cloud Infrastructure"
                companyName="Microsoft"
                location="Redmond, WA"
                workplaceType="HYBRID"
                type="INTERNSHIP"
                classification="OFFICIAL_EMPLOYER"
                salaryRange="$45 - $55 / hour"
                deadline={DEMO_DATES.futureDays14}
                matchScore={92}
                skills={["TypeScript", "Go", "Docker", "Kubernetes", "PostgreSQL"]}
                isBookmarked={true}
                onBookmarkToggle={(id) => toast.info(`Toggled bookmark for ${id}`)}
              />

              {/* Card 2: Community Shared Referral */}
              <JobCard
                id="job-2"
                title="Associate Product Manager (Alumni Referral Lead)"
                companyName="Stripe"
                location="San Francisco, CA"
                workplaceType="REMOTE"
                type="FULL_TIME"
                classification="COMMUNITY_SHARED"
                salaryRange="$110k - $130k"
                deadline={DEMO_DATES.futureDays2}
                matchScore={78}
                skills={["Product Analytics", "SQL", "User Research", "Agile"]}
                isBookmarked={false}
                onBookmarkToggle={(id) => toast.info(`Toggled bookmark for ${id}`)}
              />
            </div>
          </div>

          {/* Company Card & Applicant Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">Company Directory Card</h3>
              <CompanyCard
                id="comp-1"
                name="Amazon Web Services"
                industry="Cloud Computing & Enterprise Tech"
                location="Seattle, WA"
                activeJobsCount={8}
                isVerifiedPartner={true}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">Applicant Review Summary Card</h3>
              <ApplicantSummaryCard
                id="app-1"
                candidateName="Farhan Kabir"
                appliedRole="Frontend Developer Intern"
                appliedDate={DEMO_DATES.pastDays3}
                status="UNDER_REVIEW"
                matchScore={85}
                hasResume={true}
                onViewCandidate={(id) => toast.info(`Opening review drawer for applicant ${id}`)}
              />
            </div>
          </div>
        </TabsContent>

        {/* TAB 5: COMMUNITY & NETWORKING */}
        <TabsContent value="community" className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">Post Creation Interface</h3>
            <CreatePostBox
              currentUser={{ name: "Alex Mercer" }}
              onSubmitPost={async (_content, category) => {
                toast.success(`Published post in ${category}!`);
              }}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">Community Feed Post with Embedded Job & Reactions</h3>
            <FeedPostCard
              id="post-1"
              authorId="usr-1"
              authorName="Dr. Nadia Rahman"
              authorMembership="FACULTY"
              category="CAREER_ADVICE"
              createdAt={DEMO_DATES.pastHours5}
              title="Preparing for Summer Tech Interviews: What recruiters look for"
              content="When applying for competitive software and data internships, prioritize demonstrating system fundamentals and clean architecture over simply listing libraries. Make sure your Git commits tell a clear narrative, and explain your technical tradeoffs clearly in your interviews!"
              attachedOpportunity={{
                id: "job-1",
                title: "Software Engineer Intern",
                company: "Microsoft",
              }}
              commentsCount={14}
              initialReactions={{ LIKE: 24, INSIGHTFUL: 18, CELEBRATE: 7 }}
              onCommentClick={() => toast.info("Opened comment drawer")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">Member Profile Card (Directory)</h3>
              <MemberProfileCard
                id="mem-1"
                name="David Zhang"
                membershipType="ALUMNI"
                headline="Senior Platform Engineer at Datadog"
                department="Computer Science"
                graduationYear={2022}
                skills={["Distributed Systems", "Kubernetes", "Go", "PostgreSQL"]}
                isAvailableForMentorship={true}
                connectionState="NOT_CONNECTED"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">Structured Referral Request Card</h3>
              <ReferralCard
                id="ref-1"
                candidateName="Raisa Chowdhury"
                department="Computer Science"
                graduationYear={2025}
                targetCompany="Google"
                targetRole="Associate Software Engineer"
                pitch="I've completed two high-scale distributed systems projects and ranked in the top 5% at the National Collegiate Hackathon. Seeking an alumni referral for Google Cloud."
                status="OPEN"
                onOfferReferral={() => toast.success("Referral discussion initiated!")}
              />
            </div>
          </div>

          {/* Comment Thread Component */}
          <Card>
            <CardHeader>
              <CardTitle>Threaded Discussion Component</CardTitle>
              <CardDescription>
                Nested comments with timestamp, author affiliation, like counts, and reply capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommentThread
                comments={demoComments}
                onAddComment={(content) => {
                  toast.success("Comment added to thread!");
                  setDemoComments((prev) => [
                    ...prev,
                    {
                      id: `c-${Date.now()}`,
                      authorName: "You (Verified Member)",
                      content,
                      createdAt: new Date().toISOString(),
                    },
                  ]);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: DATA TABLES & PAGINATION */}
        <TabsContent value="tables" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Data Table Component</CardTitle>
              <CardDescription>
                Accessible, semantic data table for applicant tracking and administration queues.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Applied Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Match %</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold text-foreground">Kazi Imtiaz</TableCell>
                      <TableCell>Machine Learning Intern</TableCell>
                      <TableCell>Computer Science (&apos;26)</TableCell>
                      <TableCell><MatchScoreIndicator score={94} showLabel={false} /></TableCell>
                      <TableCell><ApplicationStatusBadge status="SHORTLISTED" /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="xs">Review</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-foreground">Mehnaz Rahman</TableCell>
                      <TableCell>Backend Engineer</TableCell>
                      <TableCell>Software Engineering (&apos;24)</TableCell>
                      <TableCell><MatchScoreIndicator score={81} showLabel={false} /></TableCell>
                      <TableCell><ApplicationStatusBadge status="UNDER_REVIEW" /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="xs">Review</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-foreground">Asif Hossain</TableCell>
                      <TableCell>DevOps Intern</TableCell>
                      <TableCell>Computer Science (&apos;25)</TableCell>
                      <TableCell><MatchScoreIndicator score={68} showLabel={false} /></TableCell>
                      <TableCell><ApplicationStatusBadge status="SUBMITTED" /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="xs">Review</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="pt-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
