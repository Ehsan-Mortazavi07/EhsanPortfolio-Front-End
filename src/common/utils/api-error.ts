import axios from "axios";
import type { FormikHelpers } from "formik";

export type ApiFieldError = { field?: string; message: string };
export type ParsedApiError = { message: string; errors: ApiFieldError[] };

function normalizeMessage(message: unknown): string {
  if (typeof message === "string" && message.trim()) return message.trim();
  if (Array.isArray(message)) return message.map(String).filter(Boolean).join(" — ");
  return "";
}

export function parseApiError(err: unknown): ParsedApiError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (data && typeof data === "object") {
      const body = data as { message?: unknown; errors?: unknown };
      const message =
        normalizeMessage(body.message) ||
        (err.response?.status === 400 ? "Please check the form fields." : "") ||
        err.message ||
        "Request failed.";
      const errors: ApiFieldError[] = [];
      if (Array.isArray(body.errors)) {
        for (const item of body.errors) {
          if (!item || typeof item !== "object") continue;
          const row = item as Record<string, unknown>;
          const msg = typeof row.message === "string" ? row.message.trim() : "";
          if (!msg) continue;
          const field = typeof row.field === "string" && row.field.trim() ? row.field.trim() : undefined;
          errors.push({ field, message: msg });
        }
      }
      return { message, errors };
    }
    return { message: err.message || "Request failed.", errors: [] };
  }
  if (err instanceof Error && err.message.trim()) return { message: err.message.trim(), errors: [] };
  return { message: "Request failed.", errors: [] };
}

export function applyApiErrorsToFormik<T extends object>(
  parsed: ParsedApiError,
  helpers: Pick<FormikHelpers<T>, "setFieldError" | "setFieldTouched">,
): boolean {
  let applied = false;
  for (const item of parsed.errors) {
    if (!item.field) continue;
    helpers.setFieldError(item.field as never, item.message);
    void helpers.setFieldTouched(item.field as never, true, false);
    applied = true;
  }
  return applied;
}
