import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canPostOpportunity } from "@/lib/permissions";
import { MyOpportunitiesView } from "@/components/opportunities/my-opportunities-view";

export const metadata = {
  title: "My Opportunities",
  description: "Manage your posted career openings, drafts, and review statuses.",
};

export default async function MyOpportunitiesPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/opportunities/my");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      membershipType: true,
      systemRole: true,
      verificationStatus: true,
      accountStatus: true,
      canPostOpportunities: true,
    },
  });

  // Only authorized members (verified Students, Alumni, Admin) can manage postings
  if (!user || !canPostOpportunity(user)) {
    redirect("/opportunities");
  }

  const isAdmin = user.systemRole === "ADMIN" || user.membershipType === "ADMIN";

  return <MyOpportunitiesView isAdmin={isAdmin} />;
}

