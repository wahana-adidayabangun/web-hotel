// features/history/hooks/useBookingDetail.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { historyService } from "@/features/history/services/historyService";
import { BookingDetail } from "@/features/history/types/historyTypes";

export const useBookingDetail = (id: string | number | null) => {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      setError("ID Booking tidak valid.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await historyService.getBookingDetail(id);
      if (res.success) {
        setBooking(res.data);
      } else {
        setError(res.message || "Gagal mengambil detail booking.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Terjadi kesalahan saat memuat detail booking.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    booking,
    isLoading,
    error,
    refetch: fetchDetail,
  };
};
