import type { Locale } from "@/common/i18n";

/** Pick localized string with English fallback. */
export function lt(locale: Locale, en?: string | null, fa?: string | null): string {
  const enVal = en?.trim() ?? "";
  const faVal = fa?.trim() ?? "";
  if (locale === "fa" && faVal) return faVal;
  return enVal || faVal;
}
