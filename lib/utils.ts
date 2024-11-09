import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeLeadingZero(num: string) {
  return num.startsWith("0") ? num.slice(1) : num;
}