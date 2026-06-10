import type { AuthUser } from "../types/auth.types";
import { safeParseJson } from "../../../lib/storage";

export type StoredAuthUser = AuthUser & {
  password: string;
};

const AUTH_USERS_STORAGE_KEY = "kdrama-tracker-auth-users";
const AUTH_CURRENT_USER_STORAGE_KEY = "kdrama-tracker-auth-user";

 const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

 const isStoredAuthUser = (value: unknown): value is StoredAuthUser =>
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    typeof value.password === "string";

  const isAuthUser = (value: unknown): value is AuthUser =>
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string";

export const loadUsersFromStorage = (): StoredAuthUser[] => {
    const storedUsers = localStorage.getItem(AUTH_USERS_STORAGE_KEY);
    const parsedUsers = safeParseJson<unknown>(storedUsers, []);

    return Array.isArray(parsedUsers)
      ? parsedUsers.filter(isStoredAuthUser)
      : [];
  };

  export const loadAuthUserFromStorage = (): AuthUser | null => {
    const storedUser = localStorage.getItem(AUTH_CURRENT_USER_STORAGE_KEY);
    const parsedUser = safeParseJson<unknown>(storedUser, null);

    return isAuthUser(parsedUser) ? parsedUser : null;
  };
export const saveUsersToStorage = (users: StoredAuthUser[]) => {
  localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(users));
};


export const saveAuthUserToStorage = (user: AuthUser) => {
  localStorage.setItem(AUTH_CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
};

export const removeAuthUserFromStorage = () => {
  localStorage.removeItem(AUTH_CURRENT_USER_STORAGE_KEY);
};