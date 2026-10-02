// app/(dashboard)/profile/delete-account/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.");
    if (!confirmed) return;

    setLoading(true);
    try {
      // TODO: integrate actual API call
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      deleteCookie("user_name");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">Hapus Akun</h1>
        <p className="text-gray-500 text-sm mb-4">
          Menghapus akun akan menghilangkan semua data Anda secara permanen.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Hapus Akun"}
        </button>
      </div>
    </div>
  );
}
