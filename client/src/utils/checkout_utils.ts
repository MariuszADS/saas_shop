import type { CartItem } from "@/types/cart";
import type { CheckoutData } from "@/types/checkout";

export function createCheckoutPayload(
  cart: CartItem[],
  checkoutData: CheckoutData
) {
  return {
    items: cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),

    shippingAddress: checkoutData.shippingAddress,
    paymentMethod: checkoutData.paymentMethod,
  };
}