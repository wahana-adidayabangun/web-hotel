"use client";

import { Suspense, useEffect } from "react";
import { useCheckout } from "@/features/booking/hooks/useCheckout";
import { CheckoutSummary } from "@/features/booking/components/CheckoutSummary";
import { usePaymentMethods } from "@/features/booking/hooks/usePaymentMethods";

function CheckoutPageContent() {
  const {
    profile: user,
    contactName,
    setContactName,
    contactPhone,
    setContactPhone,
    paymentMethodId,
    setPaymentMethodId,
    isSubmitting,
    errorMessage,
    bookingDetails,
    handleBooking,
  } = useCheckout();

  const { paymentMethods, loading: loadingPaymentMethods } =
    usePaymentMethods();

  useEffect(() => {
    if (user) {
      if (user.name) {
        setContactName(user.name);
      }

      if (user.phone) {
        setContactPhone(user.phone);
      }
    }
  }, [user, setContactName, setContactPhone]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Konfirmasi Pemesanan
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Periksa kembali detail kontak dan perjalanan Anda sebelum memesan.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200/60 text-rose-700 text-sm font-medium rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Informasi Kontak */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Informasi Kontak Pemesan
              </h3>

              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                Terisi Otomatis
              </span>
            </div>

            <div className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap
                </label>

                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Nama pemesan"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>

              {/* Nomor Telepon */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Telepon
                </label>

                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Ringkasan Perjalanan & Pembayaran */}
          <CheckoutSummary
            origin={bookingDetails.origin}
            destination={bookingDetails.destination}
            date={bookingDetails.date}
            paymentMethodId={paymentMethodId}
            setPaymentMethodId={setPaymentMethodId}
            pointBalance={user?.point_user?.balance ?? 0}
            paymentMethods={paymentMethods}
            loadingPaymentMethods={loadingPaymentMethods}
            price={bookingDetails.price}
          />

          {/* Action Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleBooking}
            className="w-full py-4 bg-slate-900 hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all duration-150 shadow-md shadow-slate-900/10 hover:shadow-blue-500/25 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                <span>Memproses Pemesanan...</span>
              </>
            ) : (
              <span>Bayar Sekarang →</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
