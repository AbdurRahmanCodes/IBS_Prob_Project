export interface AuthUser {
  id: string;
  name: string;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}
