"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ResubmitVerificationModalProps {
  membershipType: string;
  previousRejectionReason?: string | null;
  triggerText?: string;
}

export function ResubmitVerificationModal({
  membershipType,
  previousRejectionReason,
  triggerText = "Resubmit Verification",
}: ResubmitVerificationModalProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    institutionalId: "",
    department: "",
    academicYear: "",
    graduationYear: "",
    organization: "",
    designation: "",
    workEmail: "",
    connectionNote: "",
    proofDetails: "",
    proofDocumentUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        membershipType,
        institutionalId: formData.institutionalId.trim() || undefined,
        department: formData.department.trim() || undefined,
        academicYear: formData.academicYear.trim() || undefined,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear, 10) : undefined,
        organization: formData.organization.trim() || undefined,
        designation: formData.designation.trim() || undefined,
        workEmail: formData.workEmail.trim() || undefined,
        connectionNote: formData.connectionNote.trim() || undefined,
        proofDetails: formData.proofDetails.trim() || undefined,
        proofDocumentUrl: formData.proofDocumentUrl.trim() || undefined,
      };

      const res = await fetch("/api/verification/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to submit verification dossier.");
      }

      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 h-8 text-xs bg-primary hover:bg-primary/90 cursor-pointer"
      >
        <ShieldAlert className="size-3.5" />
        <span>{triggerText}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Institutional Verification Resubmission</DialogTitle>
          <DialogDescription>
            Provide updated credentials to substantiate your {(membershipType || "member").toLowerCase().replace("_", " ")} identity.
          </DialogDescription>
        </DialogHeader>

        {previousRejectionReason && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1">
            <span className="font-semibold">Reviewer Rejection Notice:</span>
            <p>{previousRejectionReason}</p>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="institutionalId" className="text-xs font-semibold">
                {membershipType === "STUDENT"
                  ? "Student ID"
                  : membershipType === "ALUMNI"
                  ? "Student/Alum ID (if known)"
                  : "Institutional / Employee ID"}
              </Label>
              <Input
                id="institutionalId"
                name="institutionalId"
                value={formData.institutionalId}
                onChange={handleChange}
                placeholder="e.g. STU-2023-8819"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-xs font-semibold">Department / Faculty</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. CSE / Business Studies"
                className="text-xs"
              />
            </div>
          </div>

          {(membershipType === "EMPLOYER" || membershipType === "EXTERNAL_CONNECTION") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="organization" className="text-xs font-semibold">Company / Firm</Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g. Microsoft / bKash"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="designation" className="text-xs font-semibold">Title / Position</Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Campus Talent Lead"
                  className="text-xs"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="workEmail" className="text-xs font-semibold">Official Work / Campus Email</Label>
              <Input
                id="workEmail"
                name="workEmail"
                type="email"
                value={formData.workEmail}
                onChange={handleChange}
                placeholder="official@domain.edu"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="graduationYear" className="text-xs font-semibold">Graduation / Intake Year</Label>
              <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="2024"
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proofDetails" className="text-xs font-semibold">
              Evidence Details / Connection Proof
            </Label>
            <Textarea
              id="proofDetails"
              name="proofDetails"
              value={formData.proofDetails}
              onChange={handleChange}
              placeholder="State enrollment batch, thesis advisor, department verification link, or institutional referral details..."
              rows={3}
              className="text-xs"
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="text-xs gap-1.5">
              {loading && <Loader2 className="size-3.5 animate-spin" />}
              <span>Submit for Verification</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
