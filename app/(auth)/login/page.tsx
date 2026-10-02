import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <LoginForm redirectTo={searchParams?.from} />
    </main>
  );
}
