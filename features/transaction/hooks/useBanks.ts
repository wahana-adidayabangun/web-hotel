// features/transaction/hooks/useBanks.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { transactionService } from "@/features/transaction/services/transactionService";
import { Bank } from "@/features/transaction/types/transactionTypes";

export const useBanks = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await transactionService.getBanks();
      if (res.success) {
        setBanks(res.data);
      } else {
        setError("Gagal memuat daftar rekening bank.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Terjadi kesalahan saat memuat daftar bank.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  return {
    banks,
    isLoading,
    error,
    refetch: fetchBanks,
  };
};
