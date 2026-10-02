// features/history/components/HistoryList.tsx
"use client";

import { useState, useMemo } from "react";
import { useMyBookings } from "@/features/history/hooks/useMyBookings";
import { HistoryCard } from "@/features/history/components/HistoryCard";

type TabStatus = "scheduled" | "completed" | "cancelled";

export const HistoryList = () => {
  const [activeTab, setActiveTab] = useState<TabStatus>("scheduled");
  const { bookings, pagination, isLoading, error, page, setPage } =
    useMyBookings(1);

  const counts = useMemo(() => {
    if (!bookings) return { scheduled: 0, completed: 0, cancelled: 0 };
    return {
      scheduled: bookings.filter(
        (b) =>
          b.status.toLowerCase() === "scheduled" ||
          b.status.toLowerCase() === "pending",
      ).length,
      completed: bookings.filter((b) => b.status.toLowerCase() === "completed")
        .length,
      cancelled: bookings.filter((b) => b.status.toLowerCase() === "cancelled")
        .length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (activeTab === "scheduled") {
      return bookings.filter(
        (booking) =>
          booking.status.toLowerCase() === "scheduled" ||
          booking.status.toLowerCase() === "pending",
      );
    }
    return bookings.filter(
      (booking) => booking.status.toLowerCase() === activeTab,
    );
  }, [bookings, activeTab]);

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
        <button
          type="button"
          onClick={() => setActiveTab("scheduled")}
          className={`flex-1 py-2.5 px-4 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "scheduled"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Terjadwal</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "scheduled"
                ? "bg-blue-50 text-blue-600"
                : "bg-slate-200/80 text-slate-600"
            }`}
          >
            {counts.scheduled}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-2.5 px-4 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "completed"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Selesai</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "completed"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-200/80 text-slate-600"
            }`}
          >
            {counts.completed}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cancelled")}
          className={`flex-1 py-2.5 px-4 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "cancelled"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Dibatalkan</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "cancelled"
                ? "bg-rose-50 text-rose-600"
                : "bg-slate-200/80 text-slate-600"
            }`}
          >
            {counts.cancelled}
          </span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse space-y-4"
            >
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-8 bg-slate-100 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="text-center py-12 bg-rose-50/50 rounded-2xl border border-rose-100 p-6">
          <p className="text-sm font-semibold text-rose-600">{error}</p>
        </div>
      )}

      {/* Empty State Per Tab */}
      {!isLoading && !error && filteredBookings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl">
            {activeTab === "scheduled"
              ? "📅"
              : activeTab === "completed"
                ? "🏁"
                : "🚫"}
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {activeTab === "scheduled"
              ? "Tidak Ada Perjalanan Terjadwal"
              : activeTab === "completed"
                ? "Belum Ada Perjalanan Selesai"
                : "Tidak Ada Pemesanan Dibatalkan"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === "scheduled"
              ? "Anda tidak memiliki tiket perjalanan aktif saat ini."
              : activeTab === "completed"
                ? "Riwayat tiket perjalanan yang telah selesai akan muncul di sini."
                : "Daftar pemesanan yang dibatalkan akan muncul di sini."}
          </p>
        </div>
      )}

      {/* Content List & Pagination */}
      {!isLoading && !error && filteredBookings.length > 0 && (
        <>
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <HistoryCard key={booking.id} booking={booking} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                &laquo; Sebelumnya
              </button>
              <span className="text-xs font-semibold text-slate-500">
                Halaman {pagination.current_page} dari {pagination.last_page}
              </span>
              <button
                disabled={page >= pagination.last_page}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Selanjutnya &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
