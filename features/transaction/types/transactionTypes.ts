// features/transaction/types/transactionTypes.ts

export interface TransactionItem {
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
  status: "pending" | "completed" | "paid" | "failed" | "cancelled" | string;
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

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginatedTransactions {
  current_page: number;
  data: TransactionItem[];
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

export interface TransactionListResponse {
  success: boolean;
  data: PaginatedTransactions;
}

export interface Bank {
  id: number;
  name: string;
  code: string;
  logo: string;
  account_number: string;
  account_name: string;
}

export interface BankListResponse {
  success: boolean;
  data: Bank[];
}

export interface TransactionablePoint {
  id: number;
  product_id: number;
  name: string;
  description: string;
  amount: number;
  price: number;
  discount: number;
}

export interface TransactionDetail {
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
  admin_fee: number;
  amount: number;
  direction: string;
  status: "pending" | "completed" | "paid" | "failed" | "cancelled" | string;
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
  transactionable?: TransactionablePoint;
}

export interface TransactionDetailResponse {
  success: boolean;
  message?: string;
  data: TransactionDetail;
}
