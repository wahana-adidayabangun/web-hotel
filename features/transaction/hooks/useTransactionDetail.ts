// features/transaction/hooks/useTransactionDetail.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { transactionService } from "@/features/transaction/services/transactionService";
import { TransactionDetail } from "@/features/transaction/types/transactionTypes";

export const useTransactionDetail = (id: string | number | null) => {
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (currentId: string | number) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await transactionService.getMyTransactionById(currentId);

      const raw = (res as any)?.data ?? res;

      if (raw && typeof raw === "object" && "id" in raw) {
        setTransaction(raw as TransactionDetail);
      } else {
        setError("Transaksi tidak ditemukan.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Gagal memuat detail transaksi.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    fetchDetail(id);
  }, [id, fetchDetail]);

  return { transaction, isLoading, error, refetch: () => id && fetchDetail(id) };
};
