import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  AuthState,
  AuthUser,
  LoginFormValues,
  SignupFormValues,
} from "../types/auth.types";

import { loadAuthUserFromStorage } from "../utils/authStorage";

import {
  loginUser,
  logoutUser,
  signupUser,
} from "../services/authService";

const savedUser = loadAuthUserFromStorage();

const initialState: AuthState = {
  user: savedUser,
  isAuthenticated: Boolean(savedUser),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: (state, action: PayloadAction<SignupFormValues>) => {
      const user = signupUser(action.payload);

      state.user = user;
      state.isAuthenticated = true;
    },

    login: (state, action: PayloadAction<LoginFormValues>) => {
      const user = loginUser(action.payload);

      state.user = user;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      logoutUser();

      state.user = null;
      state.isAuthenticated = false;
    },

    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
  },
});

export const { signup, login, logout, setAuthUser } = authSlice.actions;

export default authSlice.reducer;