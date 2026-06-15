"use client";

import { FC, PropsWithChildren, useEffect } from "react";
import { localeToAria, isRtlLocale } from "@/common/i18n";
import { initPreferencesFromStorage } from "@/stores/preferences/actions";
import { localeSelector, themeSelector } from "@/stores/preferences/selectors";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

function resolveTheme(mode: "light" | "dark" | "system"): "light" | "dark" {
  if (mode === "light" || mode === "dark") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyDocumentPreferences(locale: "en" | "fa", themeMode: "light" | "dark" | "system") {
  const root = document.documentElement;
  const resolved = resolveTheme(themeMode);
  root.lang = locale;
  root.dir = isRtlLocale(locale) ? "rtl" : "ltr";
  root.classList.toggle("dark", resolved === "dark");
  root.setAttribute("data-theme", resolved);
  root.style.colorScheme = resolved;
}

export const PreferencesProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const locale = useAppSelector(localeSelector);
  const theme = useAppSelector(themeSelector);

  useEffect(() => {
    dispatch(initPreferencesFromStorage());
  }, [dispatch]);

  useEffect(() => {
    applyDocumentPreferences(locale, theme);
  }, [locale, theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyDocumentPreferences(locale, "system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [locale, theme]);

  return <>{children}</>;
};

export function useDocumentAriaLocale(): string {
  const locale = useAppSelector(localeSelector);
  return localeToAria(locale);
}
