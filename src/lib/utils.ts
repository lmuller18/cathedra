import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GRADES = [
  { code: "HG", label: "High Grade" },
  { code: "RG", label: "Real Grade" },
  { code: "MG", label: "Master Grade" },
  { code: "PG", label: "Perfect Grade" },
  { code: "EG", label: "Entry Grade" },
  { code: "SD", label: "Super Deformed" },
  { code: "NG", label: "No Grade" },
] as const;

export function getGradeByCode(code: string) {
  return GRADES.find((g) => g.code === code);
}

export const SERIES = [
  { code: "UC", name: "Universal Century" },
  { code: "G-Witch", name: "Witch from Mercury" },
  { code: "IBO", name: "Iron Blooded Orphans" },
  { code: "Build", name: "Build Fighters/Divers" },
  { code: "Wing", name: "Gundam Wing" },
  { code: "Seed", name: "Gundam Seed" },
  { code: "00", name: "Gundam 00" },
  { code: "Thunderbolt", name: "Gundam Thunderbolt" },
  { code: "G Gundam", name: "G Gundam" },
  { code: "Age", name: "Gundam Age" },
  { code: "F91", name: "Gundam F91" },
  { code: "Other", name: "Other" },
] as const;

export function getSeriesByCode(code: string) {
  return SERIES.find((s) => s.code === code);
}

export const SCALES = [
  { code: "1/144", label: "1/144" },
  { code: "1/100", label: "1/100" },
  { code: "1/60", label: "1/60" },
  { code: "1/48", label: "1/48" },
  { code: "Nonscale", label: "Nonscale" },
] as const;

export function getScaleByCode(code: string) {
  return SCALES.find((s) => s.code === code);
}

export const STATUSES = [
  { code: "WISHLIST", label: "Wishlist" },
  { code: "ORDERED", label: "Ordered" },
  { code: "OWNED", label: "Owned" },
  { code: "ASSEMBLED", label: "Assembled" },
] as const;

export function getStatusByCode(code: string) {
  return STATUSES.find((s) => s.code === code);
}

export const TYPES = [
  { code: "MODEL", label: "Model" },
  { code: "EXPANSION", label: "Expansion Kit" },
  { code: "ACCESSORY", label: "Accessory" },
];

export function getTypeByCode(code: string) {
  return TYPES.find((t) => t.code === code);
}
