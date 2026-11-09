import * as React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/login?signout=true");
  }

  // Fetch real-time user record from database
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      membershipType: true,
      systemRole: true,
      verificationStatus: true,
      accountStatus: true,
      canPostOpportunities: true,
      canReviewApplicants: true,
      emailVerified: true,
    },
  });

  if (!dbUser) {
    redirect("/login?signout=true");
  }

  // Account status security gate
  if (dbUser.accountStatus === "SUSPENDED" || dbUser.accountStatus === "DEACTIVATED") {
    redirect("/login?error=account_suspended");
  }

  return (
    <AuthenticatedShell
      user={{
        name: dbUser.name || session.user.name,
        email: dbUser.email || session.user.email,
        avatarUrl: dbUser.image ?? session.user.image ?? undefined,
        membershipType: dbUser.membershipType || "STUDENT",
        systemRole: dbUser.systemRole || "MEMBER",
        isVerified: dbUser.verificationStatus === "VERIFIED",
        emailVerified: dbUser.emailVerified ?? session.user.emailVerified,
        canPostOpportunities: dbUser.canPostOpportunities || dbUser.systemRole === "ADMIN",
        canReviewApplicants: dbUser.canReviewApplicants || dbUser.systemRole === "ADMIN",
      }}
    >
      {children}
    </AuthenticatedShell>
  );
}
