import { prisma } from "@/lib/prisma";
import { SkillCategory, SkillLevel } from "@/types";
import { AddMemberSkillInput, CreateSkillInput } from "@/lib/validations/skill";

/**
 * Standard seed catalog of university tech, engineering, and business skills
 */
export const DEFAULT_SKILLS = [
  // Programming Languages
  { name: "TypeScript", category: "PROGRAMMING_LANGUAGE" as SkillCategory, description: "Typed JavaScript for scalable application development" },
  { name: "JavaScript", category: "PROGRAMMING_LANGUAGE" as SkillCategory, description: "Core web scripting and asynchronous runtime" },
  { name: "Python", category: "PROGRAMMING_LANGUAGE" as SkillCategory, description: "General-purpose language for scripting, AI, and backend services" },
  { name: "Java", category: "PROGRAMMING_LANGUAGE" as SkillCategory, description: "Enterprise software, Spring Boot, and Android development" },
  { name: "C++", category: "PROGRAMMING_LANGUAGE" as SkillCategory, description: "High-performance systems programming, competitive programming" },
  { name: "C#", category: "PROGRAMMING_LANGUAGE" as SkillCategory, description: ".NET enterprise and game engineering" },
  { name: "Go", category: "PROGRAMMING_LANGUAGE" as SkillCategory, description: "Cloud-native services, concurrency, and microservices" },
  { name: "Rust", category: "PROGRAMMING_LANGUAGE" as SkillCategory, description: "Memory-safe systems programming and low-level tools" },
  { name: "SQL", category: "DATABASE" as SkillCategory, description: "Relational database querying and schema manipulation" },
  // Frameworks & Libraries
  { name: "React", category: "FRAMEWORK" as SkillCategory, description: "Declarative UI component library" },
  { name: "Next.js", category: "FRAMEWORK" as SkillCategory, description: "React full-stack framework with SSR and App Router" },
  { name: "Node.js", category: "FRAMEWORK" as SkillCategory, description: "Server-side JavaScript runtime" },
  { name: "Express", category: "FRAMEWORK" as SkillCategory, description: "Minimalist web framework for Node.js" },
  { name: "Django", category: "FRAMEWORK" as SkillCategory, description: "Batteries-included Python web framework" },
  { name: "Spring Boot", category: "FRAMEWORK" as SkillCategory, description: "Enterprise microservices for Java" },
  // Databases
  { name: "PostgreSQL", category: "DATABASE" as SkillCategory, description: "Advanced open-source relational database" },
  { name: "MySQL", category: "DATABASE" as SkillCategory, description: "Popular relational database management system" },
  { name: "MongoDB", category: "DATABASE" as SkillCategory, description: "Document-oriented NoSQL database" },
  { name: "Redis", category: "DATABASE" as SkillCategory, description: "In-memory key-value data store and cache" },
  // DevOps & Cloud
  { name: "Docker", category: "DEVOPS" as SkillCategory, description: "Application containerization platform" },
  { name: "Kubernetes", category: "DEVOPS" as SkillCategory, description: "Container orchestration and cluster management" },
  { name: "AWS", category: "CLOUD" as SkillCategory, description: "Amazon Web Services cloud computing" },
  { name: "Google Cloud", category: "CLOUD" as SkillCategory, description: "GCP cloud infrastructure and BigQuery" },
  { name: "CI/CD", category: "DEVOPS" as SkillCategory, description: "Continuous integration and automated delivery pipelines" },
  { name: "Git", category: "DEVOPS" as SkillCategory, description: "Distributed version control system" },
  // Data & AI
  { name: "Machine Learning", category: "DATA_AI" as SkillCategory, description: "Predictive algorithms and statistical modeling" },
  { name: "PyTorch", category: "DATA_AI" as SkillCategory, description: "Deep learning framework for neural networks" },
  { name: "TensorFlow", category: "DATA_AI" as SkillCategory, description: "End-to-end open-source machine learning platform" },
  { name: "Pandas", category: "DATA_AI" as SkillCategory, description: "Data analysis and manipulation library for Python" },
  // Design & Soft Skills
  { name: "Figma", category: "DESIGN" as SkillCategory, description: "Collaborative interface and UI/UX design tool" },
  { name: "Agile / Scrum", category: "MANAGEMENT" as SkillCategory, description: "Iterative project delivery methodology" },
  { name: "Technical Communication", category: "SOFT_SKILLS" as SkillCategory, description: "Clear documentation and stakeholder presentation" },
];

