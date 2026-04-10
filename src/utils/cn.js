import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ── CN UTILITY ──
 * Safely merges Tailwind classes, resolving conflicts using tailwind-merge.
 * Use this in every component that accepts a className prop.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
