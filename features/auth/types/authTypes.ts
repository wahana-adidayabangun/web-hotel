// features/auth/types/authTypes.ts

export interface LoginPayload {
  email?: string;
  login?: string;
  phone?: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  is_verified: number;
  user?: User;
}

// Register Payload
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  otp?: number;
  otp_expires_at?: string;
  is_verified: boolean | number;
  created_at: string;
  updated_at: string;
}

export interface RegisterResponse {
  message: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  is_verified: boolean;
  user: User;
}

// OTP Verification
export interface VerifyOtpRequest {
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  is_verified: boolean;
  user?: User;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
  otp_expires_at?: string;
  user?: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}
