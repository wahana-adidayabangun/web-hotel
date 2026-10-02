// features/booking/hooks/usePaymentMethods.ts
import { useState, useEffect } from "react";
import { getPaymentMethods } from "@/features/booking/services/paymentService";
import { PaymentMethod } from "@/features/booking/types/payment";

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const res = await getPaymentMethods();
        if (res.success) {
          setPaymentMethods(res.data);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Gagal memuat metode pembayaran.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  return { paymentMethods, loading, error };
};
