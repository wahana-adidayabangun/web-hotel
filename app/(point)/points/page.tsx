// app/(point)/points/page.tsx
"use client";

import { PointPackageList } from "@/features/point/components/PointPackageList";

export default function PointsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Top Up Poin
          </h1>
          <p className="text-sm text-slate-500">
            Pilih paket poin yang Anda inginkan untuk transaksi tiket perjalanan dengan lebih praktis.
          </p>
        </div>

        <PointPackageList />
      </div>
    </div>
  );
}