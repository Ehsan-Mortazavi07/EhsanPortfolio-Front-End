import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Locale, ThemeMode } from "@/common/i18n";
import { initialPreferencesState } from "./reducers";

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState: initialPreferencesState,
  reducers: {
    setLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload;
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.hydrated = action.payload;
    },
    hydratePreferences(state, action: PayloadAction<{ locale: Locale; theme: ThemeMode }>) {
      state.locale = action.payload.locale;
      state.theme = action.payload.theme;
      state.hydrated = true;
    },
  },
});

export const preferencesReducer = preferencesSlice.reducer;
export default preferencesReducer;
export const { setLocale, setTheme, setHydrated, hydratePreferences } = preferencesSlice.actions;
