import type { Dispatch } from "@reduxjs/toolkit";

import {
  loginUser,
  logoutUser,
  signupUser,
} from "../services/authService";
import type {
  LoginFormValues,
  SignupFormValues,
} from "../types/auth.types";
import { setAuthUser } from "./authSlice";

export const signup =
  (formValues: SignupFormValues) => (dispatch: Dispatch) => {
    const user = signupUser(formValues);

    dispatch(setAuthUser(user));

    return user;
  };

export const login =
  (formValues: LoginFormValues) => (dispatch: Dispatch) => {
    const user = loginUser(formValues);

    dispatch(setAuthUser(user));

    return user;
  };

export const logout = () => (dispatch: Dispatch) => {
  logoutUser();
  dispatch(setAuthUser(null));
};
