import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CommunityFeedView } from "@/components/community/community-feed-view";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Briefcase, Users } from "lucide-react";

export const metadata = {
  title: "Community Feed & Discussions",
  description: "University career discussions, advice, questions, and peer opportunities.",
};

export default async function CommunityFeedPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  return (
    <DashboardTemplate
      title="University Community Feed & Discussions"
      subtitle="Connect with verified students, alumni, faculty, and industry partners across Jagannath University."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/opportunities/post"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Briefcase className="size-3.5 mr-1.5" />
            <span>Post Opportunity</span>
          </Link>
          <Link
            href="/community"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <Users className="size-3.5 mr-1.5" />
            <span>Member Network</span>
          </Link>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto">
        <CommunityFeedView
          currentUser={
            session?.user
              ? {
                  id: session.user.id,
                  name: session.user.name,
                  avatarUrl: session.user.image,
                  membershipType: session.user.membershipType,
                }
              : undefined
          }
        />
      </div>
    </DashboardTemplate>
  );
}
