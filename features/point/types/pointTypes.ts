// features/point/types/pointTypes.ts

export interface PointPackage {
  id: number;
  product_id: number;
  name: string;
  description: string;
  amount: number;
  price: number;
  discount: number;
}

export interface BuyPointPayload {
  product_id: number;
  point_id: number;
  payment_method_id: number;
}

export interface TransactionDetails {
  id: number;
  transaction_code: string;
  uuid: string;
  amount: number;
  status: string;
  direction: string;
  payment_method: string;
  description: string;
  created_at: string;
}

export interface ProductDetails {
  id: number;
  name: string;
  route: string;
  image: string | null;
}

export interface BuyPointData {
  transaction_id: number;
  transaction: TransactionDetails;
  product: ProductDetails;
  point: PointPackage;
}

export interface BuyPointResponse {
  success: boolean;
  message: string;
  data: BuyPointData;
}