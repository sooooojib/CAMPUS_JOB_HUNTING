/**
 * Canonical List of University Departments for Jagannath University & Campus Community
 */
export const UNIVERSITY_DEPARTMENTS = [
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
] as const;

export type UniversityDepartment = (typeof UNIVERSITY_DEPARTMENTS)[number];

