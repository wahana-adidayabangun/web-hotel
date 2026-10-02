// features/transaction/components/TransactionDetailView.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransactionDetail } from "@/features/transaction/hooks/useTransactionDetail";
import { TransactionDetail } from "@/features/transaction/types/transactionTypes";

interface TransactionDetailViewProps {
  id: string;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "paid":
      return (
        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60">
          Selesai
        </span>
      );
    case "pending":
      return (
        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-amber-50 text-amber-600 border border-amber-200/60">
          Menunggu
        </span>
      );
    case "expired":
      return (
        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-orange-50 text-orange-600 border border-orange-200/60">
          Kadaluarsa
        </span>
      );
    case "failed":
    case "cancelled":
      return (
        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
          Gagal
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          {status}
        </span>
      );
  }
};

export const TransactionDetailView = ({ id }: TransactionDetailViewProps) => {
  const router = useRouter();
  const { transaction, isLoading, error } = useTransactionDetail(id);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse space-y-4">
          <div className="h-6 bg-slate-100 rounded w-1/3" />
          <div className="h-10 bg-slate-100 rounded w-1/2" />
          <div className="h-24 bg-slate-100 rounded w-full" />
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 text-2xl">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Detail Transaksi Tidak Ditemukan
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {error || "Data transaksi tidak tersedia."}
        </p>
        <button
          onClick={() => router.push("/transaction")}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          ← Kembali ke Riwayat Transaksi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Detail Transaksi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kode:{" "}
            <span className="font-mono font-bold">
              {transaction.transaction_code}
            </span>
          </p>
        </div>
        {getStatusBadge(transaction.status)}
      </div>

      {/* Info Transaksi */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 font-medium">Tipe Transaksi</p>
            <p className="text-sm font-bold text-slate-900">
              {transaction.transactionable_type?.includes("Booking")
                ? "Booking"
                : "Point"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Tanggal Transaksi
            </p>
            <p className="text-sm font-bold text-slate-900">
              {formatDate(transaction.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Rincian Pembayaran */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Rincian Pembayaran
        </h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Harga</span>
          <span className="font-semibold text-slate-900">
            {formatRupiah(transaction.price)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Admin Fee</span>
          <span className="font-semibold text-slate-900">
            {formatRupiah(transaction.admin_fee)}
          </span>
        </div>
        <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-slate-900">Total Pembayaran</span>
          <span className="font-extrabold text-blue-600 text-base">
            {formatRupiah(transaction.amount)}
          </span>
        </div>
      </div>

      {/* Deskripsi */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-2">
        <h3 className="text-base font-bold text-slate-900">Deskripsi</h3>
        <p className="text-sm text-slate-600">{transaction.description}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {transaction.status.toLowerCase() === "pending" && (
          <button
            onClick={() =>
              router.push(`/payment?transaction_id=${transaction.id}`)
            }
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-blue-500/20"
          >
            Bayar Sekarang
          </button>
        )}
        <button
          onClick={() => router.push("/transaction")}
          className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-slate-900/10"
        >
          Kembali ke Riwayat
        </button>
      </div>
    </div>
  );
};
