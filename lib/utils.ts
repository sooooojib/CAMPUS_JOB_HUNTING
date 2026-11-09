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
 * so titles, usernames, and labels in modals and cards display clean, human text.
 */
export function humanizeTitle(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/[\s_-]+\d{10,14}$/, "").trim();
}
