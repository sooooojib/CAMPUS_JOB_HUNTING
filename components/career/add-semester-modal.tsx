"use client";

import * as React from "react";
import { Plus, GraduationCap, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
        <div className="flex flex-col items-start gap-1">
          <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-8 ring-primary/5 mb-2">
            <GraduationCap className="size-5.5 stroke-[2.2]" />
          </div>
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Add Semester Academic Record
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Track your semester results and credit hours. Your overall CGPA will update automatically.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Semester / Term Name
            </label>
            <Input
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g. Spring 2025, Fall 2024, or 4th Semester"
              required
              className="text-xs rounded-xl h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Semester GPA (0.00 – 4.00)
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
                className="text-xs rounded-xl h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                placeholder="e.g. 15.0 or 3.0"
                required
                className="text-xs rounded-xl h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Academic Standing (Optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => (
                <button
                  type="button"
                  key={yr}
                  onClick={() => setAcademicYear(yr)}
                  className={`py-1.5 px-2 text-xs rounded-xl font-medium border transition-all cursor-pointer ${
                    academicYear === yr
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/30 hover:bg-muted/60 text-muted-foreground border-border/80"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Coursework &amp; Honors (Optional)
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dean's Honor Roll, Algorithms, Operating Systems"
              className="text-xs rounded-xl h-10"
            />
          </div>

          <div className="rounded-2xl bg-muted/40 p-3.5 flex items-start gap-2.5 text-xs text-muted-foreground border border-border/70">
            <AlertCircle className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Your academic records are private to your account. Your overall CGPA recalculates automatically based on credit-weighted term grades.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl text-xs font-medium px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="rounded-xl text-xs font-semibold px-4 gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="size-4" />
              <span>{loading ? "Saving..." : "Save Record"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

