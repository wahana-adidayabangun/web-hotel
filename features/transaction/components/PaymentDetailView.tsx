// features/transaction/components/PaymentDetailView.tsx
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransactionDetail } from "@/features/transaction/hooks/useTransactionDetail";
import { useBanks } from "@/features/transaction/hooks/useBanks";

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PaymentDetailView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const {
    transaction,
    isLoading: isLoadingTx,
    error: errorTx,
    refetch,
  } = useTransactionDetail(id);
  const { banks, isLoading: isLoadingBanks } = useBanks();

  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(identifier);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const isLoading = isLoadingTx || isLoadingBanks;

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse space-y-4">
          <div className="h-6 bg-slate-100 rounded w-1/3" />
          <div className="h-10 bg-slate-100 rounded w-2/3" />
          <div className="h-24 bg-slate-100 rounded w-full" />
        </div>
      </div>
    );
  }

  if (errorTx || !transaction) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 text-2xl">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Detail Transaksi Tidak Ditemukan
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {errorTx || "Data transaksi tidak tersedia."}
        </p>
        <button
          onClick={() => router.push("/transaction")}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          Lihat Riwayat Transaksi
        </button>
      </div>
    );
  }

  const isCompleted =
    transaction.status === "completed" || transaction.status === "paid";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
        {/* Header Status */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Status Pembayaran
            </p>
            <span
              className={`inline-block mt-1 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                  : "bg-amber-50 text-amber-600 border-amber-200/60"
              }`}
            >
              {transaction.status}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Kode Transaksi</p>
            <p className="font-mono text-xs font-bold text-slate-900 mt-1">
              {transaction.transaction_code}
            </p>
          </div>
        </div>

        {/* Total Tagihan */}
        <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 text-center space-y-1">
          <p className="text-xs text-blue-600 font-semibold">
            Total Tagihan Pembayaran
          </p>
          <p className="text-2xl font-black text-slate-900">
            {formatRupiah(transaction.amount)}
          </p>
          <p className="text-[11px] text-slate-500 pt-1">
            {transaction.description}
          </p>
        </div>

        {/* Transfer Bank Tujuan */}
        {!isCompleted && (
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Transfer Ke Rekening Bank Berikut
            </h3>

            <div className="space-y-3">
              {banks.map((bank) => {
                const isCopied = copiedAccount === `bank-${bank.id}`;
                return (
                  <div
                    key={bank.id}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-800 text-sm">
                          {bank.name}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded">
                          Kode: {bank.code}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-xl p-3">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Nomor Rekening
                        </p>
                        <p className="font-mono font-extrabold text-slate-900 text-base">
                          {bank.account_number}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          a.n. {bank.account_name}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(bank.account_number, `bank-${bank.id}`)
                        }
                        className="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors active:scale-95"
                      >
                        {isCopied ? "Tersalin!" : "Salin"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Informasi Tambahan */}
        <div className="space-y-2 pt-2 text-xs text-slate-600">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-400">Metode Pembayaran</span>
            <span className="font-bold text-slate-900 uppercase">
              {transaction.payment_method.replace("_", " ")}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-400">Waktu Transaksi</span>
            <span className="font-semibold text-slate-800">
              {new Date(transaction.created_at).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => refetch()}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
          >
            Konfirmasi Pembayaran
          </button>
          <button
            onClick={() => router.push("/transaction")}
            className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors"
          >
            Lihat Riwayat Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};
