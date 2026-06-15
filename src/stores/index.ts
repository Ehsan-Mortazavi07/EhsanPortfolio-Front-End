import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import auth from "@/stores/auth";
import preferences from "@/stores/preferences";

export function makeStore() {
  return configureStore({ reducer: { auth, preferences } });
}

const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
