// app/(payment)/payment/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePaymentDetail } from "@/features/payment/hooks/usePaymentDetail";
import { PaymentInstructions } from "@/features/payment/components/PaymentInstructions";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("transaction_id");

  const { data, loading, error } = usePaymentDetail(transactionId);

  useEffect(() => {
    if (!data) return;

    const transactionable = data.transaction?.transactionable;
    const isBooking = transactionable && transactionable.type === "Booking";

    if (isBooking && (data.status === "paid" || data.status === "completed")) {
      router.push(`/booking/success?id=${transactionable.id}`);
    }
  }, [data, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Gagal Memuat Detail Pembayaran
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {error || "Detail pembayaran tidak ditemukan."}
          </p>
          <button
            onClick={() => router.push("/history")}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-blue-500/20"
          >
            Kembali ke Riwayat
          </button>
        </div>
      </div>
    );
  }

  return <PaymentInstructions data={data} />;
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          }
        >
          <PaymentContent />
        </Suspense>
      </div>
    </div>
  );
}
