// features/auth/components/RegisterForm.tsx
"use client";

import Link from "next/link";
import { useRegister } from "@/features/auth/hooks/useRegister";

export const RegisterForm = () => {
  const { formData, isLoading, error, handleChange, handleRegister } =
    useRegister();

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-slate-900">Buat Akun Baru</h1>
        <p className="text-xs text-slate-500">
          Daftar untuk mulai memesan tiket perjalanan Anda
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Nama Lengkap */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="nama@email.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Nomor Telepon */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Nomor Telepon (WhatsApp)
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="081234567890"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Password Confirmation */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Konfirmasi Kata Sandi
          </label>
          <input
            type="password"
            name="password_confirmation"
            required
            placeholder="••••••••"
            value={formData.password_confirmation}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? "Memproses..." : "Daftar Sekarang"}
        </button>
      </form>

      {/* Footer Nav */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Sudah punya akun?{" "}
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
