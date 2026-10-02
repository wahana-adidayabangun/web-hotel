// features/auth/hooks/useVerifyOtp.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpApi, resendOtpApi } from "@/features/auth/services/authApi";

export const useVerifyOtp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil identifier (email/phone) & expires_at dari query params jika ada
  const initialEmailOrPhone =
    searchParams.get("email") || searchParams.get("phone") || "";
  const initialExpiresAt = searchParams.get("expires_at") || null;

  const [otp, setOtp] = useState<string>("");
  const [emailOrPhone, setEmailOrPhone] = useState<string>(initialEmailOrPhone);
  const [expiresAt, setExpiresAt] = useState<string | null>(initialExpiresAt);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Kalkulasi sisa waktu (dalam detik) dari expires_at ISO string
  const calculateTimeLeft = useCallback(() => {
    if (!expiresAt) return 0;
    const diff = Math.floor(
      (new Date(expiresAt).getTime() - new Date().getTime()) / 1000,
    );
    return diff > 0 ? diff : 0;
  }, [expiresAt]);

  // Timer countdown 1 detik
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, calculateTimeLeft]);

  // Format detik menjadi mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Submit Verify OTP
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length < 6) {
      setError("Kode OTP harus terdiri dari 6 digit.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await verifyOtpApi({ otp });
      setSuccessMessage(response.message || "Verifikasi berhasil!");

      // Redirect ke /profile jika berhasil
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Kode OTP tidak valid atau sudah kadaluarsa.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!emailOrPhone) {
      setError(
        "Email atau Nomor Telepon tidak ditemukan untuk pengiriman ulang OTP.",
      );
      return;
    }

    setIsResending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await resendOtpApi({ email: emailOrPhone });
      setSuccessMessage(response.message || "Kode OTP baru telah dikirimkan.");

      // Perbarui waktu kadaluarsa OTP dari response jika tersedia
      if (response.otp_expires_at) {
        setExpiresAt(response.otp_expires_at);
      } else if (response.user?.otp_expires_at) {
        setExpiresAt(response.user.otp_expires_at);
      } else {
        // Fallback: tambah 5 menit dari sekarang jika server tidak mereturn otp_expires_at
        const futureDate = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        setExpiresAt(futureDate);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal mengirim ulang kode OTP.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return {
    otp,
    setOtp,
    emailOrPhone,
    setEmailOrPhone,
    isLoading,
    isResending,
    error,
    successMessage,
    timeLeft,
    formatTimer,
    handleVerify,
    handleResend,
  };
};
