"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Calendar,
  ExternalLink,
  Plus,
  Trash2,
  Clock,
  MapPin,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { ManualApplicationItem } from "@/types";

const MANUAL_STATUS_COLORS: Record<string, string> = {
  APPLIED: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  INTERVIEWING: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  OFFERED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  REJECTED: "bg-rose-500/10 text-rose-600 border-rose-500/30",
};

export function ManualApplicationsView() {
  const [items, setItems] = useState<ManualApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<"APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED">("APPLIED");
  const [notes, setNotes] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications/manual");
      if (res.ok) {
        const data = await res.json();
        setItems(data.manualApplications || []);
      }
    } catch (err) {
      console.error("Failed to load manual applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) {
      toast.error("Company name and role title are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          roleTitle: roleTitle.trim(),
          location: location.trim() || undefined,
          jobUrl: jobUrl.trim() || undefined,
          appliedDate,
          status,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to log external application.");
      }

      const data = await res.json();
      setItems((prev) => [data.manualApplication, ...prev]);
      setIsDialogOpen(false);
      resetForm();
      toast.success("External application logged successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to log application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/manual/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus as any } : item
          )
        );
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this logged application?")) return;
    try {
      const res = await fetch(`/api/applications/manual/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Logged application deleted.");
      }
    } catch {
      toast.error("Failed to delete application.");
    }
  };

  const resetForm = () => {
    setCompanyName("");
    setRoleTitle("");
    setLocation("");
    setJobUrl("");
    setStatus("APPLIED");
    setNotes("");
    setAppliedDate(new Date().toISOString().split("T")[0]);
  };

  const filteredItems = items.filter((item) =>
    statusFilter === "ALL" ? true : item.status === statusFilter
  );

  return (
    <div className="space-y-4">
      {/* Top Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {["ALL", "APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{st === "ALL" ? "All Manual" : st}</span>
              <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                ({st === "ALL" ? items.length : items.filter((i) => i.status === st).length})
              </span>
            </button>
          ))}
        </div>

        <Button
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="gap-1.5 text-xs self-start sm:self-auto shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Log External Application</span>
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
          <Loader2 className="size-8 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Loading your manually tracked applications...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center space-y-3">
          <FileText className="size-10 text-muted-foreground/60 mx-auto" />
          <h4 className="text-sm font-bold text-foreground">No External Applications Logged</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Applied to jobs on LinkedIn, Company Career Portals, or via direct email? Track them all here in one centralized dashboard.
          </p>
          <Button size="sm" onClick={() => setIsDialogOpen(true)} className="gap-1.5 text-xs">
            <Plus className="size-3.5" />
            <span>Log Your First Application</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[300px]">Role &amp; Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status Stage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/60">
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {item.roleTitle}
                        </span>
                        {item.jobUrl && (
                          <a
                            href={item.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="size-3 text-muted-foreground" />
                        <span>{item.companyName}</span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-muted-foreground/80 italic line-clamp-1 pt-0.5">
                          &quot;{item.notes}&quot;
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3 text-muted-foreground" />
                      <span>{item.location || "Not specified"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3 text-muted-foreground" />
                      <span>
                        {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                          new Date(item.appliedDate)
                        )}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Select
                      value={item.status}
                      onValueChange={(val) => {
                        if (val) handleUpdateStatus(item.id, val);
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs w-[140px]">
                        <SelectValue>
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase font-mono py-0 px-1.5 ${
                              MANUAL_STATUS_COLORS[item.status] || ""
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="text-xs">
                        <SelectItem value="APPLIED">APPLIED</SelectItem>
                        <SelectItem value="INTERVIEWING">INTERVIEWING</SelectItem>
                        <SelectItem value="OFFERED">OFFERED</SelectItem>
                        <SelectItem value="REJECTED">REJECTED</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Log Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Log External Job Application</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Keep track of applications you submitted outside the campus platform.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <Label htmlFor="companyName" className="text-xs">Company Name *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google, Brain Station 23, ShopUp"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="roleTitle" className="text-xs">Position / Role Title *</Label>
              <Input
                id="roleTitle"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Junior Software Engineer, Data Analyst Intern"
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="location" className="text-xs">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhaka (Remote)"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="appliedDate" className="text-xs">Application Date</Label>
                <Input
                  id="appliedDate"
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="jobUrl" className="text-xs">External Link / URL</Label>
                <Input
                  id="jobUrl"
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://..."
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="status" className="text-xs">Current Stage</Label>
                <Select
                  value={status}
                  onValueChange={(val: any) => setStatus(val)}
                >
                  <SelectTrigger id="status" className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="APPLIED">Applied</SelectItem>
                    <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                    <SelectItem value="OFFERED">Offered</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes" className="text-xs">Personal Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes on interview rounds, contacts, referral sources, etc."
                className="text-xs min-h-[60px]"
                maxLength={500}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs gap-1.5">
                {isSubmitting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-3.5" />
                )}
                <span>Save to Tracker</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
