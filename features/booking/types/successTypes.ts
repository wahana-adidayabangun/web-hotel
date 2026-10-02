// features/booking/types/success.types.ts

export interface BookingSuccessData {
  booking_id: number;
  booking_code: string;
  total_price: number;
  payment_url: string | null;
  redirect_type: string;
}

export interface BookingSuccessResponse {
  success: boolean;
  message: string;
  data: BookingSuccessData;
}
