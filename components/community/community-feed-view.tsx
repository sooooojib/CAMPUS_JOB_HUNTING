"use client";

import * as React from "react";
import {
  MessageSquare,
  Search,
  Sparkles,
  HelpCircle,
  Award,
  Briefcase,
  Bookmark,
  RefreshCw,
  Loader2,
  Filter,
} from "lucide-react";
import { CreatePostBox } from "./create-post-box";
import { FeedPostCard } from "./feed-post-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PostType } from "@/types";
import { cn } from "@/lib/utils";

interface CommunityFeedViewProps {
  currentUser?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    membershipType?: string | null;
  };
  initialPostType?: string;
}

const FEED_TABS: { key: string; label: string; icon: React.ElementType }[] = [
  { key: "ALL", label: "All Feed", icon: MessageSquare },
  { key: "GENERAL_DISCUSSION", label: "Discussions & Q&A", icon: MessageSquare },
  { key: "JOB_ANNOUNCEMENT", label: "Jobs & Internships", icon: Briefcase },
  { key: "REFERRAL_REQUEST", label: "Referrals", icon: Award },
  { key: "ACHIEVEMENT", label: "Achievements", icon: Sparkles },
  { key: "BOOKMARKED", label: "Saved Posts", icon: Bookmark },
];

export function CommunityFeedView({
  currentUser,
  initialPostType = "ALL",
}: CommunityFeedViewProps) {
  const [activeTab, setActiveTab] = React.useState<string>(initialPostType);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const [posts, setPosts] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch feed
  const fetchFeed = React.useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      else setIsRefreshing(true);

      try {
        const params = new URLSearchParams();
        if (activeTab === "BOOKMARKED") {
          params.set("bookmarkedOnly", "true");
        } else if (activeTab !== "ALL") {
          params.set("postType", activeTab);
        }

        if (debouncedSearch.trim()) {
          params.set("search", debouncedSearch.trim());
        }

        params.set("page", page.toString());
        params.set("limit", "10");

        const res = await fetch(`/api/posts?${params.toString()}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setPosts(data.data);
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error("Failed to load community feed:", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [activeTab, debouncedSearch, page]
  );

  React.useEffect(() => {
    fetchFeed(true);
  }, [fetchFeed]);

  function handlePostCreated(newPost: any) {
    // Prepend to current feed if active tab matches or is ALL
    if (activeTab === "ALL" || activeTab === newPost.postType) {
      setPosts((prev) => [newPost, ...prev]);
    }
  }

  function handlePostDeleted(deletedId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  }

  function handlePostUpdated(updated: any) {
    setPosts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post Box */}
      <CreatePostBox
        currentUser={currentUser}
        onPostCreated={handlePostCreated}
      />

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search community discussions, advice, topics, or #tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card text-xs"
            />
          </div>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="xs"
            onClick={() => fetchFeed(false)}
            disabled={isLoading || isRefreshing}
            className="gap-1.5 self-end sm:self-auto"
          >
            <RefreshCw className={cn("size-3.5", isRefreshing && "animate-spin")} />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Category Tabs Scrollbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {FEED_TABS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  setPage(1);
                }}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading Skeletons
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border/80 bg-card p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title={
              activeTab === "BOOKMARKED"
                ? "No saved posts yet"
                : debouncedSearch
                ? "No matching posts found"
                : "No posts in this channel yet"
            }
            description={
              activeTab === "BOOKMARKED"
                ? "Bookmark discussions, career advice, and referral leads to reference them anytime."
                : debouncedSearch
                ? `No posts matched your search for "${debouncedSearch}". Try a different keyword or topic tag.`
                : "Be the first to share career insights, ask questions, or announce campus opportunities."
            }
          />
        ) : (
          posts.map((post) => (
            <FeedPostCard
              key={post.id}
              id={post.id}
              authorId={post.author.id}
              authorName={post.author.name}
              authorAvatar={post.author.image}
              authorMembership={post.author.membershipType}
              authorDepartment={post.author.department}
              authorHeadline={post.author.headline}
              authorVerificationStatus={post.author.verificationStatus}
              title={post.title}
              content={post.content}
              postType={post.postType}
              tags={post.tags}
              createdAt={post.createdAt}
              isPinned={post.isPinned}
              attachedOpportunity={post.attachedOpportunity}
              commentsCount={post.commentsCount}
              initialReactions={post.reactions}
              userReaction={post.userReaction}
              isBookmarked={post.isBookmarked}
              isAuthor={post.isAuthor}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
            />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasPreviousPage) setPage((p) => p - 1);
                  }}
                  className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                    isActive={p === pagination.page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasNextPage) setPage((p) => p + 1);
                  }}
                  className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
