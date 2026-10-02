// app/(history)/history/page.tsx
"use client";

import { HistoryList } from "@/features/history/components/HistoryList";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Riwayat Pemesanan
          </h1>
          <p className="text-sm text-slate-500">
            Lihat daftar dan status tiket perjalanan yang telah Anda pesan.
          </p>
        </div>

        <HistoryList />
      </div>
    </div>
  );
}
