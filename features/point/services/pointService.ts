// features/point/services/pointService.ts

import { privateApi } from "@/lib/api/privateApi";
import {
  PointPackage,
  BuyPointPayload,
  BuyPointResponse,
} from "@/features/point/types/pointTypes";

export const pointService = {
  getPointPackages: async (): Promise<PointPackage[]> => {
    const response = await privateApi.get<PointPackage[]>("/points");
    return response.data;
  },

  buyPointPackage: async (
    payload: BuyPointPayload,
  ): Promise<BuyPointResponse> => {
    const response = await privateApi.post<BuyPointResponse>(
      "/points/buy",
      payload,
    );
    return response.data;
  },
};
