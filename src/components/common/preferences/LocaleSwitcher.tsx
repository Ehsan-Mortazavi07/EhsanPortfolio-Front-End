"use client";

import { Button, Dropdown } from "@heroui/react";
import { ArrowDown2 } from "iconsax-reactjs";
import type { Locale } from "@/common/i18n";
import { useTranslation } from "@/common/i18n/useTranslation";
import { changeLocale } from "@/stores/preferences/actions";
import { localeSelector } from "@/stores/preferences/selectors";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

type Props = {
  light?: boolean;
  chrome?: boolean;
  hero?: boolean;
};

export function LocaleSwitcher({ light, chrome, hero }: Props) {
  const dispatch = useAppDispatch();
  const locale = useAppSelector(localeSelector);
  const { t } = useTranslation();

  const options: { code: Locale; label: string }[] = [
    { code: "en", label: "English" },
    { code: "fa", label: "فارسی" },
  ];

  return (
    <Dropdown>
      <Button
        size="sm"
        variant="ghost"
        aria-label={t("prefs.language")}
        className={`min-w-[4.5rem] gap-1.5 text-xs font-semibold uppercase tracking-wider ${
          chrome ? "admin-chrome-btn site-chrome-btn" : hero || light ? "auth-chrome-btn site-chrome-btn" : ""
        }`}
      >
        {locale.toUpperCase()}
        <ArrowDown2 size={14} variant="Linear" />
      </Button>
      <Dropdown.Popover className="min-w-[8rem]">
        <Dropdown.Menu
          aria-label={t("prefs.language")}
          selectedKeys={[locale]}
          selectionMode="single"
          onSelectionChange={(keys) => {
            const code = Array.from(keys)[0] as Locale | undefined;
            if (code) dispatch(changeLocale(code));
          }}
        >
          {options.map(({ code, label }) => (
            <Dropdown.Item key={code} id={code} textValue={label}>
              {label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