/**
 * Seeds initial controlled skills dictionary if empty.
 */
export async function seedInitialSkills() {
  const count = await prisma.skill.count();
  if (count > 0) return;

  for (const skill of DEFAULT_SKILLS) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }
}

/**
 * Normalizes a skill name (trimmed, canonical title casing).
 */
export function normalizeSkillName(name: string): string {
  return name.trim();
}

/**
 * Gets or creates a skill in the controlled dictionary.
 * Prevents duplicate skill entries (case-insensitive check).
 */
export async function getOrCreateSkill(
  name: string,
  category: SkillCategory = "OTHER",
  description?: string | null
) {
  const normalized = normalizeSkillName(name);

  // Case-insensitive search for existing skill
  const existing = await prisma.skill.findFirst({
    where: {
      name: { equals: normalized, mode: "insensitive" },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.skill.create({
    data: {
      name: normalized,
      category,
      description: description || null,
    },
  });
}

/**
 * Retrieves all controlled skills with optional category filter.
 */
export async function getControlledSkills(category?: SkillCategory) {
  return prisma.skill.findMany({
    where: category ? { category } : undefined,
    orderBy: { name: "asc" },
  });
}

/**
 * Associates a skill with a member profile.
 * Prevents duplicate member-skill associations.
 * Syncs the member's profile.skills string array automatically.
 */
export async function addSkillToProfile(userId: string, input: AddMemberSkillInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    throw new Error("Profile not found.");
  }

  const profileId = user.profile.id;
  const skill = await getOrCreateSkill(input.skillName, input.category || "OTHER");

  // Check if already associated
  const existing = await prisma.memberSkill.findUnique({
    where: {
      profileId_skillId: {
        profileId,
        skillId: skill.id,
      },
    },
  });

  if (existing) {
    // Update level if different
    return prisma.memberSkill.update({
      where: { id: existing.id },
      data: { level: input.level as SkillLevel },
      include: { skill: true },
    });
  }

  const created = await prisma.memberSkill.create({
    data: {
      profileId,
      skillId: skill.id,
      level: input.level as SkillLevel,
    },
    include: { skill: true },
  });

  // Keep Profile.skills string array in sync
  const currentSkills = user.profile.skills || [];
  if (!currentSkills.some((s) => s.toLowerCase() === skill.name.toLowerCase())) {
    await prisma.profile.update({
      where: { id: profileId },
      data: {
        skills: [...currentSkills, skill.name],
      },
    });
  }

  return created;
}

/**
 * Removes a skill from a member profile and synchronizes string array.
 */
export async function removeSkillFromProfile(userId: string, skillIdOrMemberSkillId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    throw new Error("Profile not found.");
  }

  const profileId = user.profile.id;

  // Find member skill by id or skillId
  const memberSkill = await prisma.memberSkill.findFirst({
    where: {
      profileId,
      OR: [{ id: skillIdOrMemberSkillId }, { skillId: skillIdOrMemberSkillId }],
    },
    include: { skill: true },
  });

  if (!memberSkill) {
    throw new Error("Skill association not found on your profile.");
  }

  await prisma.memberSkill.delete({
    where: { id: memberSkill.id },
  });

  // Synchronize Profile.skills array
  const updatedSkills = (user.profile.skills || []).filter(
    (s) => s.toLowerCase() !== memberSkill.skill.name.toLowerCase()
  );

  await prisma.profile.update({
    where: { id: profileId },
    data: { skills: updatedSkills },
  });

  return { success: true };
}

/**
 * Retrieves all skills for a member with categories and levels.
 */
export async function getMemberSkills(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          memberSkills: {
            include: { skill: true },
            orderBy: { skill: { name: "asc" } },
          },
        },
      },
    },
  });

  if (!user || !user.profile) {
    return [];
  }

  return user.profile.memberSkills.map((ms) => ({
    id: ms.id,
    skillId: ms.skill.id,
    name: ms.skill.name,
    category: ms.skill.category as any,
    level: ms.level as any,
  }));
}

