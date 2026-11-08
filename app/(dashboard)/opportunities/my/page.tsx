import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
    select: { membershipType: true, systemRole: true },
  });

  // Students cannot post or manage postings; redirect to browse
  if (!user || (user.membershipType === "STUDENT" && user.systemRole !== "ADMIN")) {
    redirect("/opportunities");
  }

  const isAdmin = user.systemRole === "ADMIN" || user.membershipType === "ADMIN";

  return <MyOpportunitiesView isAdmin={isAdmin} />;
}

