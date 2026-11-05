import { prisma } from "@/lib/prisma";
import {
  EligibilityCheckResult,
  EligibilityStatus,
  MatchScoreExplanation,
  OpportunityRecommendation,
  SkillGapAnalysisResult,
  SkillCategory,
} from "@/types";

export const MATCH_DISCLAIMER =
  "Skill match score reflects algorithmic overlap between your verified profile skills and the job's required competencies. A high match score does not guarantee academic eligibility, interview shortlisting, or employment offer.";

/**
 * Curated, verified university learning resources for in-demand skills
 */
export const VERIFIED_LEARNING_RESOURCES = [
  {
    skillName: "TypeScript",
    title: "Official TypeScript Handbook & Language Guide",
    provider: "Microsoft / TypeScript Documentation",
    url: "https://www.typescriptlang.org/docs/",
  },
  {
    skillName: "React",
    title: "React Official Documentation: Thinking in React",
    provider: "React Foundation",
    url: "https://react.dev/learn",
  },
  {
    skillName: "Next.js",
    title: "Next.js App Router Official Architecture Course",
    provider: "Vercel Next.js Academy",
    url: "https://nextjs.org/learn",
  },
  {
    skillName: "Python",
    title: "Python for Everybody Specialization",
    provider: "University of Michigan (Coursera / Free Track)",
    url: "https://www.py4e.com/",
  },
  {
    skillName: "PostgreSQL",
    title: "PostgreSQL Official Tutorial & SQL Fundamentals",
    provider: "PostgreSQL Global Development Group",
    url: "https://www.postgresql.org/docs/current/tutorial.html",
  },
  {
    skillName: "Docker",
    title: "Docker Getting Started Guide & Container Labs",
    provider: "Docker Community",
    url: "https://docs.docker.com/get-started/",
  },
  {
    skillName: "Machine Learning",
    title: "Machine Learning Specialization",
    provider: "DeepLearning.AI & Stanford University",
    url: "https://www.coursera.org/specializations/machine-learning-introduction",
  },
  {
    skillName: "Go",
    title: "A Tour of Go: Concurrency & Idiomatic Design",
    provider: "Go Language Team",
    url: "https://go.dev/tour/",
  },
  {
    skillName: "AWS",
    title: "AWS Cloud Practitioner Essentials",
    provider: "AWS Skill Builder University Track",
    url: "https://explore.skillbuilder.aws/",
  },
];

/**
 * Calculates algorithmic skill match percentage:
 * Match Percentage = Matched Required Skills / Total Required Skills * 100
 *
 * COLOR CODING RULE:
 * - 80% or higher: green
 * - 50% - 79%: yellow
 * - Below 50%: red
 */
export function calculateSkillMatch(
  candidateSkills: string[],
  requiredSkills: string[]
): {
  matchPercentage: number;
  scoreColor: "green" | "yellow" | "red";
  matchedSkills: string[];
  missingSkills: string[];
} {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      scoreColor: "green",
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const normalizedCandidate = new Set(
    candidateSkills.map((s) => s.trim().toLowerCase())
  );

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of requiredSkills) {
    const trimmed = req.trim();
    if (normalizedCandidate.has(trimmed.toLowerCase())) {
      matchedSkills.push(trimmed);
    } else {
      missingSkills.push(trimmed);
    }
  }

  const matchPercentage = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  );

  let scoreColor: "green" | "yellow" | "red" = "red";
  if (matchPercentage >= 80) {
    scoreColor = "green";
  } else if (matchPercentage >= 50) {
    scoreColor = "yellow";
  }

  return {
    matchPercentage,
    scoreColor,
    matchedSkills,
    missingSkills,
  };
}

/**
 * Helper to normalize academic year strings or numbers for comparison
 * e.g. "1st Year" = 1, "2nd Year" = 2, "3rd Year" = 3, "4th Year" / "Senior" = 4, Graduate = 5
 */
