import { AdminTemplate } from "@/components/templates/admin-template";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "Admin Command & Moderation",
  description: "Institutional governance, opportunity verification, and membership approval queues.",
};

const PENDING_OPPORTUNITIES = [
  {
    id: "pend-1",
    title: "Full Stack Engineer (New Grad)",
    company: "Acme Fintech Solutions",
    poster: "David Vance (External Connection)",
    type: "FULL_TIME",
    dateSubmitted: "2026-10-30",
    classification: "COMMUNITY_SHARED",
  },
  {
    id: "pend-2",
    title: "Quantum Computing Research Intern",
    company: "Northwest Quantum Labs",
    poster: "Dr. Karen Bell (Faculty)",
    type: "INTERNSHIP",
    dateSubmitted: "2026-10-29",
    classification: "OFFICIAL_EMPLOYER",
  },
];

const PENDING_MEMBERS = [
  {
    id: "mem-pend-1",
    name: "Alex Zhao",
    email: "alex.zhao@alum.university.edu",
    type: "ALUMNI",
    institutionClaim: "Class of 2021, B.S. ECE",
    dateRequested: "2026-10-30",
  },
  {
    id: "mem-pend-2",
    name: "Rachel Moore",
    email: "rmoore@enterprise-talent.com",
    type: "EMPLOYER",
    institutionClaim: "Verified Partner • Microsoft Recruiting",
    dateRequested: "2026-10-29",
  },
];

export default function AdminPage() {
  return (
    <AdminTemplate
      title="Governance &amp; Moderation Center"
      subtitle="University career services staff control room. Review pending member identities, approve opportunities, and resolve flagged reports."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Admin Session: Verified
          </Badge>
        </div>
      }
      statPills={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 dark:border-amber-900/60 dark:bg-amber-950/30">
            <div className="text-xs text-amber-900 dark:text-amber-300 font-medium">Pending Postings</div>
            <div className="text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">2</div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">Requires staff review</div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/30">
            <div className="text-xs text-blue-900 dark:text-blue-300 font-medium">Pending Members</div>
            <div className="text-2xl font-bold text-blue-950 dark:text-blue-100 mt-1">2</div>
            <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">Alumni &amp; Employer verifications</div>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50/50 p-3.5 dark:border-red-900/60 dark:bg-red-950/30">
            <div className="text-xs text-red-900 dark:text-red-300 font-medium">Flagged Reports</div>
            <div className="text-2xl font-bold text-red-950 dark:text-red-100 mt-1">0</div>
            <div className="text-[10px] text-red-700 dark:text-red-400 mt-0.5">All flags resolved</div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <div className="text-xs text-emerald-900 dark:text-emerald-300 font-medium">Platform Health</div>
            <div className="text-2xl font-bold text-emerald-950 dark:text-emerald-100 mt-1">100%</div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">Vault services operational</div>
          </div>
        </div>
      }
    >
      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="opportunities" className="text-xs">
            Opportunity Review Queue (2)
          </TabsTrigger>
          <TabsTrigger value="members" className="text-xs">
            Member Verification (2)
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">
            Audit Trail
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Opportunities Queue */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[300px]">Opportunity &amp; Company</TableHead>
                  <TableHead>Submitting Member</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Decision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PENDING_OPPORTUNITIES.map((opp) => (
                  <TableRow key={opp.id}>
                    <TableCell>
                      <div className="font-bold text-foreground text-sm">{opp.title}</div>
                      <div className="text-xs text-muted-foreground">{opp.company} • {opp.type}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {opp.poster}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {opp.classification}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {opp.dateSubmitted}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="default" className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-8 text-destructive hover:bg-destructive/10">
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 2: Members Queue */}
        <TabsContent value="members" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">Applicant Name</TableHead>
                  <TableHead>Requested Membership</TableHead>
                  <TableHead>Institutional Affiliation Claim</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Verification Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PENDING_MEMBERS.map((mem) => (
                  <TableRow key={mem.id}>
                    <TableCell>
                      <div className="font-bold text-foreground text-sm">{mem.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{mem.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {mem.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {mem.institutionClaim}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {mem.dateRequested}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="default" className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700">
                          Verify Member
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-8">
                          Request Info
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 3: Audit Trail */}
        <TabsContent value="audit" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-xs space-y-3 font-mono text-muted-foreground">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span>[2026-10-30 20:14:02] ADMIN_LOGIN: admin@university.edu from campus subnet</span>
              <span className="text-emerald-500">SUCCESS</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span>[2026-10-30 19:40:11] OPPORTUNITY_PUBLISHED: opp-101 (Google Cloud SWE Intern) approved by admin</span>
              <span className="text-blue-500">AUDIT_OK</span>
            </div>
            <div className="flex items-center justify-between">
              <span>[2026-10-30 18:22:45] REGISTRAR_SYNC: 1,420 student active enrollments synchronized</span>
              <span className="text-emerald-500">SYNC_COMPLETE</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminTemplate>
  );
}
