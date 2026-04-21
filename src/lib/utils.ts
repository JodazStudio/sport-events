import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string into an object with day, month, and year
 * optimized for Spanish display in event cards.
 */
export function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleDateString("es-MX", { month: "short" }).toUpperCase().replace(".", "");
    const year = d.getFullYear();
    return { day, month, year };
  } catch (e) {
    return { day: "??", month: "???", year: "????" };
  }
}

