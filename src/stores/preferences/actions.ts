import type { Locale, ThemeMode } from "@/common/i18n";
import { storage } from "@/common/utils/storage";
import type { AppThunk } from "@/stores";
import { hydratePreferences, setLocale, setTheme } from "./index";

export function initPreferencesFromStorage(): AppThunk {
  return (dispatch) => {
    const locale = storage.getLocale();
    const theme = storage.getTheme();
    dispatch(hydratePreferences({ locale, theme }));
  };
}

export function changeLocale(locale: Locale): AppThunk {
  return (dispatch) => {
    storage.setLocale(locale);
    dispatch(setLocale(locale));
  };
}

export function changeTheme(theme: ThemeMode): AppThunk {
  return (dispatch) => {
    storage.setTheme(theme);
    dispatch(setTheme(theme));
  };
}
