export interface ProfileData {
  id: number;
  name: string;
  phone: string;
  email: string;
  point_balance: number | string; // Bisa berupa number atau string tergantung dari API
}

export interface BookingPayload {
  product_id: number;
  transport_route_id: number;
  schedule_id: number;
  contact_name: string;
  contact_phone: string;
  date: string; // YYYY-MM-DD
  origin: string;
  destination: string;
  payment_method_id: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    booking_id: string;
    transaction_id: number;
    booking_code: string;
    total_price: number;
    payment_url: string | null;
    redirect_type: string;
  };
}
