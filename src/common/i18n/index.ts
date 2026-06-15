import { messages as en } from "./messages/en";
import { messages as fa } from "./messages/fa";
import type { Locale, MessageKey } from "./types";

const catalogs: Record<Locale, Record<MessageKey, string>> = { en, fa };

export function translate(locale: Locale, key: MessageKey): string {
  return catalogs[locale][key] ?? catalogs.en[key] ?? key;
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === "fa";
}

export function localeToAria(locale: Locale): string {
  return locale === "fa" ? "fa-IR" : "en-US";
}

export * from "./types";
