import { Search, MessageSquare } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ListingTemplate } from "@/components/templates/listing-template";
import { MemberProfileCard } from "@/components/community/member-profile-card";
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
  title: "Member Directory",
  description: "Explore the verified university network across students, alumni, faculty, and industry partners.",
};

const SAMPLE_MEMBERS = [
  {
    id: "mem-1",
    name: "Sarah Chen",
    membershipType: "ALUMNI" as const,
    headline: "Senior Software Engineer @ Stripe • Alumna '22",
    department: "Computer Science",
    graduationYear: 2022,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    skills: ["Go", "Distributed Systems", "Ruby"],
    isAvailableForMentorship: true,
  },
  {
    id: "mem-2",
    name: "Tanvir Ahmed",
    membershipType: "STUDENT" as const,
    headline: "Junior CS Student • Distributed Systems & Cloud Infrastructure",
    department: "Computer Science",
    graduationYear: 2027,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    skills: ["TypeScript", "Next.js", "Docker"],
    isAvailableForMentorship: true,
  },
  {
    id: "mem-3",
    name: "Dr. Elena Rostova",
    membershipType: "FACULTY" as const,
    headline: "Associate Professor of AI & Robotics • Graduate Advisor",
    department: "Electrical & Computer Engineering",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop",
    skills: ["AI / Robotics", "Research", "PyTorch"],
    isAvailableForMentorship: true,
  },
  {
    id: "mem-4",
    name: "Marcus Reynolds",
    membershipType: "EMPLOYER" as const,
    headline: "University Talent Partner @ Google Cloud",
    department: "Campus Recruiting",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    skills: ["Technical Recruiting", "Internship Programs"],
    isAvailableForMentorship: false,
  },
];

export default function CommunityPage() {
  return (
    <ListingTemplate
      title="Member Directory &amp; Campus Network"
      subtitle="Discover and connect with verified members of the university ecosystem."
      primaryAction={
        <Link
          href="/feed"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <MessageSquare className="size-3.5 mr-1.5" />
          <span>Community Discussions Feed →</span>
        </Link>
      }
      searchFilterBar={
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, department, or skill..."
              className="pl-9 bg-card"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="ALL_ROLES">
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_ROLES">All Roles</SelectItem>
                <SelectItem value="STUDENT">Students</SelectItem>
                <SelectItem value="ALUMNI">Alumni</SelectItem>
                <SelectItem value="FACULTY">Faculty &amp; Staff</SelectItem>
                <SelectItem value="EMPLOYER">Employers &amp; Recruiters</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="ALL_STATUS">
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_STATUS">All Members</SelectItem>
                <SelectItem value="OPEN_REFERRALS">Open to Referrals</SelectItem>
                <SelectItem value="OPEN_MENTOR">Open to Mentoring</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      activeFiltersBar={
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground">Showing:</span>
          <Badge variant="secondary" className="text-xs">
            2,410 Verified Members
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Institutional Registry Confirmed
          </Badge>
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
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_MEMBERS.map((member) => (
          <MemberProfileCard key={member.id} {...member} />
        ))}
      </div>
    </ListingTemplate>
  );
}
