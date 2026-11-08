import Link from "next/link";
import { headers } from "next/headers";
import { MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListingTemplate } from "@/components/templates/listing-template";
import { MemberDirectoryView } from "@/components/community/member-directory-view";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Member Directory & Campus Network",
  description:
    "Explore the verified university ecosystem across students, alumni, faculty, staff, and enterprise hiring partners.",
};

export default async function CommunityPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  let isAdmin = false;
  let currentAdminId = "";

  if (session?.user?.id) {
    currentAdminId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { systemRole: true, membershipType: true },
    });
    isAdmin = user?.systemRole === "ADMIN" || user?.membershipType === "ADMIN";
  }

  return (
    <ListingTemplate
      title="Member Directory & Campus Network"
      subtitle={
        isAdmin
          ? "Discover, connect, and govern university members, verifications, and account security across the campus network."
          : "Discover and connect with verified members across the university ecosystem."
      }
      primaryAction={
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Badge variant="outline" className="text-xs font-mono gap-1 border-primary/30 text-primary bg-primary/5 mr-1">
              <ShieldCheck className="size-3.5" />
              <span>Admin Management Mode</span>
            </Badge>
          )}
          <Link
            href="/feed"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <MessageSquare className="size-3.5 mr-1.5" />
            <span>Community Feed</span>
            <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </div>
      }
    >
      <MemberDirectoryView isAdmin={isAdmin} currentAdminId={currentAdminId} />
    </ListingTemplate>
  );
}
