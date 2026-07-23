import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date to a human-readable string */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Format a date to a short string */
export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Render star rating as a string of filled/empty stars */
export function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
