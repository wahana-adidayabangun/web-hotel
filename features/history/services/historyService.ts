// features/history/services/historyService.ts

import { privateApi } from "@/lib/api/privateApi";
import {
  MyBookingsResponse,
  BookingDetailResponse,
} from "@/features/history/types/historyTypes";

export const historyService = {
  getMyBookings: async (page = 1): Promise<MyBookingsResponse> => {
    const response = await privateApi.get<MyBookingsResponse>(
      `/booking/my-bookings?page=${page}`,
    );
    return response.data;
  },
  getBookingDetail: async (
    id: string | number,
  ): Promise<BookingDetailResponse> => {
    const response = await privateApi.get<BookingDetailResponse>(
      `/booking/my-bookings/${id}`,
    );
    return response.data;
  },
};
