// schedule/services/scheduleService.ts
import { publicApi } from "@/lib/api/publicApi";
import { ScheduleResponse } from "@/features/schedule/types/schedule";

export const getRouteSchedule = async (
  id: string | number,
): Promise<ScheduleResponse> => {
  const response = await publicApi.get<ScheduleResponse>(
    `/transport-routes/${id}`,
  );
  return response.data;
};
