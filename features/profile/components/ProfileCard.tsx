// features/profile/components/ProfileCard.tsx
"use client";

import Link from "next/link";
import { useProfile } from "@/features/profile/hooks/useProfile";

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </p>
    <p className="mt-1 text-sm font-medium text-gray-900 break-words">
      {value}
    </p>
  </div>
);

const MenuLink = ({
  href,
  label,
  color = "blue",
}: {
  href: string;
  label: string;
  color?: "blue" | "red";
}) => {
  const colorClasses =
    color === "red"
      ? "border-red-200 hover:border-red-400 hover:bg-red-50/60 text-red-700"
      : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 text-gray-900";

  return (
    <Link
      href={href}
      className={`block rounded-xl border bg-white p-4 text-center transition ${colorClasses}`}
    >
      <p className="text-sm font-semibold">{label}</p>
    </Link>
  );
};

export const ProfileCard = () => {
  const { profile, loading, error, logout } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl max-w-md mx-auto">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-gray-800">
      <div className="bg-blue-600 px-6 py-8 text-white flex flex-col sm:flex-row items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
          {profile.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-blue-100 text-sm">{profile.email}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Poin Saldo
            </p>
            <p className="mt-1 text-xl font-bold text-blue-600">
              {profile.point_user?.balance ?? 0} Pts
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Status Akun
            </p>
            <span className="mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold text-green-800 bg-green-100">
              {profile.is_verified ? "Terverifikasi" : "Belum Verifikasi"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            Informasi Akun
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoItem label="No. Telepon" value={profile.phone || "-"} />
            <InfoItem label="Bio" value={profile.customer?.bio || "-"} />
            <InfoItem label="Alamat" value={profile.customer?.address || "-"} />
            <InfoItem label="Kode Pos" value={profile.customer?.postal_code || "-"} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            Pengaturan Akun
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MenuLink href="/profile/change-password" label="Ubah Password" />
            <MenuLink href="/profile/help-center" label="Pusat Bantuan" />
            <MenuLink href="/profile/delete-account" label="Hapus Akun" color="red" />
          </div>
        </div>
      </div>
    </div>
  );
};
