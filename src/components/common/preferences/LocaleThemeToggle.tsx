"use client";

import { Button, ButtonGroup, cn } from "@heroui/react";
import { Global, Moon, Sun1 } from "iconsax-reactjs";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { Locale, ThemeMode } from "@/common/i18n";
import { changeLocale, changeTheme } from "@/stores/preferences/actions";
import { localeSelector, themeSelector } from "@/stores/preferences/selectors";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

type Props = {
  compact?: boolean;
  className?: string;
};

export function LocaleThemeToggle({ compact, className }: Props) {
  const dispatch = useAppDispatch();
  const locale = useAppSelector(localeSelector);
  const theme = useAppSelector(themeSelector);
  const { t } = useTranslation();

  const themeButtons: { id: ThemeMode; Icon: typeof Sun1 }[] = [
    { id: "light", Icon: Sun1 },
    { id: "dark", Icon: Moon },
    { id: "system", Icon: Global },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <ButtonGroup size="sm" variant="secondary" aria-label={t("prefs.language")}>
        {(["en", "fa"] as Locale[]).map((code) => (
          <Button
            key={code}
            variant={locale === code ? "primary" : "secondary"}
            className="min-w-10 font-semibold"
            onPress={() => dispatch(changeLocale(code))}
          >
            {code.toUpperCase()}
          </Button>
        ))}
      </ButtonGroup>

      <ButtonGroup size="sm" variant="secondary" aria-label={t("prefs.theme")}>
        {themeButtons.map(({ id, Icon }) => (
          <Button
            key={id}
            isIconOnly={compact}
            variant={theme === id ? "primary" : "secondary"}
            aria-label={t(`prefs.theme.${id}`)}
            onPress={() => dispatch(changeTheme(id))}
            className={cn(!compact && "gap-1.5 px-3")}
          >
            <Icon size={16} variant="Linear" />
            {!compact && <span className="hidden sm:inline text-xs font-medium">{t(`prefs.theme.${id}`)}</span>}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
