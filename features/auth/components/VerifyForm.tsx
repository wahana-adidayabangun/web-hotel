// features/auth/components/VerifyForm.tsx
"use client";

import { useRef } from "react";
import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";

export const VerifyForm = () => {
  const {
    otp,
    setOtp,
    emailOrPhone,
    isLoading,
    isResending,
    error,
    successMessage,
    timeLeft,
    formatTimer,
    handleVerify,
    handleResend,
  } = useVerifyOtp();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mengani perubahan input per digit
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Hanya angka

    const otpArray = otp.split("");
    otpArray[index] = value.slice(-1);
    const newOtp = otpArray.join("");
    setOtp(newOtp);

    // Otomatis pindah fokus ke input berikutnya
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
          ✉️
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Verifikasi Kode OTP
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Masukkan 6 digit kode verifikasi yang telah dikirimkan ke{" "}
          <span className="font-bold text-slate-800">
            {emailOrPhone || "kontak Anda"}
          </span>
          .
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 text-center">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-600 text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* 6 Digit Input Boxes */}
        <div className="flex justify-between gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index] || ""}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-xs text-slate-400 font-medium">
              Kode dapat dikirim ulang dalam{" "}
              <span className="font-mono font-bold text-blue-600">
                {formatTimer(timeLeft)}
              </span>
            </p>
          ) : (
            <p className="text-xs text-rose-500 font-medium">
              Kode OTP telah kadaluarsa. Silakan minta kode baru.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || otp.length < 6}
          className="w-full py-3.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
        </button>
      </form>

      {/* Resend OTP Section */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Tidak menerima kode?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0 || isResending}
            className="font-bold text-blue-600 hover:underline disabled:text-slate-300 disabled:no-underline disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? "Mengirim ulang..." : "Kirim Ulang OTP"}
          </button>
        </p>
      </div>
    </div>
  );
};
