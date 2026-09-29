import { useState } from "react";

import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/services/order.service";

export default function CartPage() {
  const {
    cart,
    subtotal,
    removeItem,
    setQuantity,
    clearCart,
  } = useCart();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setMessage("You must be logged in.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const order = await createOrder(
        cart,
        token
      );

      clearCart();

      setMessage(
        `Order #${order.id} created successfully.`
      );
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <main>
        <h1>Cart</h1>
        <p>Your cart is empty.</p>

        {message && <p>{message}</p>}
      </main>
    );
  }

  return (
    <main>
      <h1>Cart</h1>

      {cart.map((item) => (
        <div key={item.productId}>
          <h2>{item.name}</h2>

          <p>Price: {item.price}</p>

          <p>
            Quantity: {item.quantity}
          </p>

          <button
            onClick={() =>
              setQuantity(
                item.productId,
                item.quantity - 1
              )
            }
          >
            -
          </button>

          <button
            onClick={() =>
              setQuantity(
                item.productId,
                item.quantity + 1
              )
            }
          >
            +
          </button>

          <button
            onClick={() =>
              removeItem(item.productId)
            }
          >
            Remove
          </button>

          <p>
            Item total:
            {" "}
            {item.price * item.quantity}
          </p>
        </div>
      ))}

      <hr />

      <p>
        Subtotal: {subtotal}
      </p>

      <button
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading
          ? "Creating order..."
          : "Checkout"}
      </button>

      {message && <p>{message}</p>}
    </main>
  );
}