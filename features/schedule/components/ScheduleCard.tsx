"use client";

import { ScheduleItem } from "@/features/schedule/types/schedule";

interface ScheduleCardProps {
  schedule: ScheduleItem;
  price: number;
  onSelectSchedule?: (schedule: ScheduleItem) => void;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const ScheduleCard = ({
  schedule,
  price,
  onSelectSchedule,
}: ScheduleCardProps) => {
  const isAvailable = schedule.available_seats > 0;

  const handleSelect = () => {
    if (isAvailable && onSelectSchedule) {
      onSelectSchedule(schedule);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Sisi Kiri: Waktu & Info Kendaraan */}
        <div className="flex items-start gap-4">
          {/* Aksen Indikator Waktu */}
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 min-w-[90px]">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {schedule.schedule_time.slice(0, 5)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              WIB
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                {schedule.vehicle?.name || "Armada Utama"}
              </h3>
              {schedule.is_popular === 1 && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Populer
                </span>
              )}
            </div>

            {/* Detail Plat & Jenis Kendaraan */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                {schedule.vehicle?.plate_number ||
                  schedule.vehicle?.code ||
                  "N/A"}
              </span>
              <span>•</span>
              <span>{schedule.vehicle?.type || "Minibus Executive"}</span>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Harga & Action */}
        <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right">
            <div className="flex items-center gap-1.5 md:justify-end mb-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  isAvailable ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {isAvailable
                  ? `Sisa ${schedule.available_seats} Kursi`
                  : "Habis"}
              </span>
            </div>
            <p className="text-xl font-extrabold text-slate-900 tracking-tight">
              {formatRupiah(price)}
              <span className="text-xs font-normal text-slate-400">/kursi</span>
            </p>
          </div>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={handleSelect}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-150 active:scale-[0.98] ${
              isAvailable
                ? "bg-slate-900 hover:bg-blue-600 text-white shadow-md shadow-slate-900/10 hover:shadow-blue-500/25 cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isAvailable ? "Pilih Kursi →" : "Penuh"}
          </button>
        </div>
      </div>
    </div>
  );
};
