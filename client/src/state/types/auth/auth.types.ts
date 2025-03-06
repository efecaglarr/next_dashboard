export interface User {
  userId: string;
  username: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "TENANT";
}

export interface UserLoginCredentials {
  emailOrUsername: string;
  password: string;
  role: "USER" | "ADMIN" | "TENANT";
}

export interface UserRegistrationCredentials {
  email: string;
  password: string;
  username: string;
  role: "USER";
  isTenant?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isTenantRegistration?: boolean;
}
