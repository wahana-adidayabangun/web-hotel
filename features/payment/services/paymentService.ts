// features/payment/services/paymentService.ts
import { privateApi } from "@/lib/api/privateApi";
import { PaymentDetailResponse } from "../types/payment";

export const getPaymentDetail = async (
  transactionId: string | number,
): Promise<PaymentDetailResponse> => {
  const response = await privateApi.get<PaymentDetailResponse>("/payment", {
    params: {
      transaction_id: transactionId,
    },
  });
  return response.data;
};
