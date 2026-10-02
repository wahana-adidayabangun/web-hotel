// features/transaction/hooks/useTransactionList.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { transactionService } from "@/features/transaction/services/transactionService";
import { PaginatedTransactions } from "@/features/transaction/types/transactionTypes";

export const useTransactionList = (initialPage: number = 1) => {
  const [data, setData] = useState<PaginatedTransactions | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (currentPage: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await transactionService.getMyTransactions(currentPage);
      if (res.success) {
        setData(res.data);
      } else {
        setError("Gagal memuat daftar transaksi.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Terjadi kesalahan saat mengambil daftar transaksi.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(page);
  }, [fetchTransactions, page]);

  return {
    transactions: data?.data || [],
    pagination: data,
    page,
    setPage,
    isLoading,
    error,
    refetch: () => fetchTransactions(page),
  };
};
