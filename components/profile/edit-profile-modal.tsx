"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Edit3, Loader2 } from "lucide-react";
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

interface EditProfileModalProps {
  initialProfile: {
    name?: string;
    headline?: string | null;
    bio?: string | null;
    department?: string | null;
    academicYear?: string | null;
    graduationYear?: number | null;
    degree?: string | null;
    company?: string | null;
    designation?: string | null;
    skills?: string[];
    interests?: string[];
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    websiteUrl?: string | null;
    phone?: string | null;
    showEmail?: boolean;
    membershipType?: string;
  };
}

export function EditProfileModal({ initialProfile }: EditProfileModalProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    name: initialProfile.name || "",
    headline: initialProfile.headline || "",
    bio: initialProfile.bio || "",
    department: initialProfile.department || "",
    academicYear: initialProfile.academicYear || "",
    graduationYear: initialProfile.graduationYear ? String(initialProfile.graduationYear) : "",
    degree: initialProfile.degree || "",
    company: initialProfile.company || "",
    designation: initialProfile.designation || "",
    skills: (initialProfile.skills || []).join(", "),
    interests: (initialProfile.interests || []).join(", "),
    linkedinUrl: initialProfile.linkedinUrl || "",
    githubUrl: initialProfile.githubUrl || "",
    websiteUrl: initialProfile.websiteUrl || "",
    phone: initialProfile.phone || "",
    showEmail: initialProfile.showEmail || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const interestsArray = formData.interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim() || undefined,
        headline: formData.headline.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        department: formData.department.trim() || undefined,
        academicYear: formData.academicYear.trim() || undefined,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear, 10) : null,
        degree: formData.degree.trim() || undefined,
        company: formData.company.trim() || undefined,
        designation: formData.designation.trim() || undefined,
        skills: skillsArray,
        interests: interestsArray,
        linkedinUrl: formData.linkedinUrl.trim() || undefined,
        githubUrl: formData.githubUrl.trim() || undefined,
        websiteUrl: formData.websiteUrl.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        showEmail: formData.showEmail,
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to update profile.");
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
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 h-8 text-xs cursor-pointer"
      >
        <Edit3 className="size-3.5" />
        <span>Edit Profile</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-start gap-1">
            <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-8 ring-primary/5 mb-2">
              <Edit3 className="size-5.5 stroke-[2.2]" />
            </div>
            <DialogHeader className="gap-1 text-left">
              <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Edit Member Profile
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Update your professional bio, academic background, contact links, and privacy settings.
              </DialogDescription>
            </DialogHeader>
          </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="headline" className="text-xs font-semibold">Headline</Label>
              <Input
                id="headline"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="Software Engineering Student | Cloud Enthusiast"
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-xs font-semibold">Biography</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell other university members about your career aspirations and experience..."
              rows={3}
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-xs font-semibold">Department / Faculty</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Computer Science & Engineering"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="degree" className="text-xs font-semibold">Degree / Program</Label>
              <Input
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="B.Sc. in Software Engineering"
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="academicYear" className="text-xs font-semibold">Academic Year / Standing</Label>
              <Input
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="3rd Year / Junior"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="graduationYear" className="text-xs font-semibold">Graduation Year</Label>
              <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="2027"
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-xs font-semibold">Current Company / Organization</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Google / Tech Corp"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="designation" className="text-xs font-semibold">Designation / Role</Label>
              <Input
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Software Engineering Intern"
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skills" className="text-xs font-semibold">Skills (comma-separated)</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="TypeScript, React, Python, PostgreSQL, Next.js"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="interests" className="text-xs font-semibold">Career Interests (comma-separated)</Label>
            <Input
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="Cloud Architecture, Machine Learning, FinTech"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="linkedinUrl" className="text-xs font-semibold">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="githubUrl" className="text-xs font-semibold">GitHub URL</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="websiteUrl" className="text-xs font-semibold">Portfolio / Website</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://portfolio.dev"
                className="text-xs"
              />
            </div>
          </div>

          {/* Privacy controls */}
          <div className="p-3 rounded-xl border border-border/80 bg-muted/40 space-y-3">
            <div className="font-semibold text-foreground text-xs">Privacy &amp; Security Controls</div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs">Private Contact Phone (Only visible to admin)</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1700 000000"
                className="text-xs bg-background"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="showEmail"
                name="showEmail"
                checked={formData.showEmail}
                onChange={handleCheckboxChange}
                className="rounded border-border text-primary focus:ring-primary size-4"
              />
              <Label htmlFor="showEmail" className="text-xs text-muted-foreground cursor-pointer">
                Display email address publicly to other authenticated community members
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
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
              {loading && <Loader2 className="size-3.5 animate-spin" />}
              <span>Save Changes</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
