import * as React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";

export const instant = false;

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
    redirect("/login");
  }

  // Account status security gate
  const user = session.user as any;
  if (user.accountStatus === "SUSPENDED" || user.accountStatus === "DEACTIVATED") {
    redirect("/login?error=account_suspended");
  }

  return (
    <AuthenticatedShell
      user={{
        name: session.user.name,
        email: session.user.email,
        avatarUrl: session.user.image ?? undefined,
        membershipType: user.membershipType || "STUDENT",
        systemRole: user.systemRole || "MEMBER",
        isVerified: user.verificationStatus === "VERIFIED",
        emailVerified: session.user.emailVerified,
      }}
    >
      {children}
    </AuthenticatedShell>
  );
}
