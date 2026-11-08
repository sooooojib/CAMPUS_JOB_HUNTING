"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  X,
  Plus,
  Briefcase,
  Bookmark,
  Share2,
  SlidersHorizontal,
  Building2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { JobCard } from "@/components/opportunities/job-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { OpportunityType, OpportunityClassification } from "@/types";

interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  companyName: string;
  companyLogo?: string | null;
  type: OpportunityType;
  sourceType: OpportunityClassification;
  location: string;
  workplaceType: "REMOTE" | "HYBRID" | "ON_SITE";
  salaryOrStipend?: string | null;
  deadline: string;
  requiredSkills: string[];
  targetDepartments: string[];
  openToAllDepartments: boolean;
  minCgpa?: number | null;
  minAcademicYear?: string | null;
  poster?: {
    id: string;
    name: string;
    image?: string | null;
    membershipType: string;
  };
  isBookmarked?: boolean;
}

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Software Engineering",
  "Electrical & Electronic Engineering",
  "Mathematics",
  "Statistics",
  "Physics",
  "Chemistry",
  "Finance & Banking",
  "Marketing",
  "Accounting & Information Systems",
  "Management Studies",
  "English Language & Literature",
  "Law & Justice",
  "Economics",
  "Pharmacy",
  "Microbiology",
];

interface OpportunitiesBrowserProps {
  canPost?: boolean;
}

