import { privateApi } from "@/lib/api/privateApi";
import { BookingPayload, BookingResponse } from "../types/booking";

export const createBooking = async (
  payload: BookingPayload,
): Promise<BookingResponse> => {
  const response = await privateApi.post<BookingResponse>("/booking", payload);
  return response.data;
};
