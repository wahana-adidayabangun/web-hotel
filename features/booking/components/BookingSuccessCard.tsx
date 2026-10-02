// features/booking/components/BookingSuccessCard.tsx
"use client";

import Link from "next/link";
import { BookingSuccessData } from "../types/successTypes";

interface BookingSuccessCardProps {
  data: BookingSuccessData;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const BookingSuccessCard = ({ data }: BookingSuccessCardProps) => {
  return (
    <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-slate-100 text-center space-y-6">
      {/* Icon Centang Sukses */}
      <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-8 border-emerald-100/50">
        <svg
          className="w-10 h-10 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Pemesanan Berhasil!
        </h1>
        <p className="text-sm text-slate-500">
          Terima kasih, tiket perjalanan Anda telah berhasil dipesan dan
          terkonfirmasi.
        </p>
      </div>

      {/* Detail Ringkasan */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4 text-left">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
          <span className="text-xs text-slate-400 font-medium">
            Kode Pemesanan
          </span>
          <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            {data.booking_code}
          </span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
          <span className="text-xs text-slate-400 font-medium">
            Metode Pembayaran
          </span>
          <span className="text-xs font-bold text-slate-700 capitalize bg-slate-200/60 px-2 py-0.5 rounded">
            {data.redirect_type.replace("_", " ")}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">
            Total Pembayaran
          </span>
          <span className="text-base font-extrabold text-slate-900">
            {formatRupiah(data.total_price)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Link
          href="/history"
          className="w-full inline-block py-3.5 px-4 bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-slate-900/10 active:scale-[0.98]"
        >
          Lihat Riwayat Pesanan
        </Link>

        <Link
          href="/"
          className="w-full inline-block py-3 px-4 bg-transparent hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};
