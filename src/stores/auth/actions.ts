import { isAxiosError } from "axios";
import type { ILoginForm } from "@/common/interfaces";
import { axiosInstance } from "@/common/axiosInstance";
import { normalizeAuthUser } from "@/common/utils/auth-user";
import { storage } from "@/common/utils";
import { AppThunk } from "@/stores";
import { authReducer } from "@/stores/auth";

export const { authenticate, setDidTryAutoLogin, logOut } = authReducer.actions;

export function autoLogin(token: string): AppThunk {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get("/auth/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(authenticate({ token, user: normalizeAuthUser(res.data.user) }));
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        storage.removeToken();
        dispatch(logOut());
      } else {
        console.error(err);
        storage.removeToken();
        dispatch(logOut());
      }
    } finally {
      dispatch(setDidTryAutoLogin());
    }
  };
}

export function loginAction(form: ILoginForm): AppThunk {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/auth/login", form);
      dispatch(authenticate({ token: res.data.token, user: normalizeAuthUser(res.data.user) }));
      storage.setToken(res.data.token);
    } catch (err: unknown) {
      const msg = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message
        : undefined;
      throw new Error(typeof msg === "string" ? msg : "Login failed.");
    }
  };
}

export function logOutAction(): AppThunk {
  return async (dispatch) => {
    storage.removeToken();
    dispatch(logOut());
  };
}
