import { useState } from "react";

import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/services/order.service";

export function CheckoutTest() {
  const {
    cart,
    subtotal,
    clearCart,
  } = useCart();

  const [message, setMessage] = useState("");

  async function handleCheckout() {
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MDY5NTEzNiwiZXhwIjoxNzkwNjk2MDM2fQ.A-QPnQmqZ6db_qKuOhzEvjyGHJrYdYzheA2Yohx4N2o";

      const order = await createOrder(
        cart,
        token
      );

      setMessage(
        `Order created: ${order.id}`
      );

      clearCart();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  }

  return (
    <div>
      <p>Products: {cart.length}</p>
      <p>Subtotal: {subtotal}</p>

      <button
        onClick={handleCheckout}
        disabled={cart.length === 0}
      >
        Checkout
      </button>

      <p>{message}</p>
    </div>
  );
}