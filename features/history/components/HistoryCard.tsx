// features/history/components/HistoryCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { BookingHistoryItem } from "@/features/history/types/historyTypes";

interface HistoryCardProps {
  booking: BookingHistoryItem;
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
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const HistoryCard = ({ booking }: HistoryCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/history/${booking.id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-semibold px-2.5 py-1 rounded-full">
            Terjadwal
          </span>
        );
      case "completed":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold px-2.5 py-1 rounded-full">
            Selesai
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200/60 text-xs font-semibold px-2.5 py-1 rounded-full">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (paymentStatus: string) => {
    if (paymentStatus === "paid") {
      return (
        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
          Lunas
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded capitalize">
        {paymentStatus}
      </span>
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer active:scale-[0.99] space-y-4 group"
    >
      {/* Header Card: Kode Booking & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">
            Kode Tiket:
          </span>
          <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors px-2.5 py-1 rounded-lg">
            {booking.booking_code}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getPaymentBadge(booking.payment_status)}
          {getStatusBadge(booking.status)}
        </div>
      </div>

      {/* Main Details: Rute & Jam */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs text-slate-400 font-medium">Rute Perjalanan</p>
          <p className="text-lg font-black text-slate-900">
            {booking.origin} <span className="text-blue-600">→</span>{" "}
            {booking.destination}
          </p>
          <p className="text-xs text-slate-500">
            {booking.vehicle} ({booking.code})
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100/80">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Tanggal
            </p>
            <p className="text-xs font-bold text-slate-800">
              {formatDate(booking.date)}
            </p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Jam Keberangkatan
            </p>
            <p className="text-xs font-bold text-blue-600">
              {booking.time.slice(0, 5)} WIB
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info: Penumpang & Total */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div>
          <span className="text-slate-400">Pemesan: </span>
          <span className="font-semibold text-slate-700">
            {booking.contact_name}
          </span>
          <span className="text-slate-400"> ({booking.total_seats} Kursi)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Total: </span>
          <span className="font-extrabold text-sm text-slate-900">
            {formatRupiah(booking.total_price)}
          </span>
          <span className="text-slate-300 font-bold group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all ml-1">
            →
          </span>
        </div>
      </div>
    </div>
  );
};
