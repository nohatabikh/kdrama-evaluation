import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";

import {
  loadAuthUserFromStorage,
  loadUsersFromStorage,
} from "../utils/authStorage";
import authReducer from "./authSlice";
import { login, logout, signup } from "./authThunks";

function createTestStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
}

describe("authentication Redux flow", () => {
  it("signs up through the service before updating Redux state", () => {
    const store = createTestStore();

    const user = store.dispatch(
      signup({
        name: "Noha",
        email: "noha@example.com",
        password: "Strong1!",
      }),
    );

    expect(store.getState().auth).toEqual({
      user,
      isAuthenticated: true,
    });
    expect(loadAuthUserFromStorage()).toEqual(user);
    expect(loadUsersFromStorage()).toHaveLength(1);
  });

  it("does not update Redux state when login validation fails", () => {
    const store = createTestStore();

    expect(() =>
      store.dispatch(
        login({
          email: "missing@example.com",
          password: "wrong-password",
        }),
      ),
    ).toThrow("Invalid email or password.");

    expect(store.getState().auth).toEqual({
      user: null,
      isAuthenticated: false,
    });
  });

  it("logs out by clearing both the session and Redux state", () => {
    const store = createTestStore();

    store.dispatch(
      signup({
        name: "Noha",
        email: "noha@example.com",
        password: "Strong1!",
      }),
    );
    store.dispatch(logout());

    expect(store.getState().auth).toEqual({
      user: null,
      isAuthenticated: false,
    });
    expect(loadAuthUserFromStorage()).toBeNull();
    expect(loadUsersFromStorage()).toHaveLength(1);
  });
});
