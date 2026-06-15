import { createSlice } from "@reduxjs/toolkit";
import type { IAuthState } from "@/common/interfaces";
import reducers from "@/stores/auth/reducers";

const initialState: IAuthState = {
  token: null,
  user: null,
  didTryAutoLogin: false,
  isAuth: false,
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers,
});

export default authReducer.reducer;
