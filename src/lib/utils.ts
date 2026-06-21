import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeExternalUrl(value: string | undefined, fallbackDomain?: string) {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^(mailto|tel|https?):/i.test(trimmed)) {
    return trimmed;
  }

  const cleaned = trimmed.replace(/^\s+|\s+$/g, "");
  if (/^www\./i.test(cleaned)) {
    return `https://${cleaned}`;
  }

  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }

  if (cleaned.includes(".")) {
    return `https://${cleaned.replace(/^https?:\/\//i, "")}`;
  }

  if (fallbackDomain) {
    return `https://${fallbackDomain}/${cleaned.replace(/^\/+/, "")}`;
  }

  return cleaned;
}

export function normalizeWhatsappHref(value: string | undefined) {
  if (!value) return "";
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  const normalized = digits.replace(/^0+/, "");
  if (normalized.length < 8) return "";
  return `https://wa.me/${normalized}`;
}
