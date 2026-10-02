// features/booking/types/payment.ts
export interface PaymentMethod {
  id: number;
  name: string;
  payment_type: string;
  channel_code: string;
  description: string;
  icon: string;
  color: string;
  admin_fee: number;
  is_active: boolean;
  is_booking_payment: boolean;
}

export interface PaymentMethodsResponse {
  success: boolean;
  data: PaymentMethod[];
}
