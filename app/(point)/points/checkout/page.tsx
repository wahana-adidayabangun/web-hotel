// app/(point)/points/checkout/page.tsx
"use client";

import { Suspense } from "react";
import { PointCheckoutView } from "@/features/point/components/PointCheckoutView";

export default function PointCheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Checkout Pembelian Poin
          </h1>
          <p className="text-sm text-slate-500">
            Periksa detail paket dan pilih metode pembayaran untuk menyelesaikan transaksi.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-8 bg-white rounded-3xl border border-slate-100 text-center text-xs text-slate-400">
              Memuat data checkout...
            </div>
          }
        >
          <PointCheckoutView />
        </Suspense>
      </div>
    </div>
  );
}