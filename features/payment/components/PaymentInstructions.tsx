"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { PaymentData } from "../types/payment";

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatCountdown = (expiresAt: string) => {
  const now = new Date().getTime();
  const expiry = new Date(expiresAt).getTime();
  const diff = expiry - now;

  if (diff <= 0) {
    return "00:00:00";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

interface PaymentInstructionsProps {
  data: PaymentData;
}

export const PaymentInstructions = ({ data }: PaymentInstructionsProps) => {
  const router = useRouter();

  const isVa = data.method === "bank_transfer" || data.method === "echannel";
  const isQris = data.method === "qris";
  const isCstore = data.method === "cstore";
  const isEwallet = ["gopay", "shopeepay"].includes(data.method);

  const status = data.status.toLowerCase();
  const isPaid = status === "paid" || status === "completed";
  const isPending = status === "pending";

  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: "",
    show: false,
  });
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [copying, setCopying] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!data.expired_at) return;

    const timer = setInterval(() => {
      setCountdown(formatCountdown(data.expired_at));
    }, 1000);

    return () => clearInterval(timer);
  }, [data.expired_at]);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: "", show: false });
    }, 3000);
  };

  const copyToClipboard = async (text: string | null, field: string) => {
    if (!text) return;
    try {
      setCopying(field);
      await navigator.clipboard.writeText(text);
      showToast("Berhasil disalin ke clipboard");
    } catch (err) {
      showToast("Gagal menyalin. Silakan salin manual.");
    } finally {
      setCopying(null);
    }
  };

  const downloadQRIS = async () => {
    if (!data.qris_content && !data.qris_url) return;

    try {
      setDownloading(true);
      showToast("Mengunduh QRIS...");

      const qrisData = data.qris_content || data.qris_url;
      if (!qrisData) return;

      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrisData)}`;

      const response = await fetch(qrApiUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qris-${data.transaction.transaction_code || "payment"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast("QRIS berhasil diunduh");
    } catch (err) {
      showToast("Gagal mengunduh QRIS. Silakan screenshot dari layar.");
    } finally {
      setDownloading(false);
    }
  };

  const getPaymentLabel = () => {
    const method = data.method;
    const channel = data.channel ? ` - ${data.channel.toUpperCase()}` : "";
    return `${method}${channel}`;
  };

  const renderPaymentDetails = () => {
    if (isPaid) {
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Detail Pembayaran
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-700">Waktu Pembayaran</span>
            <span className="font-semibold text-emerald-900">
              {data.paid_at ? formatDate(data.paid_at) : "-"}
            </span>
          </div>
          {data.payment_number && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-700">Nomor Pembayaran</span>
              <span className="font-mono font-bold text-emerald-900">
                {data.payment_number}
              </span>
            </div>
          )}
        </div>
      );
    }

    if (status === "expired") {
      return (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">
            Detail Pembayaran
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-orange-700">Batas Waktu</span>
            <span className="font-semibold text-orange-900">
              {data.expired_at ? formatDate(data.expired_at) : "-"}
            </span>
          </div>
          <p className="text-xs text-orange-600">
            Pembayaran telah melewati batas waktu. Silakan buat transaksi baru.
          </p>
        </div>
      );
    }

    if (status === "cancelled" || status === "canceled") {
      return (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">
            Detail Pembayaran
          </p>
          <p className="text-xs text-rose-600">
            Transaksi ini telah dibatalkan. Silakan buat transaksi baru jika ingin melanjutkan.
          </p>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
            Detail Pembayaran
          </p>
          <p className="text-xs text-red-600">
            Pembayaran gagal diproses. Silakan coba lagi atau pilih metode pembayaran lain.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {isVa && data.payment_number && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Virtual Account
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Bank</span>
              <span className="text-sm font-bold text-slate-900 uppercase">
                {data.channel || "-"}
              </span>
            </div>
            {data.account_name && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Atas Nama</span>
                <span className="text-sm font-semibold text-slate-900">
                  {data.account_name}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-slate-600">Nomor VA</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-600 font-mono">
                  {data.payment_number}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(data.payment_number, "payment_number")}
                  disabled={copying === "payment_number"}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copying === "payment_number" ? (
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon icon="mdi:content-copy" width={16} height={16} />
                  )}
                </button>
              </div>
            </div>
            {data.expired_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Batas Pembayaran</span>
                <span className="text-sm font-semibold text-rose-600">
                  {formatDate(data.expired_at)}
                </span>
              </div>
            )}
            {data.expired_at && (
              <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Sisa Waktu</span>
                <span className="text-sm font-bold text-blue-600 font-mono">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        )}

        {isQris && data.qris_content && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              QRIS
            </p>
            <div className="flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(data.qris_content)}`}
                alt="QRIS"
                className="w-48 h-48 object-contain border border-slate-200 rounded-xl"
              />
            </div>
            <button
              type="button"
              onClick={downloadQRIS}
              disabled={downloading}
              className="w-full py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                  Mengunduh...
                </>
              ) : (
                "Download Gambar QRIS"
              )}
            </button>
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <p className="text-[10px] text-slate-400 font-medium mb-1">Data QRIS</p>
              <p className="text-[11px] font-mono text-slate-700 break-all">
                {data.qris_content}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(data.qris_content, "qris_content")}
              disabled={copying === "qris_content"}
              className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {copying === "qris_content" ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                  Menyalin...
                </>
              ) : (
                "Salin Data QRIS"
              )}
            </button>
            {data.expired_at && (
              <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Sisa Waktu</span>
                <span className="text-sm font-bold text-blue-600 font-mono">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        )}

        {isQris && data.qris_url && !data.qris_content && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              QRIS
            </p>
            <div className="flex justify-center">
              <img
                src={data.qris_url}
                alt="QRIS"
                className="w-48 h-48 object-contain border border-slate-200 rounded-xl"
              />
            </div>
            <button
              type="button"
              onClick={downloadQRIS}
              disabled={downloading}
              className="w-full py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                  Mengunduh...
                </>
              ) : (
                "Download Gambar QRIS"
              )}
            </button>
            {data.expired_at && (
              <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Sisa Waktu</span>
                <span className="text-sm font-bold text-blue-600 font-mono">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        )}

        {isCstore && data.payment_code && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {data.channel === "indomaret" ? "Indomaret" : "Alfamart"}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Kode Pembayaran</span>
              <span className="text-sm font-bold text-blue-600 font-mono">
                {data.payment_code}
              </span>
            </div>
            {data.expired_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Batas Pembayaran</span>
                <span className="text-sm font-semibold text-rose-600">
                  {formatDate(data.expired_at)}
                </span>
              </div>
            )}
            {data.expired_at && (
              <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Sisa Waktu</span>
                <span className="text-sm font-bold text-blue-600 font-mono">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        )}

        {isEwallet && data.payment_url && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {data.channel === "gopay" ? "GoPay" : "ShopeePay"}
            </p>
            <a
              href={data.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm text-center rounded-xl transition-colors"
            >
              Lanjutkan Pembayaran
            </a>
            {data.expired_at && (
              <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Sisa Waktu</span>
                <span className="text-sm font-bold text-blue-600 font-mono">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        )}

        {!isVa && !isQris && !isCstore && !isEwallet && data.payment_url && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Link Pembayaran
            </p>
            <a
              href={data.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm text-center rounded-xl transition-colors"
            >
              Bayar Sekarang
            </a>
            {data.expired_at && (
              <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Sisa Waktu</span>
                <span className="text-sm font-bold text-blue-600 font-mono">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Price Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900">Rincian Pembayaran</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Harga</span>
          <span className="font-semibold text-slate-900">
            {formatRupiah(data.transaction.price)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Admin Fee</span>
          <span className="font-semibold text-slate-900">
            {formatRupiah(data.transaction.admin_fee)}
          </span>
        </div>
        <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-slate-900">Total Pembayaran</span>
          <span className="font-extrabold text-blue-600 text-base">
            {formatRupiah(data.transaction.amount)}
          </span>
        </div>
      </div>

      {/* Payment Instructions - only show if pending */}
      {isPending && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Instruksi Pembayaran
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Metode:</span>
            <span className="text-sm font-bold text-slate-900">
              {getPaymentLabel()}
            </span>
          </div>
          {renderPaymentDetails()}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push("/history")}
          className="flex-1 py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-slate-900/10"
        >
          Lihat Riwayat Pemesanan
        </button>
        <button
          onClick={() => router.push("/")}
          className="flex-1 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:check" width={14} height={14} className="text-white" />
            </div>
            <p className="text-sm font-medium text-white">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};
