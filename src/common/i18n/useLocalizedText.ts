"use client";

import { useLocale } from "@/common/i18n/useTranslation";
import { lt } from "@/common/utils/localized";

export function useLocalizedText() {
  const locale = useLocale();
  return (en?: string | null, fa?: string | null) => lt(locale, en, fa);
}
