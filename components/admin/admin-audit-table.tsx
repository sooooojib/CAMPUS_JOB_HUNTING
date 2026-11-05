"use client";

import * as React from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminAuditLogItem, AdminAuditAction } from "@/types";

export function AdminAuditTable() {
  const [logs, setLogs] = React.useState<AdminAuditLogItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // Filters
  const [actionFilter, setActionFilter] = React.useState<string>("");
  const [targetTypeFilter, setTargetTypeFilter] = React.useState<string>("");

  // Inspect Details Modal
  const [selectedLog, setSelectedLog] = React.useState<AdminAuditLogItem | null>(null);

  const fetchLogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.set("action", actionFilter);
      if (targetTypeFilter) params.set("targetType", targetTypeFilter);
      params.set("page", String(page));
      params.set("pageSize", "15");

      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.data);
        setTotalCount(json.totalCount);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  }, [actionFilter, targetTypeFilter, page]);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionBadge = (action: AdminAuditAction) => {
    if (action.includes("APPROVED") || action.includes("VERIFIED") || action.includes("RESTORED")) {
      return (
        <Badge className="bg-emerald-600 text-white text-[10px]">
          {action.replace(/_/g, " ")}
        </Badge>
      );
    }
    if (action.includes("REJECTED") || action.includes("SUSPENDED") || action.includes("DELETED") || action.includes("REMOVED")) {
      return (
        <Badge variant="destructive" className="text-[10px]">
          {action.replace(/_/g, " ")}
        </Badge>
      );
    }
    if (action.includes("DISMISSED") || action.includes("CLOSED")) {
      return (
        <Badge variant="secondary" className="text-[10px]">
          {action.replace(/_/g, " ")}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-primary text-[10px]">
        {action.replace(/_/g, " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            Administrative Audit Trail
          </span>
          <span className="text-xs text-muted-foreground">
            (Immutable security event register)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="h-8 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">All Administrative Actions</option>
            <option value="MEMBER_VERIFIED">MEMBER_VERIFIED</option>
            <option value="MEMBER_REJECTED">MEMBER_REJECTED</option>
            <option value="ACCOUNT_SUSPENDED">ACCOUNT_SUSPENDED</option>
            <option value="ACCOUNT_RESTORED">ACCOUNT_RESTORED</option>
            <option value="OPPORTUNITY_APPROVED">OPPORTUNITY_APPROVED</option>
            <option value="OPPORTUNITY_REJECTED">OPPORTUNITY_REJECTED</option>
            <option value="OPPORTUNITY_CLOSED">OPPORTUNITY_CLOSED</option>
            <option value="OPPORTUNITY_DELETED">OPPORTUNITY_DELETED</option>
            <option value="CONTENT_REPORT_RESOLVED">CONTENT_REPORT_RESOLVED</option>
            <option value="CONTENT_REPORT_DISMISSED">CONTENT_REPORT_DISMISSED</option>
            <option value="POST_REMOVED">POST_REMOVED</option>
            <option value="COMMENT_REMOVED">COMMENT_REMOVED</option>
            <option value="COMPANY_VERIFIED">COMPANY_VERIFIED</option>
            <option value="COMPANY_SUSPENDED">COMPANY_SUSPENDED</option>
          </select>

          <select
            value={targetTypeFilter}
            onChange={(e) => {
              setTargetTypeFilter(e.target.value);
              setPage(1);
            }}
            className="h-8 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">All Target Types</option>
            <option value="USER">User / Account</option>
            <option value="OPPORTUNITY">Opportunity</option>
            <option value="REPORT">Content Report</option>
            <option value="POST">Post</option>
            <option value="COMMENT">Comment</option>
            <option value="COMPANY">Company</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-semibold">Timestamp</TableHead>
              <TableHead className="text-xs font-semibold">Administrator</TableHead>
              <TableHead className="text-xs font-semibold">Action</TableHead>
              <TableHead className="text-xs font-semibold">Target Entity</TableHead>
              <TableHead className="text-xs font-semibold">Stated Reason</TableHead>
              <TableHead className="text-xs font-semibold">IP Address</TableHead>
              <TableHead className="text-xs font-semibold text-right">Payload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span className="text-xs">Loading administrative audit records...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ShieldCheck className="size-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">No audit entries found</p>
                    <p className="text-xs">Administrative actions will appear here automatically.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-foreground">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-foreground">{log.adminName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{log.adminEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-foreground">
                        {log.targetLabel || log.targetType}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[140px]" title={log.targetId}>
                        id: {log.targetId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground max-w-[200px] block truncate" title={log.reason || "—"}>
                      {log.reason || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {log.ipAddress || "internal"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedLog(log)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      title="Inspect event payload"
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Total Audit Records: <strong className="text-foreground">{totalCount}</strong> (Page {page} of {totalPages})
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Payload Inspection Modal */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2">
                <FileCode className="size-4 text-primary" />
                <span>Audit Entry Payload: {selectedLog.action}</span>
              </DialogTitle>
              <DialogDescription className="text-xs font-mono">
                Log ID: {selectedLog.id} • {new Date(selectedLog.createdAt).toISOString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/40">
                <div>
                  <span className="text-muted-foreground text-[11px] block">Administrator</span>
                  <span className="font-semibold text-foreground">{selectedLog.adminName}</span>
                  <span className="text-[10px] text-muted-foreground block font-mono">{selectedLog.adminEmail}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">Target Type &amp; Label</span>
                  <span className="font-semibold text-foreground">{selectedLog.targetType}</span>
                  <span className="text-[10px] text-muted-foreground block truncate">{selectedLog.targetLabel || selectedLog.targetId}</span>
                </div>
              </div>

              {selectedLog.reason && (
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-muted-foreground text-[11px] block font-medium">Stated Reason:</span>
                  <p className="mt-1 text-foreground text-xs">{selectedLog.reason}</p>
                </div>
              )}

              {selectedLog.details && (
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block font-medium">Recorded Event Context:</span>
                  <pre className="p-3 rounded-lg bg-muted text-[11px] font-mono overflow-x-auto text-foreground">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