export function OpportunitiesBrowser({ canPost = false }: OpportunitiesBrowserProps) {
  const [opportunities, setOpportunities] = React.useState<OpportunityItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters state
  const [activeTab, setActiveTab] = React.useState<"ALL" | "BOOKMARKED">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL");
  const [workplaceFilter, setWorkplaceFilter] = React.useState<string>("ALL");
  const [sourceTypeFilter, setSourceTypeFilter] = React.useState<string>("ALL");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("ALL");
  const [cgpaFilter, setCgpaFilter] = React.useState<string>("ALL");
  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = React.useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch opportunities whenever filters change
  const fetchOpportunities = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (debouncedQuery.trim()) params.set("query", debouncedQuery.trim());
      if (typeFilter !== "ALL") params.set("type", typeFilter);
      if (workplaceFilter !== "ALL") params.set("workplaceType", workplaceFilter);
      if (sourceTypeFilter !== "ALL") params.set("sourceType", sourceTypeFilter);
      if (departmentFilter !== "ALL") params.set("department", departmentFilter);
      if (cgpaFilter !== "ALL") params.set("maxMinCgpa", cgpaFilter);
      if (activeTab === "BOOKMARKED") params.set("bookmarkedOnly", "true");
      params.set("page", page.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load opportunities");
      }

      const json = await res.json();
      if (json.success) {
        setOpportunities(json.data || []);
        if (json.pagination) {
          setPagination(json.pagination);
        }
      } else {
        throw new Error(json.error || "Failed to load opportunities");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to connect to opportunity directory.");
    } finally {
      setLoading(false);
    }
  }, [
    debouncedQuery,
    typeFilter,
    workplaceFilter,
    sourceTypeFilter,
    departmentFilter,
    cgpaFilter,
    activeTab,
    page,
  ]);

  React.useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Handle bookmark toggle
  const handleBookmarkToggle = async (opportunityId: string) => {
    // Optimistic update
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === opportunityId) {
          const newState = !opp.isBookmarked;
          return { ...opp, isBookmarked: newState };
        }
        return opp;
      })
    );

    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/bookmark`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Bookmark request failed");
      }

      const json = await res.json();
      if (json.success) {
        if (json.data.bookmarked) {
          toast.success("Saved to your bookmarks");
        } else {
          toast.info("Removed from your bookmarks");
          // If currently on bookmarked tab, remove from list
          if (activeTab === "BOOKMARKED") {
            setOpportunities((prev) => prev.filter((o) => o.id !== opportunityId));
            setPagination((p) => ({ ...p, total: Math.max(0, p.total - 1) }));
          }
        }
      } else {
        throw new Error(json.error || "Failed to update bookmark");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not update bookmark");
      // Revert optimistic update
      setOpportunities((prev) =>
        prev.map((opp) => {
          if (opp.id === opportunityId) {
            return { ...opp, isBookmarked: !opp.isBookmarked };
          }
          return opp;
        })
      );
    }
  };

  const hasActiveFilters =
    debouncedQuery !== "" ||
    typeFilter !== "ALL" ||
    workplaceFilter !== "ALL" ||
    sourceTypeFilter !== "ALL" ||
    departmentFilter !== "ALL" ||
    cgpaFilter !== "ALL";

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setTypeFilter("ALL");
    setWorkplaceFilter("ALL");
    setSourceTypeFilter("ALL");
    setDepartmentFilter("ALL");
    setCgpaFilter("ALL");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Career Opportunities &amp; Placements
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Official employer listings and authenticated alumni leads. Direct priority access for Jagannath University members.
          </p>
        </div>

        {canPost && (
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/opportunities/my"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <span>My Postings</span>
            </Link>

            <Link
              href="/opportunities/post"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              <Plus className="size-4 mr-1.5" />
              <span>Post Opportunity</span>
            </Link>
          </div>
        )}
      </div>

      {/* Primary Discovery Tabs: All vs Bookmarked */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        <Button
          variant={activeTab === "ALL" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => {
            setActiveTab("ALL");
            setPage(1);
          }}
          className="gap-2 text-xs font-semibold"
        >
          <Briefcase className="size-3.5" />
          <span>All Opportunities</span>
          {activeTab === "ALL" && (
            <Badge variant="outline" className="text-[10px] ml-1 px-1.5 py-0">
              {pagination.total}
            </Badge>
          )}
        </Button>

        <Button
          variant={activeTab === "BOOKMARKED" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => {
            setActiveTab("BOOKMARKED");
            setPage(1);
          }}
          className="gap-2 text-xs font-semibold"
        >
          <Bookmark className="size-3.5" />
          <span>Bookmarked Positions</span>
          {activeTab === "BOOKMARKED" && (
            <Badge variant="outline" className="text-[10px] ml-1 px-1.5 py-0">
              {pagination.total}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search Bar & Multi-Dimensional Filters */}
      <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-md p-5 sm:p-6 space-y-4 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role title, required skill (e.g. Go, Java, Figma), company name, or location..."
            className="pl-11 pr-11 bg-muted/40 border-border/50 text-sm h-12 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Opportunity Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Role Type
            </label>
            <Select
              value={typeFilter}
              onValueChange={(val) => {
                if (val) {
                  setTypeFilter(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full bg-background h-10 text-xs rounded-xl border-border/60">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="FULL_TIME">Full-Time Career</SelectItem>
                <SelectItem value="PART_TIME">Part-Time Role</SelectItem>
                <SelectItem value="CONTRACT">Contract / Research</SelectItem>
                <SelectItem value="OTHER">Other Opportunity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Workplace Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Workplace
            </label>
            <Select
              value={workplaceFilter}
              onValueChange={(val) => {
                if (val) {
                  setWorkplaceFilter(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full bg-background h-10 text-xs rounded-xl border-border/60">
                <SelectValue placeholder="All Workplaces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Workplaces</SelectItem>
                <SelectItem value="ON_SITE">On-Site</SelectItem>
                <SelectItem value="REMOTE">Remote</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source Classification */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Posting Source
            </label>
            <Select
              value={sourceTypeFilter}
              onValueChange={(val) => {
                if (val) {
                  setSourceTypeFilter(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full bg-background h-10 text-xs rounded-xl border-border/60">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sources</SelectItem>
                <SelectItem value="OFFICIAL_EMPLOYER">Official Employer Direct</SelectItem>
                <SelectItem value="COMMUNITY_SHARED">Community / Alumni Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Academic Department */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Department / Major
            </label>
            <Select
              value={departmentFilter}
              onValueChange={(val) => {
                if (val) {
                  setDepartmentFilter(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full bg-background h-10 text-xs rounded-xl border-border/60">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Departments</SelectItem>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Minimum CGPA Requirement */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Max Min CGPA
            </label>
            <Select
              value={cgpaFilter}
              onValueChange={(val) => {
                if (val) {
                  setCgpaFilter(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full bg-background h-10 text-xs rounded-xl border-border/60">
                <SelectValue placeholder="Any CGPA Requirement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Any CGPA</SelectItem>
                <SelectItem value="3.0">Up to 3.00 CGPA</SelectItem>
                <SelectItem value="3.25">Up to 3.25 CGPA</SelectItem>
                <SelectItem value="3.5">Up to 3.50 CGPA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Reset Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
              <span>Active filters:</span>
              {debouncedQuery && (
                <Badge variant="secondary" className="text-[11px] font-normal gap-1">
                  Query: &quot;{debouncedQuery}&quot;
                </Badge>
              )}
              {typeFilter !== "ALL" && (
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {typeFilter.replace("_", " ")}
                </Badge>
              )}
              {workplaceFilter !== "ALL" && (
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {workplaceFilter}
                </Badge>
              )}
              {sourceTypeFilter !== "ALL" && (
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {sourceTypeFilter === "OFFICIAL_EMPLOYER" ? "Official" : "Community Lead"}
                </Badge>
              )}
              {departmentFilter !== "ALL" && (
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {departmentFilter}
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="xs"
              onClick={resetFilters}
              className="text-destructive hover:bg-destructive/10 text-xs"
            >
              <X className="size-3 mr-1" />
              <span>Reset all filters</span>
            </Button>
          </div>
        )}
      </div>

      {/* Main Opportunity Stream / Skeletons / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 flex-1">
                  <Skeleton className="size-11 rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-24 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="size-8 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
              <div className="pt-3 border-t border-border/40 flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Unable to load opportunities"
          description={error}
          action={
            <Button onClick={() => fetchOpportunities()} variant="outline" size="sm">
              Try again
            </Button>
          }
        />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title={
            activeTab === "BOOKMARKED"
              ? "No saved opportunities"
              : "No matching career opportunities found"
          }
          description={
            activeTab === "BOOKMARKED"
              ? "You haven't bookmarked any opportunities yet. Click the bookmark icon on any opportunity card to save it for quick reference."
              : "Try adjusting your search keywords, role types, or department filters to see more verified opportunities."
          }
          action={
            activeTab === "BOOKMARKED" ? (
              <Button onClick={() => setActiveTab("ALL")} variant="default" size="sm">
                Explore All Opportunities
              </Button>
            ) : hasActiveFilters ? (
              <Button onClick={resetFilters} variant="outline" size="sm">
                Clear all filters
              </Button>
            ) : canPost ? (
              <Link
                href="/opportunities/post"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                <Plus className="size-4 mr-1.5" />
                <span>Post the First Opportunity</span>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp) => (
              <JobCard
                key={opp.id}
                id={opp.id}
                title={opp.title}
                companyName={opp.companyName}
                companyLogo={opp.companyLogo}
                location={opp.location}
                workplaceType={opp.workplaceType}
                type={opp.type}
                classification={opp.sourceType}
                salaryRange={opp.salaryOrStipend || undefined}
                deadline={opp.deadline}
                skills={opp.requiredSkills}
                targetDepartments={opp.targetDepartments}
                openToAllDepartments={opp.openToAllDepartments}
                minCgpa={opp.minCgpa || undefined}
                poster={opp.poster}
                isBookmarked={opp.isBookmarked}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs">
              <span className="text-muted-foreground font-mono">
                Showing {opportunities.length} of {pagination.total} opportunities
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>

                <span className="font-mono text-xs px-2 text-foreground font-semibold">
                  Page {page} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
