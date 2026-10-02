// features/history/types/historyTypes.ts

export interface BookingHistoryItem {
  id: number;
  booking_code: string;
  user_id: number;
  contact_name: string;
  contact_phone: string;
  uuid: string;
  transport_route_id: number;
  schedule_id: number;
  total_seats: number;
  price: number;
  total_price: number;
  date: string;
  time: string;
  schedule_type: string;
  origin: string;
  destination: string;
  vehicle: string;
  plate_number: string | null;
  code: string;
  driver_name: string | null;
  contact_driver: string;
  payment_method: string;
  payment_status: "paid" | "unpaid" | "failed" | "pending" | string;
  paid_at: string | null;
  status: "pending" | "scheduled" | "completed" | "cancelled" | string;
  is_read: number;
  created_at: string;
  updated_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page?: number | null;
  active: boolean;
}

export interface PaginatedBookings {
  current_page: number;
  data: BookingHistoryItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface MyBookingsResponse {
  success: boolean;
  data: PaginatedBookings;
}
// Detail Booking Response
export interface BookingTransaction {
  id: number;
  transaction_code: string;
  user_id: number;
  uuid: string;
  qr_code: string | null;
  product_id: number;
  transactionable_type: string;
  transactionable_id: number;
  discount_total: number;
  price: number;
  amount: number;
  direction: string;
  status: string;
  payment_method: string;
  payment_token: string | null;
  invoice_id: string | null;
  reference_id: string | null;
  payment_url: string | null;
  image: string | null;
  description: string;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}
export interface BookingDetail {
  id: number;
  booking_code: string;
  user_id: number;
  contact_name: string;
  contact_phone: string;
  uuid: string;
  transport_route_id: number;
  schedule_id: number;
  total_seats: number;
  price: number;
  total_price: number;
  date: string;
  time: string;
  schedule_type: string;
  origin: string;
  destination: string;
  vehicle: string;
  plate_number: string | null;
  code: string;
  driver_name: string | null;
  contact_driver: string;
  payment_method: string;
  payment_status: "paid" | "unpaid" | "pending" | string;
  paid_at: string | null;
  status: "pending" | "scheduled" | "completed" | "cancelled" | string;
  is_read: number;
  created_at: string;
  updated_at: string;
  transactions?: BookingTransaction[];
}

export interface BookingDetailResponse {
  success: boolean;
  message?: string;
  data: BookingDetail;
}
