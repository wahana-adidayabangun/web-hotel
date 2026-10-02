// schedule/hooks/useSchedule.ts
import { useEffect, useState } from "react";
import { getRouteSchedule } from "@/features/schedule/services/scheduleService";
import { ScheduleRouteData } from "@/features/schedule/types/schedule";

export const useSchedule = (routeId: string | null) => {
  const [routeDetail, setRouteDetail] = useState<ScheduleRouteData | null>(
    null,
  );
  const [serverTime, setServerTime] = useState<string>("");
  const [activeType, setActiveType] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!routeId) {
      setError("ID Rute tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getRouteSchedule(routeId);
        if (res.success) {
          setRouteDetail(res.data);
          setServerTime(res.server_time);
          setActiveType(res.active_type);
          setCurrentDate(res.current_date);
        }
      } catch (err) {
        setError("Gagal memuat jadwal keberangkatan");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [routeId]);

  return { routeDetail, serverTime, activeType, currentDate, loading, error };
};
