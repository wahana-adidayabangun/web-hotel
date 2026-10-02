// features/auth/hooks/useRegister.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerApi } from "@/features/auth/services/authApi";
import { RegisterRequest } from "@/features/auth/types/authTypes";

export const useRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.password_confirmation) {
      setError("Konfirmasi kata sandi tidak cocok.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerApi(formData);

      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
      }

      // Cek status verifikasi user
      const isVerified = response.is_verified || response.user?.is_verified;

      if (!isVerified) {
        const expiresAt = response.user?.otp_expires_at || "";
        const emailOrPhone =
          response.user?.email || response.user?.phone || formData.email;

        // Redirect ke halaman verifikasi dengan query param
        router.push(
          `/verify?email=${encodeURIComponent(emailOrPhone)}&expires_at=${encodeURIComponent(expiresAt)}`,
        );
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Terjadi kesalahan saat registrasi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleRegister,
  };
};
