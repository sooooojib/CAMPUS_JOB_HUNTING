"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Eye,
  Edit3,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Info,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  createOpportunitySchema,
  CreateOpportunityInput,
} from "@/lib/validations/opportunity";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobCard } from "@/components/opportunities/job-card";
import { EmployerBadge } from "@/components/opportunities/employer-badge";

const CANONICAL_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Software Engineering",
  "Electrical & Electronic Engineering",
  "Mathematics",
  "Statistics",
  "Physics",
  "Chemistry",
  "Finance & Banking",
  "Marketing",
  "Accounting & Information Systems",
  "Management Studies",
  "English Language & Literature",
  "Law & Justice",
  "Economics",
  "Pharmacy",
  "Microbiology",
];

interface CompanyOption {
  id: string;
  name: string;
  logo?: string | null;
  location?: string | null;
}

interface OpportunityFormProps {
  canPost: boolean;
  userMembershipType: string;
  managedCompanies: CompanyOption[];
  existingOpportunity?: any;
  editId?: string;
}

export function OpportunityForm({
  canPost,
  userMembershipType,
  managedCompanies,
  existingOpportunity,
  editId: propEditId,
}: OpportunityFormProps) {
  const router = useRouter();
  const editId = propEditId || existingOpportunity?.id;

  const [activeTab, setActiveTab] = React.useState<"form" | "preview">("form");
  const [skillInput, setSkillInput] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>(
    existingOpportunity?.requiredSkills || []
  );
  const [targetDepartments, setTargetDepartments] = React.useState<string[]>(
    existingOpportunity?.targetDepartments || []
  );
  const [openToAll, setOpenToAll] = React.useState<boolean>(
    existingOpportunity?.openToAllDepartments ?? true
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedStatus, setSubmittedStatus] = React.useState<string | null>(null);

  // Default deadline: 30 days ahead formatted as YYYY-MM-DDTHH:mm
  const defaultDeadline = React.useMemo(() => {
    if (existingOpportunity?.deadline) {
      return new Date(existingOpportunity.deadline).toISOString().slice(0, 16);
    }
    const d = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  }, [existingOpportunity]);

  const form = useForm<CreateOpportunityInput>({
    resolver: zodResolver(createOpportunitySchema),
    defaultValues: {
      title: existingOpportunity?.title || "",
      description: existingOpportunity?.description || "",
      companyId: existingOpportunity?.companyId || undefined,
      companyName: existingOpportunity?.companyName || "",
      companyLogo: existingOpportunity?.companyLogo || "",
      type: existingOpportunity?.type || "FULL_TIME",
      sourceType: existingOpportunity?.sourceType || "COMMUNITY_SHARED",
      minCgpa: existingOpportunity?.minCgpa ?? null,
      minAcademicYear: existingOpportunity?.minAcademicYear || "",
      requiredSkills: existingOpportunity?.requiredSkills || [],
      targetDepartments: existingOpportunity?.targetDepartments || [],
      openToAllDepartments: existingOpportunity?.openToAllDepartments ?? true,
      salaryOrStipend: existingOpportunity?.salaryOrStipend || "",
      location: existingOpportunity?.location || "Dhaka, Bangladesh",
      workplaceType: existingOpportunity?.workplaceType || "ON_SITE",
      applicationMethod: "EXTERNAL",
      externalUrl: existingOpportunity?.externalUrl || "",
      contactEmail: existingOpportunity?.contactEmail || "",
      deadline: defaultDeadline,
      submitForReview: true,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const watchedValues = watch();

  // Keep skill and department state synced with form values
  const addSkill = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const nextSkills = [...skills, trimmed];
      setSkills(nextSkills);
      setValue("requiredSkills", nextSkills);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const nextSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(nextSkills);
    setValue("requiredSkills", nextSkills);
  };

  const toggleDepartment = (dept: string) => {
    let nextDepts: string[];
    if (targetDepartments.includes(dept)) {
      nextDepts = targetDepartments.filter((d) => d !== dept);
    } else {
      nextDepts = [...targetDepartments, dept];
    }
    setTargetDepartments(nextDepts);
    setValue("targetDepartments", nextDepts);
  };

  const handleOpenToAllToggle = (checked: boolean) => {
    setOpenToAll(checked);
    setValue("openToAllDepartments", checked);
    if (checked) {
      setTargetDepartments([]);
      setValue("targetDepartments", []);
    }
  };

  const handleSourceTypeChange = (sourceType: "OFFICIAL_EMPLOYER" | "COMMUNITY_SHARED") => {
    setValue("sourceType", sourceType);
    if (sourceType === "OFFICIAL_EMPLOYER" && managedCompanies.length > 0) {
      setValue("companyId", managedCompanies[0].id);
      setValue("companyName", managedCompanies[0].name);
    } else if (sourceType === "COMMUNITY_SHARED") {
      setValue("companyId", undefined);
    }
  };

  const handleCompanySelect = (companyId: string) => {
    const selected = managedCompanies.find((c) => c.id === companyId);
    if (selected) {
      setValue("companyId", selected.id);
      setValue("companyName", selected.name);
      setValue("companyLogo", selected.logo || "");
      if (selected.location) {
        setValue("location", selected.location);
      }
    }
  };

  const onSubmit = async (data: CreateOpportunityInput, submitForReview: boolean) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        requiredSkills: skills,
        targetDepartments: openToAll ? [] : targetDepartments,
        openToAllDepartments: openToAll,
        submitForReview,
      };

      const url = editId
        ? `/api/opportunities/${editId}`
        : `/api/opportunities`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || json.message || "Failed to save opportunity.");
      }

      const assignedStatus = submitForReview ? "APPROVED" : "DRAFT";
      setSubmittedStatus(assignedStatus);

      if (submitForReview) {
        toast.success("Opportunity published and live!");
      } else {
        toast.success("Opportunity saved as Draft!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit opportunity");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user cannot post: Show informative warning banner
  if (!canPost) {
    return (
      <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-8 sm:p-10 text-center space-y-4">
        <div className="size-16 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="size-9" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-foreground">
            Institutional Verification Required
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            To maintain zero recruitment fraud and preserve university community trust, opportunity publishing is restricted to verified campus recruiters, partner employers, faculty, and authorized alumni.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/onboarding"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <span>Complete Profile Verification</span>
            <ArrowRight className="size-4 ml-1.5" />
          </Link>
          <Link
            href="/opportunities"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <span>Browse Active Openings</span>
          </Link>
        </div>
      </div>
    );
  }

  // If submission completed: Show confirmation screen
  if (submittedStatus) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 text-center space-y-5 max-w-2xl mx-auto shadow-sm animate-in fade-in duration-300">
        <div className="size-16 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            {submittedStatus === "APPROVED"
              ? "Opportunity Published & Live"
              : "Draft Opportunity Saved"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {submittedStatus === "APPROVED"
              ? "Your opportunity is now live on the university opportunity board for students to explore and apply directly."
              : "Your opportunity has been saved as a draft. You can revise it and publish it anytime."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground">Status:</span>
          <Badge
            variant={submittedStatus === "APPROVED" ? "default" : "secondary"}
            className="uppercase font-mono"
          >
            {submittedStatus === "APPROVED" ? "LIVE" : submittedStatus}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/opportunities/my"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <span>Track in My Postings</span>
            <ArrowRight className="size-4 ml-1.5" />
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmittedStatus(null);
              form.reset();
              setSkills([]);
              setTargetDepartments([]);
              setOpenToAll(true);
            }}
          >
            Publish Another Opening
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Switcher: Edit Opening vs Live Preview */}
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="inline-flex items-center p-1 bg-muted/60 rounded-full border border-border/40">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              activeTab === "form"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Edit3 className="size-3.5" />
            <span>Edit Opening</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              activeTab === "preview"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="size-3.5" />
            <span>Live Card Preview</span>
          </button>
        </div>
      </div>

      {activeTab === "preview" ? (
        /* ========================================================= */
        /* LIVE PREVIEW MODE                                        */
        /* ========================================================= */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-primary flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-4 shrink-0" />
              <span>
                <strong>Live Card Preview:</strong> This is how your opportunity card will appear to members in the directory.
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setActiveTab("form")}
              className="rounded-full shrink-0"
            >
              Back to Edit
            </Button>
          </div>

          <div className="max-w-2xl mx-auto">
            <JobCard
              id="preview-id"
              title={watchedValues.title || "Untitled Opportunity Position"}
              companyName={watchedValues.companyName || "Hiring Organization"}
              companyLogo={watchedValues.companyLogo}
              location={watchedValues.location || "Dhaka, Bangladesh"}
              workplaceType={watchedValues.workplaceType || "ON_SITE"}
              type={watchedValues.type || "FULL_TIME"}
              classification={watchedValues.sourceType || "COMMUNITY_SHARED"}
              salaryRange={watchedValues.salaryOrStipend || undefined}
              deadline={watchedValues.deadline}
              skills={skills}
              targetDepartments={targetDepartments}
              openToAllDepartments={openToAll}
              minCgpa={watchedValues.minCgpa || undefined}
            />
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* EDIT FORM MODE (HUMAN-FRIENDLY & EASY)                   */
        /* ========================================================= */
        <form className="space-y-6">
          {/* Card 1: Role & Company Details */}
          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border/50">
              <div className="size-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Building2 className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Role &amp; Company Details</h3>
                <p className="text-xs text-muted-foreground">
                  Basic information about the role, organization, and responsibilities.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="companyName" className="text-xs font-semibold">
                  Company or Organization *
                </Label>
                <Input
                  id="companyName"
                  {...register("companyName")}
                  placeholder="e.g. Google, BRAC Bank, Pathao, Unilever"
                  className="rounded-xl bg-background text-xs"
                />
                {errors.companyName && (
                  <p className="text-xs text-destructive">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="title" className="text-xs font-semibold">
                  Job or Internship Title *
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g. Software Engineering Intern, Junior Product Designer"
                  className="rounded-xl bg-background text-xs font-semibold"
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs font-semibold">
                  Employment Type *
                </Label>
                <Select
                  value={watchedValues.type}
                  onValueChange={(val: any) => setValue("type", val)}
                >
                  <SelectTrigger id="type" className="rounded-xl bg-background text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="FULL_TIME">Full-Time Career</SelectItem>
                    <SelectItem value="PART_TIME">Part-Time Role</SelectItem>
                    <SelectItem value="CONTRACT">Contract / Fellowship</SelectItem>
                    <SelectItem value="OTHER">Other Opportunity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="workplaceType" className="text-xs font-semibold">
                  Workplace Setting *
                </Label>
                <Select
                  value={watchedValues.workplaceType}
                  onValueChange={(val: any) => setValue("workplaceType", val)}
                >
                  <SelectTrigger id="workplaceType" className="rounded-xl bg-background text-xs">
                    <SelectValue placeholder="Select workplace" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="ON_SITE">On-Site</SelectItem>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-semibold">
                  Work Location *
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g. Gulshan, Dhaka or Remote"
                  className="rounded-xl bg-background text-xs"
                />
                {errors.location && (
                  <p className="text-xs text-destructive">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="salaryOrStipend" className="text-xs font-semibold">
                  Salary / Monthly Stipend (Optional)
                </Label>
                <Input
                  id="salaryOrStipend"
                  {...register("salaryOrStipend")}
                  placeholder="e.g. BDT 35,000 / month, Competitive, or Unpaid"
                  className="rounded-xl bg-background text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deadline" className="text-xs font-semibold">
                  Application Deadline *
                </Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  {...register("deadline")}
                  className="rounded-xl bg-background font-mono text-xs"
                />
                {errors.deadline && (
                  <p className="text-xs text-destructive">{errors.deadline.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                Role Description &amp; Responsibilities *
              </Label>
              <Textarea
                id="description"
                rows={5}
                {...register("description")}
                placeholder="Share key responsibilities, team environment, qualifications, and learning outcomes for candidates..."
                className="rounded-xl bg-background leading-relaxed text-xs sm:text-sm"
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Card 2: Candidate Preferences & Skills */}
          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border/50">
              <div className="size-9 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Candidate Preferences &amp; Skills</h3>
                <p className="text-xs text-muted-foreground">
                  Specify academic background, minimum CGPA, and key skills you're looking for.
                </p>
              </div>
            </div>

            {/* Department Targeting */}
            <div className="space-y-3 bg-muted/30 p-4 rounded-2xl border border-border/50">
              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="openToAll"
                  checked={openToAll}
                  onCheckedChange={(c) => handleOpenToAllToggle(!!c)}
                  className="rounded-md"
                />
                <Label htmlFor="openToAll" className="text-xs font-bold cursor-pointer text-foreground">
                  Open to students from all academic departments &amp; faculties
                </Label>
              </div>

              {!openToAll && (
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground">
                    Select Target Departments:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                    {CANONICAL_DEPARTMENTS.map((dept) => {
                      const isChecked = targetDepartments.includes(dept);
                      return (
                        <div
                          key={dept}
                          onClick={() => toggleDepartment(dept)}
                          className={`flex items-center space-x-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border/60 hover:bg-muted"
                          }`}
                        >
                          <Checkbox checked={isChecked} className="rounded-md" />
                          <span className="truncate">{dept}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CGPA & Academic Standing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="minCgpa" className="text-xs font-semibold">
                  Minimum CGPA (Optional)
                </Label>
                <Input
                  id="minCgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  {...register("minCgpa", { valueAsNumber: true })}
                  placeholder="e.g. 3.25 (leave blank if no cutoff)"
                  className="rounded-xl bg-background font-mono text-xs"
                />
                {errors.minCgpa && (
                  <p className="text-xs text-destructive">{errors.minCgpa.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="minAcademicYear" className="text-xs font-semibold">
                  Target Academic Standing (Optional)
                </Label>
                <Input
                  id="minAcademicYear"
                  {...register("minAcademicYear")}
                  placeholder="e.g. 3rd Year, Graduating Senior, or Recent Alumni"
                  className="rounded-xl bg-background text-xs"
                />
              </div>
            </div>

            {/* Required Skills Tag Selector */}
            <div className="space-y-2">
              <Label htmlFor="skillInput" className="text-xs font-semibold">
                Key Skills &amp; Competencies
              </Label>
              <div className="flex gap-2">
                <Input
                  id="skillInput"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Type a skill and press Enter (e.g. React, Python, Figma, SQL)..."
                  className="rounded-xl bg-background text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSkill}
                  className="rounded-xl shrink-0"
                >
                  <Plus className="size-4 mr-1" />
                  <span>Add</span>
                </Button>
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border/50"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Application Link & Inquiries */}
          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border/50">
              <div className="size-9 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <ExternalLink className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Application Link &amp; Contact</h3>
                <p className="text-xs text-muted-foreground">
                  Where candidates should apply and an optional contact for questions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="externalUrl" className="text-xs font-semibold">
                  Job Application Website URL *
                </Label>
                <Input
                  id="externalUrl"
                  {...register("externalUrl")}
                  placeholder="https://company.com/careers/apply/..."
                  className="rounded-xl bg-background text-xs"
                />
                {errors.externalUrl && (
                  <p className="text-xs text-destructive">{errors.externalUrl.message}</p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Direct careers portal link for students to submit their application.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactEmail" className="text-xs font-semibold">
                  Alumni Referral or Inquiry Email (Optional)
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register("contactEmail")}
                  placeholder="alumni@company.com"
                  className="rounded-xl bg-background text-xs"
                />
                {errors.contactEmail && (
                  <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Optional email if you're open to candidate inquiries or referrals.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleSubmit((data: CreateOpportunityInput) => onSubmit(data, false))}
              className="rounded-full px-5 w-full sm:w-auto"
            >
              Save as Draft
            </Button>

            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit((data: CreateOpportunityInput) => onSubmit(data, true))}
              className="rounded-full px-6 gap-2 w-full sm:w-auto font-semibold shadow-xs"
            >
              <Send className="size-4" />
              <span>{isSubmitting ? "Submitting..." : "Submit Opportunity"}</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
