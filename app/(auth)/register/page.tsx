// app/(auth)/register/page.tsx

import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata = {
  title: "Daftar Akun | Travel Booking",
  description: "Buat akun baru untuk memesan tiket perjalanan Anda",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