export function parseAcademicYearLevel(yearStr?: string | number | null): number {
  if (yearStr === null || yearStr === undefined || yearStr === "") return 0;
  if (typeof yearStr === "number") return yearStr;
  const lower = String(yearStr).toLowerCase();
  if (lower.includes("graduate") || lower.includes("master") || lower.includes("phd") || lower.includes("postgrad")) return 5;
  if (lower.includes("4th") || lower.includes("senior") || lower.includes("year 4")) return 4;
  if (lower.includes("3rd") || lower.includes("junior") || lower.includes("year 3")) return 3;
  if (lower.includes("2nd") || lower.includes("sophomore") || lower.includes("year 2")) return 2;
  if (lower.includes("1st") || lower.includes("freshman") || lower.includes("year 1")) return 1;
  // Fallback single digits if present
  if (lower.includes("4")) return 4;
  if (lower.includes("3")) return 3;
  if (lower.includes("2")) return 2;
  if (lower.includes("1")) return 1;
  return 0;
}

/**
 * Evaluates candidate eligibility for a target opportunity.
 * Distinguishes clearly between ELIGIBLE, NOT_ELIGIBLE, and NEEDS_REVIEW.
 */
export function evaluateEligibility(
  studentProfile: {
    currentCgpa?: number | null;
    department?: string | null;
    academicYear?: string | null;
  },
  opportunity: {
    status: string;
    deadline: Date | string;
    minCgpa?: number | null;
    minAcademicYear?: string | null;
    targetDepartments: string[];
    openToAllDepartments: boolean;
  }
): EligibilityCheckResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  const now = new Date();
  const deadlineDate = new Date(opportunity.deadline);
  const deadlineValid = deadlineDate.getTime() > now.getTime();
  const statusApproved = opportunity.status === "APPROVED";

  if (!deadlineValid) {
    warnings.push("Application deadline has passed.");
  }
  if (!statusApproved) {
    warnings.push(`Opportunity is currently ${opportunity.status.toLowerCase()} and not open for applications.`);
  }

  // 1. Department eligibility
  let departmentEligible = true;
  if (!opportunity.openToAllDepartments && opportunity.targetDepartments.length > 0) {
    if (!studentProfile.department) {
      departmentEligible = false;
      warnings.push("Your academic department is not specified in your profile.");
    } else {
      const studentDeptLower = studentProfile.department.trim().toLowerCase();
      const isTargeted = opportunity.targetDepartments.some(
        (td) => td.trim().toLowerCase() === studentDeptLower
      );
      if (isTargeted) {
        reasons.push(`Targeted to your academic department (${studentProfile.department}).`);
      } else {
        departmentEligible = false;
        warnings.push(
          `Opportunity targets ${opportunity.targetDepartments.join(", ")}, but your registered department is ${studentProfile.department}.`
        );
      }
    }
  } else {
    reasons.push("Open to all university academic departments.");
  }

  // 2. CGPA eligibility
  let cgpaEligible = true;
  if (opportunity.minCgpa !== null && opportunity.minCgpa !== undefined && opportunity.minCgpa > 0) {
    if (studentProfile.currentCgpa === null || studentProfile.currentCgpa === undefined) {
      cgpaEligible = false;
      warnings.push(`Minimum CGPA of ${opportunity.minCgpa.toFixed(2)} is required, but your cumulative CGPA has not been recorded in academic tools.`);
    } else if (studentProfile.currentCgpa >= opportunity.minCgpa) {
      reasons.push(`Your cumulative CGPA (${studentProfile.currentCgpa.toFixed(2)}) meets the minimum requirement (${opportunity.minCgpa.toFixed(2)}).`);
    } else {
      cgpaEligible = false;
      warnings.push(`Your cumulative CGPA (${studentProfile.currentCgpa.toFixed(2)}) is below the required minimum (${opportunity.minCgpa.toFixed(2)}).`);
    }
  }

  // 3. Academic Year eligibility
  let academicYearEligible = true;
  if (opportunity.minAcademicYear) {
    const requiredLevel = parseAcademicYearLevel(opportunity.minAcademicYear);
    const studentLevel = parseAcademicYearLevel(studentProfile.academicYear);

    if (studentLevel === 0) {
      academicYearEligible = false;
      warnings.push(`Requires ${opportunity.minAcademicYear} standing, but your academic year standing is not set.`);
    } else if (studentLevel >= requiredLevel) {
      reasons.push(`Your academic standing (${studentProfile.academicYear}) meets the required standing (${opportunity.minAcademicYear}).`);
    } else {
      academicYearEligible = false;
      warnings.push(`Requires ${opportunity.minAcademicYear} standing; your current recorded standing is ${studentProfile.academicYear}.`);
    }
  }

  // Determine overall status
  let status: EligibilityStatus = "ELIGIBLE";
  const canApply = deadlineValid && statusApproved;

  if (!deadlineValid || !statusApproved) {
    status = "NOT_ELIGIBLE";
  } else if (
    (!studentProfile.department && !opportunity.openToAllDepartments && opportunity.targetDepartments.length > 0) ||
    (opportunity.minCgpa && (studentProfile.currentCgpa === null || studentProfile.currentCgpa === undefined)) ||
    (opportunity.minAcademicYear && !studentProfile.academicYear)
  ) {
    status = "NEEDS_REVIEW";
  } else if (!departmentEligible || !cgpaEligible || !academicYearEligible) {
    status = "NOT_ELIGIBLE";
  }

  return {
    status,
    isEligible: status === "ELIGIBLE",
    canApply,
    cgpaEligible,
    departmentEligible,
    academicYearEligible,
    deadlineValid,
    statusApproved,
    studentCgpa: studentProfile.currentCgpa ?? null,
    minRequiredCgpa: opportunity.minCgpa ?? null,
    reasons,
    warnings,
  };
}

