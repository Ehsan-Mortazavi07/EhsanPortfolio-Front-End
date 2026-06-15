import type { RootState } from "@/stores";
import type { Locale, ThemeMode } from "@/common/i18n";
import { isRtlLocale } from "@/common/i18n";

export const localeSelector = (state: RootState): Locale => state.preferences.locale;
export const themeSelector = (state: RootState): ThemeMode => state.preferences.theme;
export const isRtlSelector = (state: RootState): boolean => isRtlLocale(state.preferences.locale);
export const preferencesHydratedSelector = (state: RootState): boolean => state.preferences.hydrated;
