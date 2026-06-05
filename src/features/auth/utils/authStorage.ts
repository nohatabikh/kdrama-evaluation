import type { AuthUser } from "../types/auth.types";

export type StoredAuthUser = AuthUser & {
  password: string;
};

const AUTH_USERS_STORAGE_KEY = "kdrama-tracker-auth-users";
const AUTH_CURRENT_USER_STORAGE_KEY = "kdrama-tracker-auth-user";

export const loadUsersFromStorage = (): StoredAuthUser[] => {
  const storedUsers = localStorage.getItem(AUTH_USERS_STORAGE_KEY);

  return storedUsers ? JSON.parse(storedUsers) : [];
};

export const saveUsersToStorage = (users: StoredAuthUser[]) => {
  localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(users));
};

export const loadAuthUserFromStorage = (): AuthUser | null => {
  const storedUser = localStorage.getItem(AUTH_CURRENT_USER_STORAGE_KEY);

  return storedUser ? JSON.parse(storedUser) : null;
};

export const saveAuthUserToStorage = (user: AuthUser) => {
  localStorage.setItem(AUTH_CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
};

export const removeAuthUserFromStorage = () => {
  localStorage.removeItem(AUTH_CURRENT_USER_STORAGE_KEY);
};