export type PaymentMethod =
  | "vipps"
  | "klarna";

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}