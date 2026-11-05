"use client";

import * as React from "react";
import { Plus, GraduationCap, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddSemesterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddSemesterModal({
  open,
  onOpenChange,
  onSuccess,
}: AddSemesterModalProps) {
  const [semester, setSemester] = React.useState("");
  const [gpa, setGpa] = React.useState("");
  const [credits, setCredits] = React.useState("3.0");
  const [academicYear, setAcademicYear] = React.useState("3rd Year");
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const gpaNum = parseFloat(gpa);
    const creditsNum = parseFloat(credits);

    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
      toast.error("Please enter a valid GPA between 0.00 and 4.00.");
      return;
    }

    if (isNaN(creditsNum) || creditsNum <= 0) {
      toast.error("Credits must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/academic/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semester: semester.trim(),
          gpa: gpaNum,
          credits: creditsNum,
          academicYear: academicYear.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to add academic record.");
      }

      toast.success("Semester academic record added and CGPA recalculated!");
      onOpenChange(false);
      setSemester("");
      setGpa("");
      setNotes("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            <span>Add Semester Academic Record</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Log semester GPA and credit hours to automatically compute your official cumulative CGPA for opportunity matching.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Semester / Term Name
            </label>
            <Input
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g. Fall 2024, Spring 2025, Semester 5"
              required
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Semester GPA (0.00 - 4.00)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="3.85"
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Semester Credits
              </label>
              <Input
                type="number"
                step="0.5"
                min="0.5"
                max="30"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="3.0 or 15.0"
                required
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Academic Standing (Optional)
            </label>
            <Input
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 1st Year, 2nd Year, 3rd Year, Senior"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Coursework / Honors Notes (Optional)
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dean's List, Algorithms, Operating Systems"
              className="text-xs"
            />
          </div>

          <div className="rounded-lg bg-muted/60 p-3 flex items-start gap-2 text-xs text-muted-foreground border border-border">
            <AlertCircle className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Semester records remain strictly private. Cumulative CGPA is automatically updated using credit-weighted summation: Sum(GPA * Credits) / Sum(Credits).
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="size-3.5" />
              <span>{loading ? "Saving..." : "Save Record"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

