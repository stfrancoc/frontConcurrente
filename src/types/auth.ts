export interface UserCredentials {
  username: string;
  password: string;
  code?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string;
  isVerified: boolean;
  username?: string;
}