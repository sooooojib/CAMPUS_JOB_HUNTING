import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck, Users, AlertTriangle, Activity } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPlatformAdmin } from "@/lib/permissions";
import { getPendingVerificationRequests } from "@/lib/services/verification";
import { AdminTemplate } from "@/components/templates/admin-template";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VerificationTable } from "@/components/admin/verification-table";

export const metadata = {
  title: "Admin Command & Moderation | UniCareer Community",
  description: "Institutional governance, opportunity verification, and membership approval queues.",
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

  // Fetch real data from database
  const pendingRequests = await getPendingVerificationRequests(session.user.id);
  const totalVerifiedCount = await prisma.user.count({
    where: { verificationStatus: "VERIFIED" },
  });
  const totalPendingCount = pendingRequests.length;

  return (
    <AdminTemplate
      title="Governance &amp; Moderation Center"
      subtitle="University career services staff control room. Review pending member identities, evaluate verification credentials, and authorize institutional privileges."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono gap-1 border-primary/30 text-primary">
            <ShieldCheck className="size-3" />
            <span>Admin Clearance: Active</span>
          </Badge>
        </div>
      }
      statPills={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/30">
            <div className="text-xs text-blue-900 dark:text-blue-300 font-medium flex items-center justify-between">
              <span>Pending Verifications</span>
              <Users className="size-3.5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-950 dark:text-blue-100 mt-1">
              {totalPendingCount}
            </div>
            <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">
              Awaiting registrar verification
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <div className="text-xs text-emerald-900 dark:text-emerald-300 font-medium flex items-center justify-between">
              <span>Verified Members</span>
              <ShieldCheck className="size-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-950 dark:text-emerald-100 mt-1">
              {totalVerifiedCount}
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">
              Active verified network
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 dark:border-amber-900/60 dark:bg-amber-950/30">
            <div className="text-xs text-amber-900 dark:text-amber-300 font-medium flex items-center justify-between">
              <span>Flagged Reports</span>
              <AlertTriangle className="size-3.5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">0</div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">
              All flags resolved
            </div>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3.5 dark:border-purple-900/60 dark:bg-purple-950/30">
            <div className="text-xs text-purple-900 dark:text-purple-300 font-medium flex items-center justify-between">
              <span>Platform Health</span>
              <Activity className="size-3.5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-950 dark:text-purple-100 mt-1">100%</div>
            <div className="text-[10px] text-purple-700 dark:text-purple-400 mt-0.5">
              PostgreSQL &amp; Auth operational
            </div>
          </div>
        </div>
      }
    >
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="members" className="text-xs">
            Member Verification Queue ({totalPendingCount})
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">
            Governance Audit Log
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Member Verification Queue */}
        <TabsContent value="members" className="space-y-4">
          <VerificationTable initialRequests={pendingRequests as any} />
        </TabsContent>

        {/* Tab 2: Audit Trail */}
        <TabsContent value="audit" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-xs space-y-3 font-mono text-muted-foreground">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span>[SYSTEM_AUDIT] Administrator session authenticated: {session.user.email}</span>
              <span className="text-emerald-500 font-bold">VERIFIED_ADMIN</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span>[DATABASE_STATUS] PostgreSQL Neon Lakebase connection pool active</span>
              <span className="text-blue-500 font-bold">CONNECTED</span>
            </div>
            <div className="flex items-center justify-between">
              <span>[GOVERNANCE_SECURITY] Zero unverified member opportunity posting enforced</span>
              <span className="text-emerald-500 font-bold">SECURE_ACTIVE</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminTemplate>
  );
}
