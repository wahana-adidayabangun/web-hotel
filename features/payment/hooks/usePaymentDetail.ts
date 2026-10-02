"use client";

import { useState, useEffect } from "react";
import { getPaymentDetail } from "@/features/payment/services/paymentService";
import { PaymentData } from "@/features/payment/types/payment";

export const usePaymentDetail = (transactionId: string | number | null) => {
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) {
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getPaymentDetail(transactionId);
        if (res.success) {
          setData(res.data);
        } else {
          setError("Gagal memuat detail pembayaran.");
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Terjadi kesalahan saat memuat detail pembayaran.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [transactionId]);

  return { data, loading, error };
};
