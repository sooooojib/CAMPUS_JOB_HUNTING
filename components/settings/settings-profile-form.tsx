"use client";

import * as React from "react";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SettingsProfileFormProps {
  user: {
    name: string;
    email: string;
    membershipType: string;
    headline?: string | null;
    bio?: string | null;
    department?: string | null;
    company?: string | null;
    designation?: string | null;
    graduationYear?: number | null;
    showEmail?: boolean;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
  };
}

export function SettingsProfileForm({ user }: SettingsProfileFormProps) {
  const [name, setName] = React.useState(user.name);
  const [headline, setHeadline] = React.useState(user.headline || "");
  const [bio, setBio] = React.useState(user.bio || "");
  const [department, setDepartment] = React.useState(user.department || "");
  const [company, setCompany] = React.useState(user.company || "");
  const [designation, setDesignation] = React.useState(user.designation || "");
  const [showEmail, setShowEmail] = React.useState(user.showEmail ?? false);
  const [linkedinUrl, setLinkedinUrl] = React.useState(user.linkedinUrl || "");
  const [githubUrl, setGithubUrl] = React.useState(user.githubUrl || "");

  const [isSaving, setIsSaving] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isStudent = user.membershipType === "STUDENT";
  const isEmployer = user.membershipType === "EMPLOYER" || user.membershipType === "EXTERNAL_CONNECTION";
  const isAlumni = user.membershipType === "ALUMNI";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          headline: headline.trim() || undefined,
          bio: bio.trim() || undefined,
          department: department.trim() || undefined,
          company: company.trim() || undefined,
          designation: designation.trim() || undefined,
          showEmail,
          linkedinUrl: linkedinUrl.trim() || undefined,
          githubUrl: githubUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: "Profile settings updated and synced with campus directory successfully.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || "Failed to update profile settings. Please verify inputs.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Network error. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-medium animate-in fade-in duration-200 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30"
              : "bg-destructive/10 text-destructive border-destructive/30"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="size-4 shrink-0 text-destructive" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Profile Information Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
          1. Profile &amp; Role Identity ({(user.membershipType || "MEMBER").replace("_", " ")})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full legal name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Verified Institutional Email</Label>
            <Input id="email" value={user.email} disabled className="bg-muted/50" />
            <p className="text-[11px] text-muted-foreground">
              Institutional email verified via university registrar credentials.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="headline">Professional Headline</Label>
          <Input
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder={
              isStudent
                ? "e.g. Undergraduate in Computer Science • Cloud Systems Focus"
                : isEmployer
                ? "e.g. Senior Talent Lead at Acme Corp"
                : "e.g. University Alumni • Software Engineer"
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isEmployer && (
            <div className="space-y-1.5">
              <Label htmlFor="department">Academic Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
              />
            </div>
          )}

          {(isEmployer || isAlumni) && (
            <div className="space-y-1.5">
              <Label htmlFor="company">Company / Organization</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Vercel, Microsoft"
              />
            </div>
          )}

          {(isEmployer || isAlumni) && (
            <div className="space-y-1.5">
              <Label htmlFor="designation">Job Title / Designation</Label>
              <Input
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Lead Frontend Engineer"
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">About Me &amp; Professional Statement</Label>
          <Textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Introduce your background, research interests, career goals, or hiring focus."
          />
        </div>
      </section>

      {/* Links & Socials */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
          2. Professional Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
            <Input
              id="linkedinUrl"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="githubUrl">GitHub / Portfolio URL</Label>
            <Input
              id="githubUrl"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
        </div>
      </section>

      {/* Directory & Privacy */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
          3. Directory &amp; Privacy Preferences
        </h3>

        <div className="space-y-3">
          <div className="flex items-start space-x-2.5">
            <Checkbox
              id="showEmail"
              checked={showEmail}
              onCheckedChange={(checked) => setShowEmail(Boolean(checked))}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor="showEmail" className="text-sm font-semibold cursor-pointer">
                Display verified email address to fellow members
              </Label>
              <p className="text-xs text-muted-foreground">
                Allows students and alumni in the member directory to reach out via your university email.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <Checkbox id="privateVault" defaultChecked disabled className="mt-0.5" />
            <div>
              <Label htmlFor="privateVault" className="text-sm font-semibold">
                Enforce Time-Limited Signed URLs for Resumes (Permanent Rule)
              </Label>
              <p className="text-xs text-muted-foreground">
                Mandatory platform security standard. Resumes are never accessible via persistent public links.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-2">
        <Button type="submit" disabled={isSaving} className="gap-2 cursor-pointer">
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSaving ? "Saving Changes..." : "Save Profile Details"}</span>
        </Button>
      </div>
    </form>
  );
}

