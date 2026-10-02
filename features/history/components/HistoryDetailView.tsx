// features/history/components/HistoryDetailView.tsx
"use client";

import { useRouter } from "next/navigation";
import { useBookingDetail } from "@/features/history/hooks/useBookingDetail";

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const HistoryDetailView = ({ id }: { id: string }) => {
  const router = useRouter();
  const { booking, isLoading, error, refetch } = useBookingDetail(id);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 p-4 md:p-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse space-y-4">
          <div className="h-6 bg-slate-100 rounded w-1/3" />
          <div className="h-24 bg-slate-100 rounded w-full" />
          <div className="h-48 bg-slate-100 rounded w-full" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 m-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 text-2xl">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Detail Riwayat Tidak Ditemukan
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {error || "Data booking tidak tersedia."}
        </p>
        <button
          onClick={() => router.push("/history")}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  // QR Code dari transaksi utama
  const primaryTransaction = booking.transactions?.[0];
  const qrCodeUrl = primaryTransaction?.qr_code;
  const isPendingPayment = booking.payment_status === "pending";
  const paymentTransactionId = primaryTransaction?.id;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/history")}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
        >
          ←
        </button>
        <div>
          <h1 className="text-lg font-black text-slate-900">
            Detail Tiket Booking
          </h1>
          <p className="text-xs text-slate-400">Kode: {booking.booking_code}</p>
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Ticket Header / Status */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Status Perjalanan
            </p>
            <span className="inline-block mt-1 text-xs font-extrabold uppercase px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
              {booking.status}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Status Pembayaran
            </p>
            <span className="inline-block mt-1 text-xs font-extrabold uppercase text-emerald-400">
              ✓ {booking.payment_status}
            </span>
          </div>
        </div>

        {/* QR Code Section (Jika Ada) */}
        {qrCodeUrl && (
          <div className="p-6 bg-slate-50/70 border-b border-slate-100 text-center space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Scan QR Code Saat Naik Shuttle
            </p>
            <div className="flex justify-center py-2">
              <img
                src={qrCodeUrl}
                alt="QR Code Tiket"
                className="w-44 h-44 object-contain bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Tunjukkan QR code ini kepada pengemudi / petugas shuttle.
            </p>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Route Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Rute Perjalanan
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {/* Origin */}
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />
                <p className="text-[10px] text-slate-400 font-semibold uppercase">
                  Keberangkatan
                </p>
                <p className="text-base font-extrabold text-slate-900">
                  {booking.origin}
                </p>
              </div>

              {/* Destination */}
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100" />
                <p className="text-[10px] text-slate-400 font-semibold uppercase">
                  Tujuan Akhir
                </p>
                <p className="text-base font-extrabold text-slate-900">
                  {booking.destination}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Schedule & Vehicle Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Tanggal</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {formatDate(booking.date)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Jam Keberangkatan</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {booking.time} WIB
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Armada Kendaraan</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {booking.vehicle}{" "}
                {booking.plate_number ? `(${booking.plate_number})` : ""}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Jumlah Kursi / Kode</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {booking.total_seats} Kursi ({booking.code})
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Passenger & Driver Info */}
          <div className="space-y-3 text-xs">
            <h3 className="font-extrabold text-slate-400 uppercase tracking-wider text-[11px]">
              Informasi Pemesan & Pengemudi
            </h3>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Nama Penumpang</span>
                <span className="font-bold text-slate-800">
                  {booking.contact_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">No. Telepon Penumpang</span>
                <span className="font-medium text-slate-700">
                  {booking.contact_phone}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200/60">
                <span className="text-slate-400">Nama Pengemudi</span>
                <span className="font-bold text-slate-800">
                  {booking.driver_name || "Belum ditentukan"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kontak Pengemudi</span>
                <span className="font-medium text-slate-700">
                  {booking.contact_driver}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Payment Details */}
          <div className="space-y-2 text-xs">
            <h3 className="font-extrabold text-slate-400 uppercase tracking-wider text-[11px]">
              Rincian Pembayaran
            </h3>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Metode Pembayaran</span>
              <span className="font-bold text-slate-800 uppercase">
                {booking.payment_method.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Harga Per Kursi</span>
              <span className="font-medium text-slate-800">
                {formatRupiah(booking.price)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-slate-100 text-sm">
              <span className="font-bold text-slate-900">Total Pembayaran</span>
              <span className="font-black text-blue-600">
                {formatRupiah(booking.total_price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isPendingPayment && paymentTransactionId && (
          <button
            onClick={() =>
              router.push(`/payment?transaction_id=${paymentTransactionId}`)
            }
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-blue-500/20"
          >
            Bayar Sekarang
          </button>
        )}
        <button
          onClick={() => router.push("/history")}
          className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-slate-900/10"
        >
          Kembali ke Riwayat
        </button>
      </div>
    </div>
  );
};
