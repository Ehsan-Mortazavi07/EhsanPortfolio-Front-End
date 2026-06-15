import type { RootState } from "@/stores";

export const isAuthSelector = (state: RootState) => state.auth.isAuth;
export const didTryAutoLoginSelector = (state: RootState) => state.auth.didTryAutoLogin;
export const tokenSelector = (state: RootState) => state.auth.token;
export const userSelector = (state: RootState) => state.auth.user;
