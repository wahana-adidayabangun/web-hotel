// app/(dashboard)/profile/page.tsx
import { ProfileCard } from "@/features/profile/components/ProfileCard";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <ProfileCard />
    </main>
  );
}
