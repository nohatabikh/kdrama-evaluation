import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  AuthState,
  AuthUser,
} from "../types/auth.types";

import { loadAuthUserFromStorage } from "../utils/authStorage";

const savedUser = loadAuthUserFromStorage();

const initialState: AuthState = {
  user: savedUser,
  isAuthenticated: Boolean(savedUser),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
  },
});

export const { setAuthUser } = authSlice.actions;

export default authSlice.reducer;
