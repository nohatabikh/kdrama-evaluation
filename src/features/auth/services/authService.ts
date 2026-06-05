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

export const signupUser = (formValues: SignupFormValues): AuthUser => {
  const users = loadUsersFromStorage();

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === formValues.email.toLowerCase()
  );

  if (existingUser) {
    throw new Error("This email is already registered.");
  }

  const newUser = {
    id: createUserId(),
    name: formValues.name.trim(),
    email: formValues.email.trim().toLowerCase(),
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
  const users = loadUsersFromStorage();

  const existingUser = users.find(
    (user) =>
      user.email.toLowerCase() === formValues.email.trim().toLowerCase() &&
      user.password === formValues.password
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