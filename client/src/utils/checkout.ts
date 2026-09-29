import type { CartItem } from "@/types/cart";

export function createCheckoutPayload(
  cart: CartItem[]
) {
  return {
    items: cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };
}