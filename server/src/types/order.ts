

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "vipps"
  | "klarna";

export interface OrderItemInput {
  productId: number;
  quantity: number;
}

export interface ShippingAddressInput {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderInput {
  userId: number;
  items: OrderItemInput[];

  shippingAddress: ShippingAddressInput;

  paymentMethod: PaymentMethod;
}