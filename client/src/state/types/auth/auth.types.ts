export interface User {
  userId: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "TENANT";
}

export interface UserCredentials {
  email: string;
  password: string;
  role: "USER" | "ADMIN" | "TENANT";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
