import jsCookies from "js-cookie";
import type { Locale, ThemeMode } from "@/common/i18n";

const LOCALE_KEY = "locale";
const THEME_KEY = "theme";

export const storage = {
  getToken: (): string | undefined => jsCookies.get("token"),
  setToken: (token: string) => {
    jsCookies.set("token", token, {
      path: "/",
      expires: 90,
      sameSite: "lax",
      secure: typeof window !== "undefined" && window.location.protocol === "https:",
    });
  },
  removeToken: () => jsCookies.remove("token", { path: "/" }),

  getLocale: (): Locale => {
    if (typeof window === "undefined") return "en";
    const v = localStorage.getItem(LOCALE_KEY);
    return v === "fa" ? "fa" : "en";
  },
  setLocale: (locale: Locale) => {
    localStorage.setItem(LOCALE_KEY, locale);
    jsCookies.set(LOCALE_KEY, locale, { path: "/", expires: 365 });
  },

  getTheme: (): ThemeMode => {
    if (typeof window === "undefined") return "system";
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
    return "dark";
  },
  setTheme: (theme: ThemeMode) => {
    localStorage.setItem(THEME_KEY, theme);
    jsCookies.set(THEME_KEY, theme, { path: "/", expires: 365 });
  },
};
