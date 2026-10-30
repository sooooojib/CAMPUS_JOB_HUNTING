import { ShieldCheck } from "lucide-react";
import { FormTemplate } from "@/components/templates/form-template";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Post New Opportunity",
  description: "Submit a job, internship, or research opening for university verification.",
};

export default function PostOpportunityPage() {
  return (
    <FormTemplate
      maxWidth="xl"
      title="Publish Career Opportunity"
      subtitle="All postings are reviewed by University Career Services or alumni moderators before appearing in public member feeds."
      breadcrumbs={
        <Breadcrumb className="mb-4">
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
              <BreadcrumbPage>Post Opening</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      footerActions={
        <>
          <Button variant="outline" type="button">
            Save as Draft
          </Button>
          <Button type="submit" className="gap-2">
            <ShieldCheck className="size-4" />
            <span>Submit for Verification</span>
          </Button>
        </>
      }
    >
      <form className="space-y-6">
        {/* Section 1: Classification & Role Basics */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            1. Opportunity Classification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="classification">Posting Authority *</Label>
              <Select defaultValue="OFFICIAL_EMPLOYER">
                <SelectTrigger id="classification">
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OFFICIAL_EMPLOYER">
                    Official Employer (Direct Representative)
                  </SelectItem>
                  <SelectItem value="COMMUNITY_SHARED">
                    Community Shared Lead (Alumni / Peer Referral)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Community leads will display an explicit disclaimer indicating the poster is an intermediary.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type">Opportunity Type *</Label>
              <Select defaultValue="INTERNSHIP">
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="FULL_TIME">Full-Time Career</SelectItem>
                  <SelectItem value="PART_TIME">Part-Time Student Role</SelectItem>
                  <SelectItem value="CONTRACT">Contract / Fellowship</SelectItem>
                  <SelectItem value="OTHER">Other Opportunity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 2: Position Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            2. Position Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" placeholder="e.g. Frontend Engineer Intern" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="companyName">Company / Institution Name *</Label>
              <Input id="companyName" placeholder="e.g. Stripe, Google Cloud" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="workplaceType">Workplace Model *</Label>
              <Select defaultValue="HYBRID">
                <SelectTrigger id="workplaceType">
                  <SelectValue placeholder="Select workplace model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ON_SITE">On-Site</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                  <SelectItem value="REMOTE">Fully Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Primary Location *</Label>
              <Input id="location" placeholder="e.g. San Francisco, CA or Remote" required />
            </div>
          </div>
        </div>

        {/* Section 3: Compensation & Deadlines */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            3. Compensation &amp; Timelines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="salaryMin">Minimum Compensation ($)</Label>
              <Input id="salaryMin" type="number" placeholder="50" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="salaryMax">Maximum Compensation ($)</Label>
              <Input id="salaryMax" type="number" placeholder="65" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="salaryPeriod">Rate Period</Label>
              <Select defaultValue="HOURLY">
                <SelectTrigger id="salaryPeriod">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOURLY">Hourly ($/hr)</SelectItem>
                  <SelectItem value="MONTHLY">Monthly ($/mo)</SelectItem>
                  <SelectItem value="ANNUAL">Annual Salary ($/yr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="deadline">Application Deadline *</Label>
              <Input id="deadline" type="date" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="applicationMethod">Application Handling *</Label>
              <Select defaultValue="INTERNAL">
                <SelectTrigger id="applicationMethod">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNAL">Internal Vault Application (Direct)</SelectItem>
                  <SelectItem value="EXTERNAL">External Portal Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 4: Role Description */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            4. Detailed Job Description &amp; Qualifications
          </h3>

          <div className="space-y-1.5">
            <Label htmlFor="description">Role Description *</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Describe the mission, day-to-day responsibilities, and team environment..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skills">Required Skills (Comma-separated)</Label>
            <Input id="skills" placeholder="e.g. TypeScript, React, PostgreSQL, Docker" />
          </div>
        </div>
      </form>
    </FormTemplate>
  );
}
