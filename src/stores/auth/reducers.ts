import { PayloadAction } from "@reduxjs/toolkit";
import type { IAuthState, IUser } from "@/common/interfaces";

const reducers = {
  authenticate: (state: IAuthState, action: PayloadAction<{ token: string; user: IUser }>) => ({
    ...state,
    token: action.payload.token,
    user: action.payload.user,
    didTryAutoLogin: true,
    isAuth: true,
  }),
  setDidTryAutoLogin: (state: IAuthState) => ({ ...state, didTryAutoLogin: true }),
  logOut: (): IAuthState => ({
    token: null,
    user: null,
    didTryAutoLogin: true,
    isAuth: false,
  }),
};

export default reducers;
