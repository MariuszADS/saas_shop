import type { CartItem } from "@/types/cart";
import { createCheckoutPayload } from "@/utils/checkout";

const API_URL = "http://localhost:3000";

export async function createOrder(
  cart: CartItem[],
  token: string
) {
  const payload = createCheckoutPayload(cart);

  const response = await fetch(
    `${API_URL}/api/orders`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create order"
    );
  }

  return data;
}