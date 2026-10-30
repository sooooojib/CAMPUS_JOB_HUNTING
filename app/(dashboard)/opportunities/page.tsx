import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ListingTemplate } from "@/components/templates/listing-template";
import { JobCard } from "@/components/opportunities/job-card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

export const metadata = {
  title: "Opportunities",
  description: "Browse verified internships, full-time jobs, and research positions.",
};

const SAMPLE_OPPORTUNITIES = [
  {
    id: "opp-101",
    title: "Distributed Systems Software Intern (Summer 2027)",
    companyName: "Google Cloud",
    classification: "OFFICIAL_EMPLOYER" as const,
    type: "INTERNSHIP" as const,
    workplaceType: "HYBRID" as const,
    location: "Sunnyvale, CA (or Remote)",
    salaryRange: "$55 - $65 / hr",
    deadline: "2026-11-20T23:59:59.000Z",
    skills: ["Go", "Kubernetes", "gRPC", "Distributed Systems"],
    matchScore: 92,
  },
  {
    id: "opp-102",
    title: "Product Design Associate — New Grad",
    companyName: "Stripe",
    classification: "COMMUNITY_SHARED" as const,
    type: "FULL_TIME" as const,
    workplaceType: "REMOTE" as const,
    location: "Global Remote",
    salaryRange: "$120k - $145k / yr",
    deadline: "2026-12-01T23:59:59.000Z",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    matchScore: 84,
  },
  {
    id: "opp-103",
    title: "Applied AI Research Fellow",
    companyName: "University Robotics & AI Laboratory",
    classification: "OFFICIAL_EMPLOYER" as const,
    type: "CONTRACT" as const,
    workplaceType: "ON_SITE" as const,
    location: "Campus Innovation Pavilion",
    salaryRange: "$45k - $55k / yr",
    deadline: "2026-11-15T18:00:00.000Z",
    skills: ["PyTorch", "Computer Vision", "Reinforcement Learning"],
    matchScore: 78,
  },
];

export default function OpportunitiesPage() {
  return (
    <ListingTemplate
      title="Opportunities &amp; Career Openings"
      subtitle="Exclusively available to verified students and alumni. All submissions reviewed for institutional integrity."
      primaryAction={
        <Link
          href="/opportunities/post"
          className={buttonVariants({ variant: "default", size: "default" })}
        >
          <Plus className="size-4 mr-1.5" />
          <span>Post Opportunity</span>
        </Link>
      }
      searchFilterBar={
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, skill, or employer..."
              className="pl-9 bg-card"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="ALL">
              <SelectTrigger className="w-[160px] bg-card">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="INTERNSHIP">Internships</SelectItem>
                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                <SelectItem value="PART_TIME">Part Time</SelectItem>
                <SelectItem value="CONTRACT">Contract / Research</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="ALL_SOURCES">
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_SOURCES">All Postings</SelectItem>
                <SelectItem value="OFFICIAL_EMPLOYER">Official Employer</SelectItem>
                <SelectItem value="COMMUNITY_SHARED">Community Shared</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      activeFiltersBar={
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          <Badge variant="secondary" className="gap-1 text-xs">
            <span>Status: Active</span>
          </Badge>
          <Badge variant="secondary" className="gap-1 text-xs">
            <span>Verified Campus Affiliation</span>
          </Badge>
          <button className="text-xs text-primary hover:underline ml-2">
            Clear all
          </button>
        </div>
      }
      pagination={
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
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
      }
    >
      <div className="space-y-4">
        {SAMPLE_OPPORTUNITIES.map((opp) => (
          <JobCard key={opp.id} {...opp} />
        ))}
      </div>
    </ListingTemplate>
  );
}
