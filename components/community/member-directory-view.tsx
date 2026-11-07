"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
  Send,
  Sparkles,
  Users,
  Filter,
  X,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConnectionButton, ConnectionState } from "@/components/community/connection-button";
import { MemberDirectoryItem, MembershipType } from "@/types";

export function MemberDirectoryView() {
  const [members, setMembers] = React.useState<MemberDirectoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters state
  const [search, setSearch] = React.useState("");
  const [membershipType, setMembershipType] = React.useState<string>("ALL");
  const [department, setDepartment] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [skill, setSkill] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  // Fetch directory members
  const fetchMembers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (membershipType !== "ALL") params.set("membershipType", membershipType);
      if (department.trim()) params.set("department", department.trim());
      if (company.trim()) params.set("company", company.trim());
      if (skill.trim()) params.set("skill", skill.trim());
      params.set("page", String(page));
      params.set("pageSize", "12");

      const res = await fetch(`/api/members?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to load directory.");
      }

      setMembers(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.totalCount || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load members.");
    } finally {
      setLoading(false);
    }
  }, [search, membershipType, department, company, skill, page]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchMembers]);

  const handleResetFilters = () => {
    setSearch("");
    setMembershipType("ALL");
    setDepartment("");
    setCompany("");
    setSkill("");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    membershipType !== "ALL" ||
    Boolean(department) ||
    Boolean(company) ||
    Boolean(skill);

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Controls */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search directory by name, headline, bio, or role..."
              className="pl-10 bg-card h-10 text-xs sm:text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={membershipType}
              onValueChange={(val) => {
                if (val) setMembershipType(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] bg-card h-10 text-xs">
                <SelectValue placeholder="All Affiliations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="STUDENT">Students</SelectItem>
                <SelectItem value="ALUMNI">Alumni</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
              placeholder="Dept (e.g. CSE)"
              className="w-[130px] bg-card h-10 text-xs"
            />

            <Input
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setPage(1);
              }}
              placeholder="Company"
              className="w-[130px] bg-card h-10 text-xs"
            />

            <Input
              value={skill}
              onChange={(e) => {
                setSkill(e.target.value);
                setPage(1);
              }}
              placeholder="Skill (e.g. Python)"
              className="w-[140px] bg-card h-10 text-xs"
            />

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-10 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5 mr-1" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* Directory Stats Bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{totalCount}</span> verified university members found
          </div>
          {hasActiveFilters && (
            <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              Filters Active
            </span>
          )}
        </div>
      </div>

      {/* Main Grid or Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-4 rounded-xl border border-border bg-card animate-pulse">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-full bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded-md w-3/4" />
                  <div className="h-3 bg-muted rounded-md w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-muted rounded-md w-full" />
              <div className="h-3 bg-muted rounded-md w-2/3" />
              <div className="pt-2 flex justify-between items-center">
                <div className="h-6 bg-muted rounded-md w-20" />
                <div className="h-6 bg-muted rounded-md w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
          <p className="text-sm font-semibold text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchMembers()}>
            Retry Query
          </Button>
        </div>
      ) : members.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Users className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No members match your criteria</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms or clearing some filters to broaden your search within the campus network.
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs mt-2">
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => {
            const isVerified = member.verificationStatus === "VERIFIED";
            const initials = member.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            const isSelf = member.connectionStatus === "SELF";

            return (
              <Card
                key={member.id}
                className="rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between"
              >
                <CardContent className="p-0 space-y-4">
                  {/* Member Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12 border-2 border-background shadow-xs shrink-0">
                        <AvatarImage src={member.image || undefined} alt={member.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/profile/${member.id}`}
                            className="text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {member.name}
                          </Link>
                          {isVerified && (
                            <span title="Registrar-Verified Member">
                              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider mt-0.5">
                          {member.membershipType.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>

                    <ConnectionButton
                      userId={member.id}
                      initialState={(member.connectionStatus as ConnectionState) || "NONE"}
                      connectionId={member.connectionId}
                      size="xs"
                      onStateChange={() => {
                        // Refresh directory state seamlessly
                        fetchMembers();
                      }}
                    />
                  </div>

                  {/* Headline & Bio */}
                  {member.headline ? (
                    <p className="text-xs text-foreground/90 font-medium line-clamp-2">
                      {member.headline}
                    </p>
                  ) : member.bio ? (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {member.bio}
                    </p>
                  ) : null}

                  {/* Context Info (Dept, Graduation Year, Company) */}
                  <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
                    {member.department && (
                      <div className="flex items-center gap-1.5 truncate">
                        <GraduationCap className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">
                          {member.department}
                          {member.graduationYear ? ` ('${String(member.graduationYear).slice(-2)})` : ""}
                        </span>
                      </div>
                    )}
                    {(member.company || member.designation) && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">
                          {member.designation ? `${member.designation} at ` : ""}
                          {member.company || "Enterprise Partner"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills tags */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {member.skills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-foreground/80 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="text-[10px] text-muted-foreground px-1 self-center">
                          +{member.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                    <Link
                      href={`/profile/${member.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="size-3" />
                    </Link>

                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="text-xs"
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground px-2">
            Page <span className="font-semibold text-foreground">{page}</span> of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="text-xs"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
