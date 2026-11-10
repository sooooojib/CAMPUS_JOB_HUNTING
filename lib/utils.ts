import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Strips raw trailing timestamps or test run IDs (e.g. "1794216539127")
 * and converts artificial test strings into clean, human text.
 */
export function humanizeTitle(text: string | null | undefined): string {
  if (!text) return "";
  let cleaned = text
    .replace(/\b\d{10,14}\b/g, "")
    .replace(/Stage\s+\d+\s+Recruiter/gi, "Campus Recruiter")
    .replace(/Stage\s+\d+\s+Student/gi, "University Student")
    .replace(/Stage\s+\d+\s+Alumni/gi, "University Alumni")
    .replace(/Candidate Student/gi, "Tanvir Ahmed")
    .replace(/Other Student/gi, "Sumiya Akter")
    .replace(/Talent Lead/gi, "Recruitment Lead")
    .replace(/Alumni Lead/gi, "Alumni Mentor")
    .replace(/\s{2,}/g, " ")
    .trim();
  cleaned = cleaned.replace(/[\s_-]+$/, "");
  return cleaned || text.trim();
}