/**
 * Retrieves personalized, explainable opportunity recommendations for a student.
 */
export async function getPersonalizedRecommendations(
  studentUserId: string,
  options: {
    limit?: number;
    departmentFilterOnly?: boolean;
  } = {}
): Promise<{
  recommendations: OpportunityRecommendation[];
  disclaimer: string;
}> {
  const { limit = 10, departmentFilterOnly = false } = options;

  const user = await prisma.user.findUnique({
    where: { id: studentUserId },
    include: {
      profile: true,
    },
  });

  if (!user || !user.profile) {
    throw new Error("Student profile not found.");
  }

  const studentSkills = user.profile.skills || [];
  const studentProfile = {
    currentCgpa: user.profile.currentCgpa,
    department: user.profile.department,
    academicYear: user.profile.academicYear,
  };

  // Query approved, active opportunities
  const opportunities = await prisma.opportunity.findMany({
    where: {
      status: "APPROVED",
      deadline: { gt: new Date() },
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const scoredRecommendations: OpportunityRecommendation[] = [];

  for (const opp of opportunities) {
    // If departmentFilterOnly requested, skip non-matching departments
    if (
      departmentFilterOnly &&
      !opp.openToAllDepartments &&
      opp.targetDepartments.length > 0 &&
      user.profile.department
    ) {
      const candidateDept = user.profile.department.toLowerCase();
      const isTargeted = opp.targetDepartments.some(
        (td) => td.toLowerCase() === candidateDept
      );
      if (!isTargeted) continue;
    }

    const matchCalculation = calculateSkillMatch(studentSkills, opp.requiredSkills);
    const eligibility = evaluateEligibility(studentProfile, opp);

    // Formulate transparent reasons for recommendation
    const recommendationReasons: string[] = [];
    if (matchCalculation.matchPercentage >= 80) {
      recommendationReasons.push(`High ${matchCalculation.matchPercentage}% competency alignment with your verified skill stack.`);
    } else if (matchCalculation.matchPercentage >= 50) {
      recommendationReasons.push(`Moderate ${matchCalculation.matchPercentage}% skill overlap; good candidate for cross-skilling.`);
    }

    if (eligibility.departmentEligible && user.profile.department) {
      recommendationReasons.push(`Direct alignment with your ${user.profile.department} curriculum.`);
    }

    if (eligibility.cgpaEligible && opp.minCgpa) {
      recommendationReasons.push("Academic standing exceeds employer's minimum CGPA threshold.");
    }

    const matchExplanation: MatchScoreExplanation = {
      matchPercentage: matchCalculation.matchPercentage,
      scoreColor: matchCalculation.scoreColor,
      matchedSkills: matchCalculation.matchedSkills,
      missingSkills: matchCalculation.missingSkills,
      totalRequiredSkills: opp.requiredSkills.length,
      eligibility,
      recommendationReasons,
    };

    scoredRecommendations.push({
      opportunity: {
        id: opp.id,
        title: opp.title,
        description: opp.description,
        companyName: opp.company?.name || opp.companyName,
        companyLogo: opp.company?.logo || opp.companyLogo,
        type: opp.type,
        location: opp.location,
        workplaceType: opp.workplaceType,
        salaryOrStipend: opp.salaryOrStipend,
        deadline: opp.deadline.toISOString(),
        minCgpa: opp.minCgpa,
        minAcademicYear: opp.minAcademicYear,
        targetDepartments: opp.targetDepartments,
        openToAllDepartments: opp.openToAllDepartments,
        requiredSkills: opp.requiredSkills,
      },
      match: matchExplanation,
    });
  }

  // Sort by match percentage descending, then eligibility status, then deadline
  scoredRecommendations.sort((a, b) => {
    // Prioritize higher skill match
    if (b.match.matchPercentage !== a.match.matchPercentage) {
      return b.match.matchPercentage - a.match.matchPercentage;
    }
    // Then prioritize fully eligible
    if (a.match.eligibility.isEligible !== b.match.eligibility.isEligible) {
      return a.match.eligibility.isEligible ? -1 : 1;
    }
    // Then deadline
    return new Date(a.opportunity.deadline).getTime() - new Date(b.opportunity.deadline).getTime();
  });

  return {
    recommendations: scoredRecommendations.slice(0, limit),
    disclaimer: MATCH_DISCLAIMER,
  };
}

/**
 * Skill Gap Analyzer: Compares student's skills with market demand across active opportunities.
 */
export async function analyzeStudentSkillGaps(studentUserId: string): Promise<SkillGapAnalysisResult> {
  const user = await prisma.user.findUnique({
    where: { id: studentUserId },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    throw new Error("Student profile not found.");
  }

  const studentSkills = user.profile.skills || [];
  const normalizedStudent = new Set(
    studentSkills.map((s) => s.trim().toLowerCase())
  );

  // Fetch all active approved opportunities
  const opportunities = await prisma.opportunity.findMany({
    where: {
      status: "APPROVED",
      deadline: { gt: new Date() },
    },
    select: {
      requiredSkills: true,
      targetDepartments: true,
      openToAllDepartments: true,
    },
  });

  // Calculate market demand counts
  const skillDemandMap = new Map<string, number>();

  for (const opp of opportunities) {
    for (const skill of opp.requiredSkills) {
      const trimmed = skill.trim();
      const current = skillDemandMap.get(trimmed) || 0;
      skillDemandMap.set(trimmed, current + 1);
    }
  }

  // Query controlled skill categories for accurate labeling
  const controlledSkills = await prisma.skill.findMany({
    select: { name: true, category: true },
  });
  const categoryMap = new Map<string, SkillCategory>();
  controlledSkills.forEach((cs) => {
    categoryMap.set(cs.name.toLowerCase(), cs.category as SkillCategory);
  });

  // Top demanded skills overall
  const topDemandedSkills: { name: string; demandCount: number; category: SkillCategory }[] = [];
  const missingSkills: { name: string; demandCount: number; category: SkillCategory }[] = [];

  for (const [name, demandCount] of skillDemandMap.entries()) {
    const category = categoryMap.get(name.toLowerCase()) || "OTHER";
    topDemandedSkills.push({ name, demandCount, category });

    if (!normalizedStudent.has(name.toLowerCase())) {
      missingSkills.push({ name, demandCount, category });
    }
  }

  // Sort by demand count descending
  topDemandedSkills.sort((a, b) => b.demandCount - a.demandCount);
  missingSkills.sort((a, b) => b.demandCount - a.demandCount);

  // Formulate top 5 recommended priorities with clear explanation
  const recommendedPriorities = missingSkills.slice(0, 5).map((ms) => ({
    name: ms.name,
    demandCount: ms.demandCount,
    category: ms.category,
    reason: `Required in ${ms.demandCount} active university opportunities. Mastering this will immediately boost your opportunity eligibility.`,
  }));

  // Curate verified resources matching the student's missing priorities
  const priorityNames = new Set(missingSkills.map((m) => m.name.toLowerCase()));
  const curatedResources = VERIFIED_LEARNING_RESOURCES.filter((res) =>
    priorityNames.has(res.skillName.toLowerCase())
  );

  return {
    studentSkills,
    missingSkills: missingSkills.slice(0, 15),
    topDemandedSkills: topDemandedSkills.slice(0, 15),
    recommendedPriorities,
    curatedResources,
  };
}
