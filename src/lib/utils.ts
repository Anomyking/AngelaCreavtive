import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format KES price */
export function formatPrice(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

/** Calculate discount percentage */
export function discountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

