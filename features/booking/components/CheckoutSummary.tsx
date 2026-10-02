"use client";

import { PaymentMethod } from "../types/payment";

interface CheckoutSummaryProps {
  origin: string;
  destination: string;
  date: string;
  paymentMethodId: number | null;
  setPaymentMethodId: (id: number) => void;
  pointBalance?: number;
  paymentMethods?: PaymentMethod[];
  loadingPaymentMethods?: boolean;
  price?: number;
}

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

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const CheckoutSummary = ({
  origin,
  destination,
  date,
  paymentMethodId,
  setPaymentMethodId,
  pointBalance = 0,
  paymentMethods = [],
  loadingPaymentMethods = false,
  price = 0,
}: CheckoutSummaryProps) => {
  const availablePaymentMethods = paymentMethods.filter(
    (method) => method.is_booking_payment,
  );

  const selectedPayment = availablePaymentMethods.find(
    (method) => method.id === paymentMethodId,
  );

  const adminFee = selectedPayment?.admin_fee || 0;
  const totalPayment = price + adminFee;

  const renderPaymentOptions = () => {
    if (loadingPaymentMethods) {
      return (
        <div className="text-xs text-slate-400 py-2">
          Memuat metode pembayaran...
        </div>
      );
    }

    if (!availablePaymentMethods.length) {
      return (
        <div className="text-xs text-slate-400 py-2">
          Tidak ada metode pembayaran tersedia.
        </div>
      );
    }

    return availablePaymentMethods.map((method) => {
      const isSelected = paymentMethodId === method.id;
      const iconUrl = normalizeIconUrl(method.icon);

      return (
        <div
          key={method.id}
          onClick={() => setPaymentMethodId(method.id)}
          className={`cursor-pointer border rounded-2xl p-4 flex items-center justify-between transition-all ${
            isSelected
              ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={method.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-slate-500 font-bold text-sm">
                  {method.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                {method.name}
              </p>
              <p className="text-xs text-slate-500">
                {method.payment_type === "point_balance"
                  ? `Saldo Poin: ${pointBalance.toLocaleString("id-ID")} Poin`
                  : method.description}
              </p>
              {method.admin_fee > 0 && (
                <p className="text-[11px] text-slate-400">
                  Admin: Rp{method.admin_fee.toLocaleString("id-ID")}
                </p>
              )}
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
    });
  };

  return (
    <div className="space-y-6">
      {/* Ringkasan Perjalanan */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Detail Perjalanan
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Rute</p>
            <p className="font-extrabold text-slate-900 text-base">
              {origin} → {destination}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Tanggal Keberangkatan</p>
            <p className="font-bold text-slate-800 text-sm">{date}</p>
          </div>
        </div>
      </div>

      {/* Rincian Harga */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Rincian Harga
        </h4>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Harga</span>
          <span className="font-semibold text-slate-900">
            {formatRupiah(price)}
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
          <span className="font-extrabold text-blue-600">
            {formatRupiah(totalPayment)}
          </span>
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 block">
          Metode Pembayaran
        </label>
        <div className="space-y-3">{renderPaymentOptions()}</div>
      </div>
    </div>
  );
};
