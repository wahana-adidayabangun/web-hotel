// app/(auth)/verify/page.tsx

import { Suspense } from "react";
import { VerifyForm } from "@/features/auth/components/VerifyForm";

export const metadata = {
  title: "Verifikasi OTP | Travel Booking",
  description: "Verifikasi akun Anda dengan memasukkan kode OTP",
};

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 animate-pulse text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto" />
            <div className="h-6 bg-slate-100 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto" />
          </div>
        }
      >
        <VerifyForm />
      </Suspense>
    </div>
  );
}
