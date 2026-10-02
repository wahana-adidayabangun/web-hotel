// features/auth/services/authApi.ts
import { publicApi } from "@/lib/api/publicApi";
import { privateApi } from "@/lib/api/privateApi";
import {
  LoginPayload,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "@/features/auth/types/authTypes";

export const loginApi = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response = await publicApi.post<LoginResponse>("/login", payload);
  return response.data;
};

export const registerApi = async (
  payload: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await publicApi.post<RegisterResponse>("/register", payload);
  return response.data;
};

// Endpoint Verifikasi OTP
export const verifyOtpApi = async (
  payload: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  // Menggunakan privateApi agar membawa Bearer Token yang didapat saat registrasi/login
  const response = await privateApi.post<VerifyOtpResponse>(
    "/verify-otp",
    payload,
  );
  return response.data;
};

// Endpoint Resend OTP
export const resendOtpApi = async (
  payload: ResendOtpRequest,
): Promise<ResendOtpResponse> => {
  const response = await publicApi.post<ResendOtpResponse>(
    "/resend-otp",
    payload,
  );
  return response.data;
};

export const forgotPasswordApi = async (
  payload: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await publicApi.post<ForgotPasswordResponse>(
    "/forgot-password",
    payload,
  );
  return response.data;
};
