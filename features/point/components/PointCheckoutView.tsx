// features/point/components/PointCheckoutView.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePoints } from "@/features/point/hooks/usePoints";
import { useCheckoutPoint } from "@/features/point/hooks/useCheckoutPoint";
import { usePaymentMethods } from "@/features/booking/hooks/usePaymentMethods";
import { PaymentMethod } from "@/features/booking/types/payment";

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const normalizeIconUrl = (icon: string | null | undefined): string | undefined => {
  if (!icon) return undefined;

  if (icon.startsWith("http")) {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const apiUrl = new URL(apiBase);
      const iconUrl = new URL(icon);

      if (iconUrl.origin !== apiUrl.origin) {
        iconUrl.host = apiUrl.host;
        iconUrl.protocol = apiUrl.protocol;
      }

      return iconUrl.toString();
    } catch {
      return icon;
    }
  }

  return icon;
};

export const PointCheckoutView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pointIdParam = searchParams.get("point_id");
  const selectedPointId = pointIdParam ? parseInt(pointIdParam, 10) : null;

  const { packages, isLoading: isLoadingPackages } = usePoints();
  const { buyPoint, isLoading: isSubmitting, error } = useCheckoutPoint();
  const { paymentMethods, loading: loadingPaymentMethods } =
    usePaymentMethods();

  const availablePaymentMethods = paymentMethods.filter(
    (method) => method.payment_type !== "point_balance",
  );

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedPaymentMethodId && availablePaymentMethods.length > 0) {
      setSelectedPaymentMethodId(availablePaymentMethods[0].id);
    }
  }, [availablePaymentMethods, selectedPaymentMethodId]);

  const selectedPackage = packages.find((item) => item.id === selectedPointId);

  const handleProcessPayment = async () => {
    if (!selectedPackage) return;

    const payload = {
      product_id: selectedPackage.product_id,
      point_id: selectedPackage.id,
      payment_method_id: selectedPaymentMethodId ?? 0,
    };

    await buyPoint(payload);
  };

  if (isLoadingPackages) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse space-y-4">
          <div className="h-6 bg-slate-100 rounded w-1/3" />
          <div className="h-12 bg-slate-100 rounded w-full" />
          <div className="h-24 bg-slate-100 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 text-2xl">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Paket Tidak Ditemukan
        </h3>
        <p className="text-xs text-slate-500">
          Silakan pilih paket poin terlebih dahulu sebelum melanjutkan ke
          halaman checkout.
        </p>
        <button
          onClick={() => router.push("/points")}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          ← Kembali ke Pilih Paket
        </button>
      </div>
    );
  }

  const finalPrice = selectedPackage.price - selectedPackage.discount;

  const selectedPayment = availablePaymentMethods.find(
    (method) => method.id === selectedPaymentMethodId,
  );
  const adminFee = selectedPayment?.admin_fee || 0;
  const totalPayment = finalPrice + adminFee;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Ringkasan Pesanan */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          1. Ringkasan Pesanan
        </h2>

        <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
              P
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {selectedPackage.name}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedPackage.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-blue-600 block">
              +{selectedPackage.amount.toLocaleString("id-ID")} Poin
            </span>
            <span className="text-sm font-black text-slate-900">
              {formatRupiah(finalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Rincian Harga */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-3 shadow-sm">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Rincian Harga
        </h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Harga Paket</span>
          <span className="font-semibold text-slate-900">
            {formatRupiah(finalPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Admin Fee</span>
          <span className="font-semibold text-slate-900">
            {formatRupiah(adminFee)}
          </span>
        </div>
        <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-slate-900">Total Pembayaran</span>
          <span className="font-extrabold text-blue-600 text-base">
            {formatRupiah(totalPayment)}
          </span>
        </div>
      </div>

      {/* Pilih Metode Pembayaran */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          2. Pilih Metode Pembayaran
        </h2>

        {loadingPaymentMethods ? (
          <div className="text-xs text-slate-400 py-2">
            Memuat metode pembayaran...
          </div>
        ) : availablePaymentMethods.length === 0 ? (
          <div className="text-xs text-slate-400 py-2">
            Tidak ada metode pembayaran tersedia.
          </div>
        ) : (
          <div className="space-y-3">
            {availablePaymentMethods.map((method) => {
              const isSelected = selectedPaymentMethodId === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethodId(method.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/30 ring-2 ring-blue-600/10"
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                      {method.icon ? (
                        <img
                          src={normalizeIconUrl(method.icon)}
                          alt={method.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span
                          className="text-white font-bold text-xs"
                          style={{ backgroundColor: method.color }}
                        >
                          {method.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">
                        {method.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Sticky Checkout Footer Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-lg flex items-center justify-between gap-4 sticky bottom-6">
        <div>
          <p className="text-xs text-slate-400">Total Pembayaran</p>
          <p className="text-lg font-black text-slate-900">
            {formatRupiah(totalPayment)}
          </p>
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleProcessPayment}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/10 disabled:opacity-50 active:scale-[0.98]"
        >
          {isSubmitting ? "Memproses..." : "Bayar Sekarang →"}
        </button>
      </div>
    </div>
  );
};

