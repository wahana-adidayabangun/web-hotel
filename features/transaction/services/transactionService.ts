// features/transaction/services/transactionService.ts

import { privateApi } from "@/lib/api/privateApi";
import {
  TransactionListResponse,
  TransactionDetailResponse,
  BankListResponse,
} from "@/features/transaction/types/transactionTypes";

export const transactionService = {
  getMyTransactions: async (
    page: number = 1,
  ): Promise<TransactionListResponse> => {
    const response = await privateApi.get<TransactionListResponse>(
      `/my-transaction`,
      {
        params: { page },
      },
    );
    return response.data;
  },
  getMyTransactionById: async (
    id: number | string,
  ): Promise<TransactionDetailResponse> => {
    const response = await privateApi.get<TransactionDetailResponse>(
      `/my-transaction/${id}`,
    );
    return response.data;
  },
  getBanks: async (): Promise<BankListResponse> => {
    const response = await privateApi.get<BankListResponse>("/banks");
    return response.data;
  },
};
