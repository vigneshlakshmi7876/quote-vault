export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any | null; 
  session: any | null;
  error: string | null;
}