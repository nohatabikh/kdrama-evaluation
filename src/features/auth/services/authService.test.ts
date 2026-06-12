import { describe, expect, it } from "vitest";

import {
  isStrongPassword,
  loginUser,
  logoutUser,
  signupUser,
} from "./authService";
import {
  loadAuthUserFromStorage,
  loadUsersFromStorage,
} from "../utils/authStorage";

describe("authService", () => {
  it("accepts only passwords that meet every requirement", () => {
    expect(isStrongPassword("Strong1!")).toBe(true);
    expect(isStrongPassword("short1!")).toBe(false);
    expect(isStrongPassword("NOLOWERCASE1!")).toBe(false);
    expect(isStrongPassword("nouppercase1!")).toBe(false);
    expect(isStrongPassword("NoNumber!")).toBe(false);
    expect(isStrongPassword("NoSymbol1")).toBe(false);
  });

  it("signs up a normalized user and creates a session", () => {
    const user = signupUser({
      name: "  Noha  ",
      email: "  NOHA@example.com  ",
      password: "Strong1!",
    });

    expect(user).toMatchObject({
      name: "Noha",
      email: "noha@example.com",
    });
    expect(loadUsersFromStorage()).toHaveLength(1);
    expect(loadAuthUserFromStorage()).toEqual(user);
  });

  it("rejects duplicate accounts regardless of email casing", () => {
    signupUser({
      name: "Noha",
      email: "noha@example.com",
      password: "Strong1!",
    });

    expect(() =>
      signupUser({
        name: "Another Noha",
        email: "NOHA@example.com",
        password: "Another1!",
      }),
    ).toThrow("This email is already registered.");
  });

  it("logs in with valid credentials and rejects invalid credentials", () => {
    const registeredUser = signupUser({
      name: "Noha",
      email: "noha@example.com",
      password: "Strong1!",
    });
    logoutUser();

    expect(
      loginUser({
        email: " NOHA@example.com ",
        password: "Strong1!",
      }),
    ).toEqual(registeredUser);

    expect(() =>
      loginUser({
        email: "noha@example.com",
        password: "wrong-password",
      }),
    ).toThrow("Invalid email or password.");
  });

  it("removes only the current session on logout", () => {
    signupUser({
      name: "Noha",
      email: "noha@example.com",
      password: "Strong1!",
    });

    logoutUser();

    expect(loadAuthUserFromStorage()).toBeNull();
    expect(loadUsersFromStorage()).toHaveLength(1);
  });
});
