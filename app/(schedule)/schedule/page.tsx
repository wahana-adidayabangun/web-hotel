// app/(schedule)/schedule/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSchedule } from "@/features/schedule/hooks/useSchedule";
import { ScheduleCard } from "@/features/schedule/components/ScheduleCard";
import { useRouteStore } from "@/features/home/hooks/useRouteStore";

function SchedulePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const routeId = searchParams.get("id");

  const { routeDetail, serverTime, activeType, currentDate, loading, error } =
    useSchedule(routeId);

  const { origin, destination } = useRouteStore();

  if (!routeId) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
          ⚠️
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-1">
          ID Rute Tidak Ditemukan
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Silakan pilih rute dan halte tujuan terlebih dahulu dari halaman
          beranda.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-blue-500/20"
        >
          Kembali ke Pilih Rute
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />

        <p className="text-xs font-medium text-gray-400">
          Memuat data jadwal...
        </p>
      </div>
    );
  }

  if (error || !routeDetail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="text-sm font-medium text-blue-600 hover:underline mb-4 inline-flex items-center gap-1"
        >
          ← Kembali ke Rute
        </button>

        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm font-medium">
          {error || "Data rute tidak ditemukan."}
        </div>
      </div>
    );
  }

  const isMorningSession = activeType === "morning";

  const originName = isMorningSession
    ? origin?.name || "Halte Keberangkatan"
    : destination?.city?.name || "Halte Tujuan";

  const originDesc = isMorningSession ? origin?.description : undefined;

  const destinationName = isMorningSession
    ? destination?.city?.name || "Halte Tujuan"
    : origin?.name || "Halte Keberangkatan";

  const destinationDesc = isMorningSession
    ? destination?.city?.description
    : undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Tombol Kembali */}
      <button
        onClick={() => router.back()}
        className="text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-1.5 transition active:scale-95"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Kembali
      </button>

      {/* Header Card Info Rute */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        {/* Title & Tanggal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {routeDetail.name}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {routeDetail.description}
            </p>
          </div>

          {currentDate && (
            <div className="bg-blue-50/80 border border-blue-100 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-900 self-start sm:self-auto">
              Tanggal: {currentDate}
            </div>
          )}
        </div>

        {/* Card Banner Origin & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/30 to-emerald-50/80 p-4 rounded-xl border border-blue-100/70 mb-4">
          {/* Origin */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 mb-0.5">
              Halte Keberangkatan (Origin)
            </span>

            <p className="text-base font-bold text-gray-900 leading-tight">
              {originName}
            </p>

            {originDesc && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {originDesc}
              </p>
            )}
          </div>

          {/* Icon Panah */}
          <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-xs border border-gray-100 text-blue-500 my-auto">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>

          {/* Destination */}
          <div className="flex flex-col md:text-right">
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 mb-0.5">
              Halte Tujuan (Destination)
            </span>

            <p className="text-base font-bold text-gray-900 leading-tight">
              {destinationName}
            </p>

            {destinationDesc && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {destinationDesc}
              </p>
            )}
          </div>
        </div>

        {/* Server Time & Sesi */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>
            Waktu Server:{" "}
            <strong className="text-gray-700">{serverTime}</strong>
          </span>

          <span>•</span>

          <span>
            Sesi:{" "}
            <strong className="capitalize text-blue-600">{activeType}</strong>
          </span>
        </div>
      </div>

      {/* List Jam Keberangkatan */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Pilih Jam Keberangkatan ({routeDetail.schedules?.length || 0} Jadwal)
        </h2>

        {!routeDetail.schedules || routeDetail.schedules.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm font-medium text-gray-500">
              Tidak ada jadwal tersedia untuk rute ini.
            </p>
          </div>
        ) : (
          routeDetail.schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              price={routeDetail.price}
              onSelectSchedule={(selected) => {
                console.log("1. Schedule dipilih:", selected);

                try {
                  const isMorning = selected.schedule_type === "morning";

                  const originName = isMorning
                    ? origin?.name || "Halte Keberangkatan"
                    : destination?.city?.name || "Halte Tujuan";

                  const originDesc = isMorning ? origin?.description : undefined;

                  const destinationName = isMorning
                    ? destination?.city?.name || "Halte Tujuan"
                    : origin?.name || "Halte Keberangkatan";

                  const destinationDesc = isMorning
                    ? destination?.city?.description
                    : undefined;

                  const queryParams = new URLSearchParams({
                    product_id: String(routeDetail?.product_id || 1),

                    transport_route_id: String(routeDetail?.id || routeId || 1),

                    schedule_id: String(selected?.id || 1),

                    date: currentDate || "2026-07-02",

                    origin: originName || "",

                    destination: destinationName || "",

                    price: String(routeDetail.price),
                  });

                  const targetUrl = `/checkout?${queryParams.toString()}`;

                  console.log("2. Membuka URL target:", targetUrl);

                  router.push(targetUrl);
                } catch (err) {
                  console.error("Gagal melakukan navigasi:", err);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />

          <p className="text-xs font-medium text-gray-400">Memuat jadwal...</p>
        </div>
      }
    >
      <SchedulePageContent />
    </Suspense>
  );
}
