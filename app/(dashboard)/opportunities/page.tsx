import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OpportunitiesBrowser } from "@/components/opportunities/opportunities-browser";

export const metadata = {
  title: "Opportunities & Career Openings",
  description: "Browse verified internships, full-time jobs, and research positions.",
};

export default async function OpportunitiesPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  let canPost = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { membershipType: true, systemRole: true, verificationStatus: true },
    });
    // Strictly Alumni and Admin can post opportunities (students cannot post)
    canPost =
      user?.verificationStatus === "VERIFIED" &&
      (user.systemRole === "ADMIN" || user.membershipType === "ALUMNI");
  }

  return <OpportunitiesBrowser canPost={canPost} />;
}
