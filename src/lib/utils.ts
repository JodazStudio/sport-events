import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse, isValid } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses an event date string into a Date object.
 * Handles both ISO formats (YYYY-MM-DD) and Spanish formats (DD de mes de YYYY).
 */
export function parseEventDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Try standard ISO parsing
  const date = new Date(dateStr);
  if (isValid(date)) return date;

  // Try Spanish format: "30 de agosto de 2026"
  try {
    // We try to match the pattern "d 'de' MMMM 'de' yyyy"
    const parsedDate = parse(dateStr.toLowerCase(), "d 'de' MMMM 'de' yyyy", new Date(), { locale: es });
    if (isValid(parsedDate)) return parsedDate;
  } catch (e) {
    // If pattern matching fails, try other common formats or return null
  }

  return null;
}

/**
 * Formats a date string into an object with day, month, and year
 * optimized for Spanish display in event cards.
 */
export function formatDate(dateStr: string) {
  const d = parseEventDate(dateStr);
  
  if (!d || !isValid(d)) {
    return { day: "??", month: "???", year: "????" };
  }

  try {
    return {
      day: format(d, "dd"),
      month: format(d, "MMM", { locale: es }).toUpperCase().replace(".", ""),
      year: d.getFullYear()
    };
  } catch (e) {
    return { day: "??", month: "???", year: "????" };
  }
}

