// features/auth/components/ForgotPasswordForm.tsx
"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

export const ForgotPasswordForm = () => {
  const {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit,
  } = useForgotPassword();

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-slate-900">Lupa Kata Sandi</h1>
        <p className="text-xs text-slate-500">
          Masukkan email atau nomor telepon Anda untuk menerima instruksi reset kata sandi
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Email atau No. Telepon
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Contoh: user@mail.com atau 081234567890"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? "Mengirim..." : "Kirim Instruksi Reset"}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Ingat kata sandi Anda?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};
