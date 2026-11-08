import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, MessageSquare, Award, Briefcase, Users, Heart, ArrowRight } from "lucide-react";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "My Contributions | UniCareer",
  description: "Track your community engagement, posts, and university contributions.",
};

export default async function ContributionsPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/contributions");
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { membershipType: true, systemRole: true, name: true },
  });

  const isAlumni = user?.membershipType === "ALUMNI" || user?.systemRole === "ADMIN";

  if (isAlumni) {
    const [jobsPostedCount, referralsCount, feedPostCount, myRecentOpportunities] =
      await Promise.all([
        prisma.opportunity.count({ where: { posterId: userId } }),
        prisma.referralRequest.count({ where: { recipientId: userId } }),
        prisma.post.count({ where: { authorId: userId } }),
        prisma.opportunity.findMany({
          where: { posterId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            companyName: true,
            type: true,
            status: true,
            createdAt: true,
          },
        }),
      ]);

    return (
      <DashboardTemplate
        title="My Contributions"
        subtitle="Track your shared career opportunities, student referrals, and community footprint."
        actions={
          <Link
            href="/opportunities/post"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <Plus className="size-4 mr-1.5" />
            <span>Share Opportunity</span>
          </Link>
        }
        metrics={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                  Jobs Posted
                </span>
                <Briefcase className="size-4 text-primary" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{jobsPostedCount}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                Shared with university network
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                  Referrals Handled
                </span>
                <Users className="size-4 text-blue-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{referralsCount}</div>
              <div className="text-[11px] text-muted-foreground mt-1 font-medium">
                Student referral inquiries supported
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                  Feed Discussions
                </span>
                <MessageSquare className="size-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{feedPostCount}</div>
              <div className="text-[11px] text-muted-foreground mt-1 font-medium">
                Insights &amp; campus advice posted
              </div>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <Card className="rounded-2xl border border-border/70 bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Opportunities You Have Shared</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Job leads and verified alumni openings published for students.
                </p>
              </div>
              <Link
                href="/opportunities/my"
                className={buttonVariants({ variant: "outline", size: "xs" })}
              >
                Manage Postings
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {myRecentOpportunities.length > 0 ? (
                <div className="divide-y divide-border/40 space-y-2">
                  {myRecentOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="pt-3 first:pt-0 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/opportunities/${opp.id}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {opp.title}
                        </Link>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{opp.companyName}</span>
                          <span>•</span>
                          <span className="uppercase text-[10px] font-mono">
                            {opp.type.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          opp.status === "APPROVED"
                            ? "default"
                            : opp.status === "PENDING"
                            ? "warning"
                            : "secondary"
                        }
                        className="text-[10px] uppercase font-mono shrink-0"
                      >
                        {opp.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Briefcase className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">No opportunities shared yet</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Support university students by sharing verified job and internship leads from your company.
                    </p>
                  </div>
                  <Link
                    href="/opportunities/post"
                    className={buttonVariants({ variant: "default", size: "sm" })}
                  >
                    <Plus className="size-4 mr-1.5" />
                    <span>Share First Opportunity</span>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardTemplate>
    );
  }

  // Student Experience
  const [feedPostCount, commentCount, reactionCount, myRecentPosts] = await Promise.all([
    prisma.post.count({ where: { authorId: userId } }),
    prisma.comment.count({ where: { authorId: userId } }),
    prisma.postReaction.count({ where: { userId: userId } }),
    prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        content: true,
        likesCount: true,
        commentsCount: true,
        createdAt: true,
      },
    }),
  ]);

  const totalCommunityEngagement = commentCount + reactionCount;

  return (
    <DashboardTemplate
      title="My Contributions"
      subtitle="Track your campus community activity, feed discussions, and peer engagement."
      actions={
        <Link
          href="/feed"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          <MessageSquare className="size-4 mr-1.5" />
          <span>New Feed Discussion</span>
        </Link>
      }
      metrics={
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                Community Engagement
              </span>
              <Award className="size-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-foreground">
              {totalCommunityEngagement}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
              Comments authored &amp; interactions
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                Feed Posts
              </span>
              <MessageSquare className="size-4 text-blue-500" />
            </div>
            <div className="text-3xl font-extrabold text-foreground">{feedPostCount}</div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
              Discussions &amp; achievements shared
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                Thread Replies
              </span>
              <Heart className="size-4 text-rose-500" />
            </div>
            <div className="text-3xl font-extrabold text-foreground">{commentCount}</div>
            <div className="text-[11px] text-muted-foreground mt-1 font-medium">
              Active contributions to peer threads
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <Card className="rounded-2xl border border-border/70 bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Your Community Feed Posts</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Career questions, discussion threads, and achievements you've published.
              </p>
            </div>
            <Link
              href="/feed"
              className={buttonVariants({ variant: "outline", size: "xs" })}
            >
              Browse Feed
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {myRecentPosts.length > 0 ? (
              <div className="divide-y divide-border/40 space-y-3">
                {myRecentPosts.map((post) => (
                  <div key={post.id} className="pt-3 first:pt-0 space-y-1">
                    <Link
                      href={`/feed?highlight=${post.id}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors block"
                    >
                      {post.title || post.content.slice(0, 60)}
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                    <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-3 pt-1">
                      <span>{post.likesCount} upvotes</span>
                      <span>•</span>
                      <span>{post.commentsCount} comments</span>
                      <span>•</span>
                      <span>
                        {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                          new Date(post.createdAt)
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <MessageSquare className="size-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">No feed discussions yet</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Start a conversation with verified students, faculty, and alumni across the university network.
                  </p>
                </div>
                <Link
                  href="/feed"
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  <Plus className="size-4 mr-1.5" />
                  <span>Start Discussion</span>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  );
}
