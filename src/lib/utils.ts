import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToMask(format: string): string {
  return format.replace(/[a-zA-Z]/g, "_");
}

export const formatFileName = (name: string) => {
  if (!name) return "Tidak ada nama file";
  const tempName = name?.split("/");
  const newName = tempName[tempName.length - 1];
  return newName;
};

export function formatErrorMessages(
  errorData: Record<string, string[] | string>
): string {
  return Object.entries(errorData)
    .map(([field, messages]) => {
      const readableField = field
        .replace(/([A-Z])/g, " $1") // camelCase to space
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

      const text =
        Array.isArray(messages) && messages.length > 0
          ? messages.map((msg) => `• ${readableField}: ${msg}`).join("\n")
          : `• ${readableField}: ${messages}`;

      return text;
    })
    .join("\n");
}

// utils/date.ts
export function formatDateYYYYMMDD(d?: Date) {
  if (!d) return "";
  const onlyDate = new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
  );
  return onlyDate.toISOString().slice(0, 10);
}

export function parseDateFromParam(v: string | null) {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
}
