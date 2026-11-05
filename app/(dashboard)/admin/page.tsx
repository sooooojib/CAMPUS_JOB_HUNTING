import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPlatformAdmin } from "@/lib/permissions";
import { getAdminDashboardStats } from "@/lib/services/admin";
import { getPendingVerificationRequests } from "@/lib/services/verification";
import { AdminTemplate } from "@/components/templates/admin-template";
import { Badge } from "@/components/ui/badge";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";

export const metadata = {
  title: "Admin Command & Moderation | UniCareer Community",
  description: "Institutional governance, opportunity verification, member management, and audit log.",
};

export const instant = false;

export default async function AdminPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!isPlatformAdmin(currentUser)) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="p-3 bg-destructive/10 text-destructive rounded-full w-fit mx-auto">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Access Restricted</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The Governance and Moderation Center is strictly reserved for designated university administrators and campus career services staff. Your account does not have platform administration privileges.
        </p>
      </div>
    );
  }

  // Fetch real database records (Zero fabricated statistics)
  const [stats, pendingRequests] = await Promise.all([
    getAdminDashboardStats(),
    getPendingVerificationRequests(session.user.id),
  ]);

  return (
    <AdminTemplate
      title="Governance &amp; Moderation Center"
      subtitle="University career services staff command center. Govern institutional membership, evaluate opportunities, moderate community discussions, and inspect immutable audit trails."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono gap-1 border-primary/30 text-primary bg-primary/5">
            <ShieldCheck className="size-3.5" />
            <span>Admin Clearance: Active</span>
          </Badge>
        </div>
      }
    >
      <AdminDashboardContainer
        stats={stats}
        initialPendingRequests={pendingRequests as any}
        currentAdminId={session.user.id}
      />
    </AdminTemplate>
  );
}
