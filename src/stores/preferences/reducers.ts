import type { Locale, ThemeMode } from "@/common/i18n";

export type PreferencesState = {
  locale: Locale;
  theme: ThemeMode;
  hydrated: boolean;
};

export const initialPreferencesState: PreferencesState = {
  locale: "en",
  theme: "dark",
  hydrated: false,
};
