// features/history/hooks/useMyBookings.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { historyService } from "@/features/history/services/historyService";
import { PaginatedBookings } from "@/features/history/types/historyTypes";

export const useMyBookings = (initialPage = 1) => {
  const [data, setData] = useState<PaginatedBookings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);

  const fetchBookings = useCallback(async (currentPage: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await historyService.getMyBookings(currentPage);
      if (res.success) {
        setData(res.data);
      } else {
        setError("Gagal mengambil data riwayat pemesanan.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Terjadi kesalahan saat memuat data.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(page);
  }, [fetchBookings, page]);

  return {
    bookings: data?.data || [],
    pagination: data,
    isLoading,
    error,
    page,
    setPage,
    refetch: () => fetchBookings(page),
  };
};
