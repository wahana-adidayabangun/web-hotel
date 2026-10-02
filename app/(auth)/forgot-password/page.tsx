// app/(auth)/forgot-password/page.tsx
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata = {
  title: "Lupa Kata Sandi | Travel Booking",
  description: "Masukkan email atau nomor telepon untuk mereset kata sandi akun Anda",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  );
}
