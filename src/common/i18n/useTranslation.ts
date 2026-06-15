"use client";

import { translate, type Locale, type MessageKey } from "@/common/i18n";
import { localeSelector } from "@/stores/preferences/selectors";
import { useAppSelector } from "@/stores/hooks";

export function useTranslation() {
  const locale = useAppSelector(localeSelector);

  function t(key: MessageKey): string {
    return translate(locale, key);
  }

  return { t, locale };
}

export function useLocale(): Locale {
  return useAppSelector(localeSelector);
}
