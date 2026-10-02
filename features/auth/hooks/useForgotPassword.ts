// features/auth/hooks/useForgotPassword.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPasswordApi } from "@/features/auth/services/authApi";
import { ForgotPasswordRequest } from "@/features/auth/types/authTypes";

export const useForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await forgotPasswordApi(formData);
      setSuccess(response.message || "Instruksi reset kata sandi telah dikirim.");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal mengirim permintaan reset kata sandi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit,
  };
};
