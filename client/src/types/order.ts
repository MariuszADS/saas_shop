export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "failed";

export type PaymentMethod =
  | "vipps"
  | "klarna";

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: string;
  created_at: string;
  updated_at: string;

  items: OrderItem[];

  shipping_name?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
  shipping_country?: string;

  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
}

export interface AdminOrder extends Order {
  user_id: number;
  email: string;
}