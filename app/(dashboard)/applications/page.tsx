import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";
import { ListingTemplate } from "@/components/templates/listing-template";
import { ApplicationStatusBadge } from "@/components/opportunities/application-status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "My Applications",
  description: "Track the status of your university career and internship applications.",
};

const SAMPLE_APPLICATIONS = [
  {
    id: "app-1",
    opportunityId: "opp-101",
    title: "Distributed Systems Software Intern",
    company: "Google Cloud",
    type: "INTERNSHIP",
    appliedDate: "2026-10-28",
    status: "UNDER_REVIEW" as const,
    resumeName: "Sarah_Miller_Resume_2026.pdf",
    notes: "Recruiter reviewed resume profile on Oct 29.",
  },
  {
    id: "app-2",
    opportunityId: "opp-102",
    title: "Product Design Associate",
    company: "Stripe",
    type: "FULL_TIME",
    appliedDate: "2026-10-25",
    status: "SUBMITTED" as const,
    resumeName: "Sarah_Miller_Design_Portfolio.pdf",
    notes: "Application received and queued for review.",
  },
  {
    id: "app-3",
    opportunityId: "opp-103",
    title: "Applied AI Research Fellow",
    company: "Robotics Laboratory",
    type: "CONTRACT",
    appliedDate: "2026-10-15",
    status: "INTERVIEWING" as const,
    resumeName: "Sarah_Miller_Academic_CV.pdf",
    notes: "Technical interview scheduled for Nov 04, 2:00 PM.",
  },
];

export default function ApplicationsPage() {
  return (
    <ListingTemplate
      title="My Applications"
      subtitle="Private candidate dashboard. You can review submission timestamps, recruiter stages, and withdraw applications."
      activeFiltersBar={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">3 Total Applications</Badge>
          <Badge variant="info">1 Interview Scheduled</Badge>
          <Badge variant="outline">Private Resume Vault Attached</Badge>
        </div>
      }
    >
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Opportunity &amp; Company</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Vault Resume</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SAMPLE_APPLICATIONS.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="space-y-1">
                    <Link
                      href={`/opportunities/${app.opportunityId}`}
                      className="font-bold text-foreground hover:text-primary hover:underline text-sm leading-snug flex items-center gap-1.5"
                    >
                      <span>{app.title}</span>
                      <ExternalLink className="size-3 text-muted-foreground" />
                    </Link>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="font-medium text-foreground/80">{app.company}</span>
                      <span>•</span>
                      <span>{app.type}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {app.appliedDate}
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-1 text-xs text-primary font-mono bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                    <FileText className="size-3" />
                    <span className="truncate max-w-[140px]">{app.resumeName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <ApplicationStatusBadge status={app.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive">
                      Withdraw
                    </Button>
                    <Link
                      href={`/opportunities/${app.opportunityId}`}
                      className={buttonVariants({ variant: "outline", size: "sm", className: "text-xs" })}
                    >
                      View Role
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ListingTemplate>
  );
}
