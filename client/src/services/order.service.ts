import type { CartItem } from "@/types/cart";
import type {
  Order,
  AdminOrder,
} from "@/types/order";
import type { CheckoutData } from "@/types/checkout";

import { createCheckoutPayload } from "@/utils/checkout_utils";

const API_URL = "http://localhost:3000";

export async function getAdminOrders(
  token: string
): Promise<AdminOrder[]> {
  const response = await fetch(
    `${API_URL}/api/admin/orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch admin orders"
    );
  }

  return data;
}

export async function updateAdminOrderStatus(
  orderId: number,
  status: string,
  token: string
) {
  const response = await fetch(
    `${API_URL}/api/admin/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update order status"
    );
  }

  return data;
}

export async function createOrder(
  cart: CartItem[],
  checkoutData: CheckoutData,
  token: string
) {
  const payload = createCheckoutPayload(
    cart,
    checkoutData
  );

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
      data.message ||
        "Failed to create order"
    );
  }

  return data;
}

export async function getMyOrders(
  token: string
): Promise<Order[]> {
  const response = await fetch(
    `${API_URL}/api/orders/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch orders"
    );
  }

  return data;
}