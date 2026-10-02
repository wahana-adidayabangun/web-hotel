// features/auth/components/LoginForm.tsx
"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";

export const LoginForm = ({ redirectTo }: { redirectTo?: string }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading, error } = useLogin(redirectTo);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await login({
      email: identifier,
      password,
    });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-slate-900">Masuk ke Akun</h1>
        <p className="text-xs text-slate-500">
          Selamat datang kembali! Silakan masukkan akun Anda
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Email atau No. Telepon
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="Contoh: user@mail.com atau 081234567890"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Masukkan password"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Lupa kata sandi?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-bold text-blue-600 hover:underline"
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
};
