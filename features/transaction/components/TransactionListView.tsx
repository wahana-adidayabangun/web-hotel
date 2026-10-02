// features/transaction/components/TransactionListView.tsx
"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useTransactionList } from "@/features/transaction/hooks/useTransactionList";
import { TransactionItem } from "@/features/transaction/types/transactionTypes";

type TabStatus = "pending" | "success" | "cancelled";

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

export const TransactionListView = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabStatus>("pending");
  const { transactions, pagination, page, setPage, isLoading, error, refetch } =
    useTransactionList();

  const counts = {
    pending: transactions.filter((t) => t.status.toLowerCase() === "pending")
      .length,
    success: transactions.filter((t) =>
      ["completed", "paid"].includes(t.status.toLowerCase()),
    ).length,
    cancelled: transactions.filter((t) =>
      ["cancelled", "canceled", "failed", "expired"].includes(
        t.status.toLowerCase(),
      ),
    ).length,
  };

  const filteredTransactions = transactions.filter((item) => {
    const status = item.status.toLowerCase();
    if (activeTab === "pending") return status === "pending";
    if (activeTab === "success") return ["completed", "paid"].includes(status);
    if (activeTab === "cancelled")
      return ["cancelled", "canceled", "failed", "expired"].includes(status);
    return true;
  });

  const handleDetailClick = (item: TransactionItem) => {
    router.push(`/transaction/${item.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Riwayat Transaksi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar semua transaksi pembelian poin dan booking.
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          title="Muat Ulang"
        >
          <Icon icon="mdi:reload" width={20} height={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
        {[
          { key: "pending", label: "Pending", count: counts.pending },
          { key: "success", label: "Success", count: counts.success },
          { key: "cancelled", label: "Cancel", count: counts.cancelled },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabStatus)}
            className={`flex-1 py-2.5 px-4 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === tab.key
                  ? "bg-blue-50 text-blue-600"
                  : "bg-slate-200/80 text-slate-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-100 animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 bg-slate-100 rounded w-1/4" />
                <div className="h-5 bg-slate-100 rounded-full w-16" />
              </div>
              <div className="h-6 bg-slate-100 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="bg-white rounded-2xl border border-rose-100 p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 text-xl">
            ⚠️
          </div>
          <p className="text-xs font-semibold text-slate-700">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredTransactions.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 text-xl">
            📋
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Tidak Ada Transaksi
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {`Tidak ada transaksi dengan status ${activeTab}.`}
          </p>
        </div>
      )}

      {/* List Transaksi */}
      {!isLoading && !error && filteredTransactions.length > 0 && (
        <div className="space-y-3">
          {filteredTransactions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleDetailClick(item)}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-slate-200 transition-all cursor-pointer shadow-sm hover:shadow group space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                  {item.transaction_code}
                </span>
                {getStatusBadge(item.status)}
              </div>

              <div className="flex items-end justify-between pt-1">
                <div>
                  <p className="text-xs font-medium text-slate-500 line-clamp-1">
                    {item.description}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formatDate(item.created_at)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-base font-black text-slate-900">
                    {formatRupiah(item.amount)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controller */}
      {!isLoading && !error && pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!pagination.prev_page_url}
            className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>

          <span className="font-medium text-slate-500">
            Halaman{" "}
            <strong className="text-slate-900">
              {pagination.current_page}
            </strong>{" "}
            dari{" "}
            <strong className="text-slate-900">{pagination.last_page}</strong>
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={!pagination.next_page_url}
            className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Selanjutnya →
          </button>
        </div>
      )}
    </div>
  );
};
