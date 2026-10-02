// features/booking/services/paymentService.ts
import { publicApi } from "@/lib/api/publicApi";
import { PaymentMethodsResponse } from "../types/payment";

export const getPaymentMethods = async (): Promise<PaymentMethodsResponse> => {
  const response = await publicApi.get<PaymentMethodsResponse>(
    "/payment-methods",
  );
  return response.data;
};
