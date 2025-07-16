export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    email: string;
    fullName: string;
    isEmailVerified: boolean;
  };
}

export interface ErrorResponse {
  message: string;
} 