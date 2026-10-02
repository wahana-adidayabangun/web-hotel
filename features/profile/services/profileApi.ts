// features/profile/services/profileApi.ts
import { privateApi } from "@/lib/api/privateApi";
import { ProfileResponse } from "@/features/profile/types/profileTypes";

export const getProfileApi = async (): Promise<ProfileResponse> => {
  const response = await privateApi.get<ProfileResponse>("/profile");
  return response.data;
};
