// features/payment/types/payment.ts
export interface PaymentTransactionable {
  type: string;
  id: number;
  booking_code: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  status: string;
  payment_status: string;
  total_price: number;
}

export interface PaymentTransaction {
  id: number;
  transaction_code: string;
  uuid: string;
  user_id: number;
  product_id: number;
  amount: number;
  admin_fee: number;
  discount_total: number;
  price: number;
  direction: string;
  status: string;
  description: string;
  transactionable: PaymentTransactionable;
}

export interface PaymentData {
  id: number;
  transaction_id: number;
  gateway: string;
  method: string;
  channel: string;
  request_id: string;
  payment_number: string | null;
  payment_code: string | null;
  account_name: string | null;
  qris_content: string | null;
  qris_url: string | null;
  payment_url: string | null;
  status: string;
  expired_at: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  transaction: PaymentTransaction;
}

export interface PaymentDetailResponse {
  success: boolean;
  data: PaymentData;
}
