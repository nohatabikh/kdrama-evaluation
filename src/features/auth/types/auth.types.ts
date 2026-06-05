export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
};