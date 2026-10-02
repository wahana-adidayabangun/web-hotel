// features/point/hooks/usePoints.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { pointService } from "@/features/point/services/pointService";
import { PointPackage } from "@/features/point/types/pointTypes";

export const usePoints = () => {
  const [packages, setPackages] = useState<PointPackage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await pointService.getPointPackages();
      setPackages(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Gagal memuat daftar paket poin.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    isLoading,
    error,
    refetch: fetchPackages,
  };
};
