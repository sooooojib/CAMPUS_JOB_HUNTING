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
} from "lucide-react";
import { toast } from "sonner";
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
    existingOpportunity ? existingOpportunity.openToAllDepartments : true
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
      companyId: existingOpportunity?.companyId || (managedCompanies[0]?.id ?? undefined),
      companyName:
        existingOpportunity?.companyName || managedCompanies[0]?.name || "",
      companyLogo: existingOpportunity?.companyLogo || "",
      type: existingOpportunity?.type || "FULL_TIME",
      sourceType:
        existingOpportunity?.sourceType ||
        (managedCompanies.length > 0 ? "OFFICIAL_EMPLOYER" : "COMMUNITY_SHARED"),
      minCgpa: existingOpportunity?.minCgpa ?? null,
      minAcademicYear: existingOpportunity?.minAcademicYear || "",
      requiredSkills: existingOpportunity?.requiredSkills || [],
      targetDepartments: existingOpportunity?.targetDepartments || [],
      openToAllDepartments:
        existingOpportunity !== undefined
          ? existingOpportunity.openToAllDepartments
          : true,
      salaryOrStipend: existingOpportunity?.salaryOrStipend || "",
      location: existingOpportunity?.location || "Dhaka, Bangladesh",
      workplaceType: existingOpportunity?.workplaceType || "ON_SITE",
      applicationMethod: existingOpportunity?.applicationMethod || "INTERNAL",
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

      const assignedStatus = submitForReview ? "PENDING" : "DRAFT";
      setSubmittedStatus(assignedStatus);

      if (submitForReview) {
        toast.success("Opportunity submitted for institutional verification!");
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
            {submittedStatus === "PENDING"
              ? "Opportunity Submitted for Review"
              : "Draft Opportunity Saved"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {submittedStatus === "PENDING"
              ? "Your opportunity has been queued for institutional review by University Career Services. You will receive notification once accredited."
              : "Your opportunity has been saved as a draft. You can revise it and submit it for institutional review anytime."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground">Status:</span>
          <Badge
            variant={submittedStatus === "PENDING" ? "warning" : "secondary"}
            className="uppercase font-mono"
          >
            {submittedStatus}
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
      {/* Tab Switcher: Edit Form vs Live Preview */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={activeTab === "form" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("form")}
            className="gap-1.5 text-xs font-semibold"
          >
            <Edit3 className="size-3.5" />
            <span>Edit Information</span>
          </Button>

          <Button
            type="button"
            variant={activeTab === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("preview")}
            className="gap-1.5 text-xs font-semibold"
          >
            <Eye className="size-3.5" />
            <span>Interactive Live Preview</span>
          </Button>
        </div>

        <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
          {watchedValues.sourceType === "OFFICIAL_EMPLOYER"
            ? "Official Employer Mode"
            : "Community Shared Mode"}
        </span>
      </div>

      {activeTab === "preview" ? (
        /* ========================================================= */
        /* LIVE PREVIEW MODE                                        */
        /* ========================================================= */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs text-primary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <span>
                <strong>Live Preview:</strong> This is how your opportunity card and details will appear to members in the catalog.
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setActiveTab("form")}
            >
              Back to Editing
            </Button>
          </div>

          <div className="max-w-2xl mx-auto">
            <JobCard
              id="preview-id"
              title={watchedValues.title || "Untitled Opportunity Position"}
              companyName={watchedValues.companyName || "Company Name"}
              companyLogo={watchedValues.companyLogo}
              location={watchedValues.location || "Location"}
              workplaceType={watchedValues.workplaceType || "ON_SITE"}
              type={watchedValues.type || "FULL_TIME"}
              classification={watchedValues.sourceType || "OFFICIAL_EMPLOYER"}
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
        /* EDIT FORM MODE                                           */
        /* ========================================================= */
        <form className="space-y-8">
          {/* Section 1: Classification & Origin */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold border-b border-border/50 pb-2 flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <span>1. Opportunity Provenance &amp; Authority</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sourceType">Posting Authority Mode *</Label>
                <Select
                  value={watchedValues.sourceType}
                  onValueChange={(val: any) => handleSourceTypeChange(val)}
                >
                  <SelectTrigger id="sourceType" className="bg-background">
                    <SelectValue placeholder="Select posting authority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OFFICIAL_EMPLOYER">
                      Official Employer Listing (Authorized Representative)
                    </SelectItem>
                    <SelectItem value="COMMUNITY_SHARED">
                      Community Shared Lead (Alumni / Student Referral)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  {watchedValues.sourceType === "OFFICIAL_EMPLOYER"
                    ? "Official postings represent your registered corporate entity directly."
                    : "Community shared leads display a referral intermediary disclaimer."}
                </p>
              </div>

              {/* Company Selection or Text Input */}
              {watchedValues.sourceType === "OFFICIAL_EMPLOYER" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="companyId">Represented Corporate Entity *</Label>
                  {managedCompanies.length > 0 ? (
                    <Select
                      value={watchedValues.companyId}
                      onValueChange={(val) => {
                        if (val) handleCompanySelect(val);
                      }}
                    >
                      <SelectTrigger id="companyId" className="bg-background">
                        <SelectValue placeholder="Select company entity" />
                      </SelectTrigger>
                      <SelectContent>
                        {managedCompanies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-xs text-amber-600 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                      You do not currently manage an institutional company entity. Please switch to &quot;Community Shared Lead&quot; or create a company profile first.
                    </div>
                  )}
                  {errors.companyId && (
                    <p className="text-xs text-destructive">{errors.companyId.message}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Target Employer / Organization *</Label>
                  <Input
                    id="companyName"
                    {...register("companyName")}
                    placeholder="e.g. BRAC Bank, Google, Unilever"
                    className="bg-background"
                  />
                  {errors.companyName && (
                    <p className="text-xs text-destructive">{errors.companyName.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Position Specifications */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold border-b border-border/50 pb-2 flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <span>2. Position Specifications</span>
            </h3>

            <div className="space-y-1.5">
              <Label htmlFor="title">Opportunity Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g. Distributed Systems Software Intern (Fall 2026)"
                className="bg-background text-sm font-semibold"
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="type">Opportunity Type *</Label>
                <Select
                  value={watchedValues.type}
                  onValueChange={(val: any) => setValue("type", val)}
                >
                  <SelectTrigger id="type" className="bg-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="FULL_TIME">Full-Time Career</SelectItem>
                    <SelectItem value="PART_TIME">Part-Time Student Role</SelectItem>
                    <SelectItem value="CONTRACT">Contract / Fellowship</SelectItem>
                    <SelectItem value="OTHER">Other Opportunity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="workplaceType">Workplace Mode *</Label>
                <Select
                  value={watchedValues.workplaceType}
                  onValueChange={(val: any) => setValue("workplaceType", val)}
                >
                  <SelectTrigger id="workplaceType" className="bg-background">
                    <SelectValue placeholder="Select workplace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ON_SITE">On-Site</SelectItem>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location">Work Location *</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g. Gulshan, Dhaka or Remote"
                  className="bg-background"
                />
                {errors.location && (
                  <p className="text-xs text-destructive">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="salaryOrStipend">Salary / Monthly Stipend</Label>
                <Input
                  id="salaryOrStipend"
                  {...register("salaryOrStipend")}
                  placeholder="e.g. BDT 35,000 / month or $55/hr"
                  className="bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deadline">Application Cutoff Deadline *</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  {...register("deadline")}
                  className="bg-background font-mono text-xs"
                />
                {errors.deadline && (
                  <p className="text-xs text-destructive">{errors.deadline.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Detailed Description &amp; Responsibilities *</Label>
              <Textarea
                id="description"
                rows={6}
                {...register("description")}
                placeholder="Provide a comprehensive description of the role, daily responsibilities, qualifications, and learning outcomes (minimum 20 characters)..."
                className="bg-background leading-relaxed text-xs sm:text-sm"
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Section 3: Academic Eligibility & Skills */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold border-b border-border/50 pb-2 flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span>3. Target Disciplines &amp; Skills</span>
            </h3>

            {/* Department Targeting */}
            <div className="space-y-3 bg-muted/30 p-4 rounded-2xl border border-border/60">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="openToAll"
                  checked={openToAll}
                  onCheckedChange={(c) => handleOpenToAllToggle(!!c)}
                />
                <Label htmlFor="openToAll" className="text-xs font-bold cursor-pointer">
                  Open to All Academic Departments &amp; Faculties
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
                          className={`flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border/60 hover:bg-muted"
                          }`}
                        >
                          <Checkbox checked={isChecked} />
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
                <Label htmlFor="minCgpa">Minimum CGPA Cutoff (0.00 – 4.00 scale)</Label>
                <Input
                  id="minCgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  {...register("minCgpa", { valueAsNumber: true })}
                  placeholder="e.g. 3.25 (Leave empty if no cutoff)"
                  className="bg-background font-mono text-xs"
                />
                {errors.minCgpa && (
                  <p className="text-xs text-destructive">{errors.minCgpa.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="minAcademicYear">Eligible Academic Standing</Label>
                <Input
                  id="minAcademicYear"
                  {...register("minAcademicYear")}
                  placeholder="e.g. 3rd Year, Graduating Senior, Alumni"
                  className="bg-background text-xs"
                />
              </div>
            </div>

            {/* Required Skills Tag Selector */}
            <div className="space-y-2">
              <Label htmlFor="skillInput">Required Skills &amp; Competencies</Label>
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
                  placeholder="Type a skill and press Enter (e.g. Go, Java, Docker, Figma)..."
                  className="bg-background text-xs"
                />
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="size-4 mr-1" />
                  <span>Add</span>
                </Button>
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Application Routing */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold border-b border-border/50 pb-2 flex items-center gap-2">
              <ExternalLink className="size-4 text-primary" />
              <span>4. Application Routing &amp; Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="applicationMethod">Application Handling Mode *</Label>
                <Select
                  value={watchedValues.applicationMethod}
                  onValueChange={(val: any) => setValue("applicationMethod", val)}
                >
                  <SelectTrigger id="applicationMethod" className="bg-background">
                    <SelectValue placeholder="Select application method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNAL">
                      Direct Institutional Application (Campus Dossier)
                    </SelectItem>
                    <SelectItem value="EXTERNAL">
                      External Corporate Portal (Link Redirect)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {watchedValues.applicationMethod === "EXTERNAL" && (
                <div className="space-y-1.5">
                  <Label htmlFor="externalUrl">External Application URL *</Label>
                  <Input
                    id="externalUrl"
                    {...register("externalUrl")}
                    placeholder="https://company.com/careers/apply/..."
                    className="bg-background text-xs"
                  />
                  {errors.externalUrl && (
                    <p className="text-xs text-destructive">{errors.externalUrl.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="contactEmail">Inquiry Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register("contactEmail")}
                  placeholder="recruiter@company.com"
                  className="bg-background text-xs"
                />
                {errors.contactEmail && (
                  <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleSubmit((data: CreateOpportunityInput) => onSubmit(data, false))}
            >
              Save as Draft
            </Button>

            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit((data: CreateOpportunityInput) => onSubmit(data, true))}
              className="gap-2"
            >
              <ShieldCheck className="size-4" />
              <span>{isSubmitting ? "Submitting..." : "Submit for Institutional Verification"}</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
