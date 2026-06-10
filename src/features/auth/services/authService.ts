import type {
  AuthUser,
  LoginFormValues,
  SignupFormValues,
} from "../types/auth.types";

import {
  loadUsersFromStorage,
  saveUsersToStorage,
  saveAuthUserToStorage,
  removeAuthUserFromStorage,
} from "../utils/authStorage";


const createUserId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const isStrongPassword = (password: string) =>
  password.length >= 8 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

 export const signupUser = (formValues: SignupFormValues): AuthUser => {
    const name = formValues.name.trim();
    const email = formValues.email.trim().toLowerCase();

    if (name.length < 2) {
      throw new Error("Name must contain at least 2 characters.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Enter a valid email address.");
    }

    if (!isStrongPassword(formValues.password)) {
      throw new Error("Password does not meet the security requirements.");
    }

    const users = loadUsersFromStorage();

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      throw new Error("This email is already registered.");
    }

    const newUser = {
      id: createUserId(),
      name,
      email,
      password: formValues.password,
    };

    const updatedUsers = [...users, newUser];

    saveUsersToStorage(updatedUsers);

    const authUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    saveAuthUserToStorage(authUser);

    return authUser;
  };

 export const loginUser = (formValues: LoginFormValues): AuthUser => {
    const email = formValues.email.trim().toLowerCase();

    if (!email || !formValues.password) {
      throw new Error("Email and password are required.");
    }

    const users = loadUsersFromStorage();

    const existingUser = users.find(
      (user) =>
        user.email === email &&
        user.password === formValues.password,
    );

    if (!existingUser) {
      throw new Error("Invalid email or password.");
    }

    const authUser: AuthUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    };

    saveAuthUserToStorage(authUser);

    return authUser;
  };

export const logoutUser = () => {
  removeAuthUserFromStorage();
};
